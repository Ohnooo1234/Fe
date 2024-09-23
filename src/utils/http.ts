import axios, { AxiosError, type AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constants/httpStatusCode.enum'
import { toast } from 'react-toastify'
import { AuthResponse } from 'src/types/auth.type'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS, setRoleToLS } from './auth'
import config from 'src/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REGISTER } from 'src/apis/auth.api'
import { isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from 'src/types/utils.type'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 20000000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && config.headers) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    // Add a response interceptor
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url?.startsWith(URL_LOGIN)) {
          const data = response.data as AuthResponse
          console.log(response.data + 'test')

          this.accessToken = data.token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(response.data)
          setRoleToLS(data.role)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // Chỉ toast lỗi không phải 422 và 401
        // if (
        //   ![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)
        // ) {
        //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
        //   const data: any | undefined = error.response?.data
        //   const message = data?.message || error.message
        //   toast.error(message)
        // }

        // Lỗi Unauthorized (401) có rất nhiều trường hợp
        // - Token không đúng
        // - Không truyền token
        // - Token hết hạn*

        // Nếu là lỗi 401
        // if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
        //   clearLS()
        //   this.accessToken = ''
        //   toast.error('Lỗi ủy quyền')
        // }
        return Promise.reject(error)
      }
    )
  }
}
const http = new Http().instance
export default http
