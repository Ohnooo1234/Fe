import http from 'src/utils/http'
import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/utils.type'
import { ParamsConfig } from 'src/types/product.type'

const URL = 'categorys'

const categoryApi = {
  getCategories(params: ParamsConfig) {
    return http.get<SuccessResponse<Category[]>>(URL, {
      params
    })
  },
  detailCategory(id: number) {
    return http.get<Category[]>(`${URL}/${id}`)
  },
  deleteCategories(params: string) {
    return http.delete<SuccessResponse<Category[]>>(`${URL}/${params}`)
  },
  addCategory(body: Category) {
    return http.post(URL, body)
  },
  updateCategory(id: number, body: Category) {
    return http.put(`${URL}/${id}`, body)
  }
}

export default categoryApi
