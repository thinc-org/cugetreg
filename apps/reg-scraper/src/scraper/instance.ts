import axios from 'axios'
import { HttpsCookieAgent } from 'http-cookie-agent/http'
import iconv from 'iconv-lite'
import tough from 'tough-cookie'

// make instance for collecting cookie
export const instance = axios.create({
  baseURL: 'https://www2.reg.chula.ac.th',
  withCredentials: true,
  responseType: 'arraybuffer',
  httpsAgent: new HttpsCookieAgent({
    cookies: {
      jar: new tough.CookieJar(),
    },
    rejectUnauthorized: false,
  }),
})
// decode data using TIS-620
instance.interceptors.response.use(function (response) {
  response.data = iconv.decode(response.data as unknown as Buffer, 'TIS-620')
  return response
})
