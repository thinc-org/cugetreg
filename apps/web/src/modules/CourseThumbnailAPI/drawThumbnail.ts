import { i18n } from '@web/common/i18n'
import { getPaletteRange } from '@web/common/utils/getPaletteRange'
import { lightTheme } from '@web/configs/theme'
import { ENABLE_DAY_OF_WEEK_THUMBNAIL } from '@web/env'
import { getDayColor } from '@web/modules/CourseThumbnailAPI/utils/getDayColor'
import { getDaysOfWeek } from '@web/modules/CourseThumbnailAPI/utils/getDaysOfWeek'
import { Canvas, CanvasRenderingContext2D, loadImage, registerFont } from 'canvas'

import { CourseThumbnailData } from '@cgr/course-utils'

registerFont('public/fonts/Poppins-Bold.ttf', { family: 'Poppins Bold' })
registerFont('public/fonts/Prompt-Bold.ttf', { family: 'Prompt Bold' })
registerFont('public/fonts/Prompt-Medium.ttf', { family: 'Prompt Medium' })
const background = loadImage('public/thumbnailBackground.png')

const theme = lightTheme
const width = 1200
const height = 630

export async function drawThumbnail(canvas: Canvas, course: CourseThumbnailData) {
  const { courseNo, abbrName, courseNameTh, courseNameEn, genEdType } = course
  const ctx = canvas.getContext('2d')

  ctx.drawImage(await background, 0, 0, width, height)

  setTextStyle(ctx, 'Poppins Bold', 36, theme.palette.primaryRange[100])
  drawText(ctx, courseNo, 64, 253)
  setTextStyle(ctx, 'Poppins Bold', 60, theme.palette.primary.main)
  drawText(ctx, abbrName, 64, 326)
  const abbrNameMetrics = ctx.measureText(abbrName)

  setTextStyle(ctx, 'Prompt Bold', 30, theme.palette.primary.main)
  drawText(ctx, courseNameTh, 64, 402)
  setTextStyle(ctx, 'Poppins Bold', 30, theme.palette.primary.main)
  drawText(ctx, courseNameEn, 64, 447)

  if (genEdType !== 'NO') {
    const genEdColor = getPaletteRange(theme, genEdType)[700]
    const genEdText = i18n.t(genEdType, { ns: 'courseThumbnail' })
    setTextStyle(ctx, 'Prompt Medium', 24, genEdColor)
    drawText(ctx, genEdText, 64 + abbrNameMetrics.width + 57, 312)

    const genEdMetrics = ctx.measureText(genEdText)
    drawRoundRect(ctx, 64 + abbrNameMetrics.width + 27, 285, genEdMetrics.width + 60, 40, 24)
    ctx.strokeStyle = genEdColor
    ctx.lineWidth = 3
    ctx.stroke()

    ctx.fillStyle = genEdColor
    ctx.fillRect(0, height - 56, width, 56)
  }

  if (ENABLE_DAY_OF_WEEK_THUMBNAIL) {
    let offset = 0
    getDaysOfWeek(course).forEach((dayOfWeek) => {
      ctx.fillStyle = getDayColor(theme, dayOfWeek)
      drawRoundRect(ctx, 64 + offset, 116, 48, 48, 24)
      ctx.fill()

      setTextStyle(ctx, 'Poppins Bold', 24, 'white')
      const dayOfWeekMetrics = ctx.measureText(dayOfWeek)
      const centerOffset = (48 - dayOfWeekMetrics.width) / 2
      drawText(ctx, dayOfWeek, 64 + offset + centerOffset, 149)
      offset += 64
    })
  }
}

function setTextStyle(ctx: CanvasRenderingContext2D, font: string, size: number, color: string) {
  ctx.font = `${size}px "${font}"`
  ctx.fillStyle = color
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.fillText(text, x, y)
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  r = Math.min(r, w / 2)
  r = Math.min(r, h / 2)

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
