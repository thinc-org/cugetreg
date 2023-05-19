import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'

import { validateOrReject } from 'class-validator'
import { randomBytes } from 'crypto'
import { Credentials, TokenPayload } from 'google-auth-library'
import { OAuth2Client } from 'googleapis-common'
import { drive } from 'googleapis/build/src/apis/drive'
import { oauth2 } from 'googleapis/build/src/apis/oauth2'
import { Model } from 'mongoose'
import { serializeError } from 'serialize-error'

import { CourseCartItem, RefreshToken, User, UserDocument } from '@cgr/schema'

import { AccessTokenPayload } from './auth.dto'

@Injectable()
export class AuthService {
  logger: Logger

  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel('user') private userModel: Model<User>,
    @InjectModel('refreshtoken')
    private refreshTokenModel: Model<RefreshToken>
  ) {
    this.logger = new Logger('Auth Service')
  }

  generateGoogleOauthClient(): OAuth2Client {
    return new OAuth2Client({
      clientId: this.configService.get('googleOAuthId'),
      clientSecret: this.configService.get('googleOAuthSecret'),
    })
  }

  getGoogleCallbackUrl(overrideBackendUrl: string | undefined): string {
    const backendApiUrl = overrideBackendUrl ?? `${this.configService.get('backendPublicUrl')}`
    return `${backendApiUrl}/auth/google/callback`
  }

  async issueRefreshToken(user: UserDocument): Promise<string> {
    const token = new this.refreshTokenModel()
    token.refreshToken = randomBytes(64).toString('base64')
    token.userId = user._id
    await token.save()
    this.logger.log('Issued refresh token', { userId: token.userId })
    return token.refreshToken
  }

  async revokeRefreshTokenToken(token: string) {
    this.logger.log('Revoked refresh token', { token })
    await this.refreshTokenModel.findOneAndDelete({ refreshToken: token })
  }

  async issueAccessToken(refreshtoken: string): Promise<string> {
    const doc = await this.refreshTokenModel.findOne({
      refreshToken: refreshtoken,
    })
    if (!doc) {
      this.logger.warn('Invalid refresh token', { refreshtoken })
      throw new BadRequestException('Not a valid refresh token')
    }
    const token: AccessTokenPayload = { _id: doc.userId.toHexString() }
    this.logger.log('Issued access token', { userId: doc.userId })
    return this.jwtService.sign(token)
  }

  async validateGoogleIdToken(idToken: string) {
    const client = this.generateGoogleOauthClient()
    let payload: TokenPayload
    try {
      // verifyIdToken will throw an error if the token is invalid
      const ticket = await client.verifyIdToken({
        idToken,
        audience: this.configService.get('googleOAuthId'),
      })
      payload = ticket.getPayload()
    } catch {
      throw new BadRequestException('Invalid id token')
    }
    if (payload.hd !== 'student.chula.ac.th') {
      throw new ForbiddenException('User hosted_domain is not student.chula.ac.th')
    }
    return payload
  }

  async handleGoogleIdToken(payload: TokenPayload) {
    // User lookup
    let user = await this.userModel.findOne({
      'google.googleId': payload.sub,
    })
    if (!user) {
      user = new this.userModel()
      user.email = payload.email
      user.name = payload.name
      user.google = {
        googleId: payload.sub,
        hasMigratedGDrive: true, // no need to handle gdrive migration anymore
      }
      await user.save()
      this.logger.log('Created new user with Google Auth through id token', { user })
    }

    // Issue token
    return {
      refreshToken: await this.issueRefreshToken(user),
    }
  }

  async handleGoogleOauthCode(
    code: string,
    overrideBackendUrl: string | undefined
  ): Promise<{ refreshToken: string }> {
    // Authenticate code
    const client = this.generateGoogleOauthClient()
    let tokens: Credentials
    try {
      const res = await client.getToken({
        redirect_uri: this.getGoogleCallbackUrl(overrideBackendUrl),
        code,
      })
      tokens = res.tokens
    } catch (err) {
      this.logger.warn('Google Auth code exchange failed', { err, code })
      throw new BadRequestException('Fail to login. Please try again.')
    }
    client.setCredentials(tokens)

    // User lookup
    const userInfo = (await oauth2('v2').userinfo.get({ auth: client })).data
    if (userInfo.hd !== 'student.chula.ac.th') {
      throw new ForbiddenException('User hosted_domain is not student.chula.ac.th')
    }
    if (!userInfo.email || !userInfo.id || !userInfo.name) {
      this.logger.warn('UserInfo contains inssuficient data', { userInfo })
      throw new UnprocessableEntityException('Insufficient user data')
    }
    let user = await this.userModel.findOne({
      'google.googleId': userInfo.id,
    })
    if (!user) {
      user = new this.userModel()
      user.email = userInfo.email
      user.name = userInfo.name
      user.google = {
        googleId: userInfo.id,
        hasMigratedGDrive: false,
      }
      await user.save()
      this.logger.log('Created new user with Google Auth', { user })
    }

    // Handle legacy google drive data
    if (!user.google.hasMigratedGDrive) {
      try {
        if (tokens.scope.indexOf('https://www.googleapis.com/auth/drive.appdata') !== -1) {
          const d = drive({ version: 'v3', auth: client })
          const files = (await d.files.list({ spaces: 'appDataFolder' })).data.files
          if (files.length !== 1) throw { reason: 'No or Multiple cart files', count: files.length }
          const file = (await d.files.get({ fileId: files[0].id, fields: 'id,size' })).data
          if (parseInt(file.size) > 1000000)
            throw { reason: 'File size exceed limit', size: file.size }
          const data = (await d.files.get({ alt: 'media', fileId: file.id })).data

          if (!Array.isArray(data)) throw { reason: 'Object is not an array', data }

          const cartContent: CourseCartItem[] = []
          for (const e of data) {
            if (typeof e !== 'object') throw { reason: 'Migrated cart item is not an object', e }
            const item: CourseCartItem = {
              academicYear: e.academicYear,
              courseNo: e.courseNo,
              semester: e.semester,
              studyProgram: e.studyProgram,
              selectedSectionNo: e.selectedSectionNo,
              isHidden: false,
            }

            await validateOrReject(item, { forbidUnknownValues: true })
            cartContent.push(item)
          }
          user.courseCart = {
            cartContent,
          }
          this.logger.log('Migrated old course cart', {
            courseCart: user.courseCart,
            userId: user._id,
          })
        }
      } catch (e) {
        this.logger.warn('Error while migrating GDrive data', {
          err: serializeError(e),
          userId: user._id,
        })
      } finally {
        user.google.hasMigratedGDrive = true
        await user.save()
      }
    }

    // Issue token
    return {
      refreshToken: await this.issueRefreshToken(user),
    }
  }
}
