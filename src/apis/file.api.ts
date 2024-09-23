import http from 'src/utils/http'

const URL = 'files/image'

const fileApi = {
  uploadFile(formData: FormData) {
    return http.post(URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default fileApi
