import { ParamsConfig, Product, ProductList } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'products'
const productApi = {
  getProducts(params: ParamsConfig) {
    return http.get<SuccessResponse<Product[]>>(`${URL}/list`, {
      params
    })
  },
  getProductsSuper(params: ParamsConfig) {
    return http.get<SuccessResponse<Product[]>>(`${URL}`, {
      params
    })
  },
  detailProduct(id: number) {
    return http.get<Product>(`${URL}/${id}`)
  },
  deleteProducts(params: string) {
    return http.delete<SuccessResponse<Product[]>>(`${URL}/${params}`)
  },
  addProduct(body: Product) {
    return http.post(URL, body)
  },
  updateProduct(id: number, body: Product) {
    return http.put(`${URL}/update/${id}`, body)
  }
}

export default productApi
