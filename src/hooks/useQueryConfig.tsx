import { ParamsConfig } from 'src/types/product.type'
import omitBy from 'lodash/omitBy'
import isUndefined from 'lodash/isUndefined'
import useQueryParams from './useQueryParams'

export type QueryConfig = {
  [key in keyof ParamsConfig]: string
}

export default function useQueryConfig() {
  const queryParams: QueryConfig = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      size: queryParams.size || '10',
      search: queryParams.search,
      sort: queryParams.sort,
      minPrice: queryParams.minPrice,
      maxPrice: queryParams.maxPrice,
      category_id: queryParams.category_id
    },
    isUndefined
  )
  return queryConfig
}
