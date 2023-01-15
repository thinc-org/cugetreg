import axios, { AxiosResponse } from 'axios'
import axiosCookieJarSupport from 'axios-cookiejar-support'
import * as https from 'https'
import * as iconv from 'iconv-lite'
import * as tough from 'tough-cookie'

// make instance for collecting cookie
export const instance = axios.create({
  baseURL: 'https://www2.reg.chula.ac.th',
  withCredentials: true,
  responseType: 'arraybuffer',
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})
// decode data using TIS-620
instance.interceptors.response.use(function (response) {
  response.data = iconv.decode(response.data as any, 'TIS-620')
  return response
})

//setup cookie jar
axiosCookieJarSupport(instance)
instance.defaults.jar = new tough.CookieJar()