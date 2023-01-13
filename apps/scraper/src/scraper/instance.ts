import axios from "axios"
import axiosCookieJarSupport from "axios-cookiejar-support"
import https from "https"
import iconv from "iconv-lite"
import tough from "tough-cookie"

// make instance for collecting cookie
const instance = axios.create({
  baseURL: "https://www2.reg.chula.ac.th",
  withCredentials: true,
  responseType: "arraybuffer",
  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
})
// decode data using TIS-620
instance.interceptors.response.use(function (response) {
  response.data = iconv.decode(response.data, "TIS-620")
  return response
})

//setup cookie jar
axiosCookieJarSupport(instance)
instance.defaults.jar = new tough.CookieJar()

//export instance
export { instance }
