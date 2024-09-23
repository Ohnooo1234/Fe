import http from 'src/utils/http'
import { Category } from 'src/types/category.type'
import { SuccessResponse } from 'src/types/utils.type'
import { ParamsConfig } from 'src/types/product.type'
import { User } from 'src/types/user.type'
import { CartItemData } from 'src/types/cart.type'

const URL_CART = 'carts'
const URL_CART_ITEMS = 'cartitems'

const cartApi = {
  // getCategories(params: ParamsConfig) {
  //   return http.get<SuccessResponse<Category[]>>(URL, {
  //     params
  //   })
  // },
  // detailCategory(id: number) {
  //   return http.get<Category[]>(`${URL}/${id}`)
  // },
  // deleteCategories(params: string) {
  //   return http.delete<SuccessResponse<Category[]>>(`${URL}/${params}`)
  // },
  // addCategory(body: Category) {
  //   return http.post(URL, body)
  // },
  // updateCategory(id: number, body: Category) {
  //   return http.put(`${URL}/${id}`, body)
  // }
  addCart(body: User) {
    return http.post(URL_CART, body)
  },
  addCartItem(body: CartItemData) {
    return http.post(URL_CART_ITEMS, body)
  },
  deleteCartItem(params: string) {
    return http.delete(`${URL_CART_ITEMS}/${params}`)
  },
  getCartByUserId(params: ParamsConfig) {
    return http.get<SuccessResponse<CartItemData[]>>(`${URL_CART_ITEMS}`, {
      params
    })
  }
}
export default cartApi
