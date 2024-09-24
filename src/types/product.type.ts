export interface Product {
  // id: number
  // thumbnailURL: string
  // images: string[]
  // price: number
  // rating: number
  // price_before_discount: number
  // quantity: number
  // sold: number
  // view: number
  // name: string
  // description: string
  // category: {
  //   _id: string
  //   name: string
  // }
  // image: string
  // createdAt: string
  // updatedAt: string

  id: number
  thumbnailUrl: string
  name: string
  number_of_products: number
  category_name: string
  category_id: number
  price: number
  description: string
  _id: string
  image: string
  price_before_discount: number
}

export interface ProductList {
  products: Product[]
  pagination: {
    page: number
    limit: number
    page_size: number
  }
}

export interface ParamsConfig {
  page?: number | string
  size?: number | string
  search?: string
  minPrice?: number | string
  maxPrice?: number | string
  sort?: 'asc' | 'desc'
  order?: 'asc' | 'desc'
  category_id?: number | string
  categoryId?: number | string
}
