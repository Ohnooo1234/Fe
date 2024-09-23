import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import productApi from 'src/apis/product.api'
import Pagination from 'src/components/Pagination'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { ParamsConfig } from 'src/types/product.type'
import Product from './components/Product/Product'
import PartSearch from './components/PartSearch'
import AsideFilter from './components/AsideFilter'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProductsSuper(queryConfig as ParamsConfig)
    },
    keepPreviousData: true,
    staleTime: 3 * 60 * 1000
  })

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Trang chủ | Shoes Shop VTI</title>
        <meta name='description' content='Trang chủ dự án Shopee Clone' />
      </Helmet>
      <div className='container'>
        <div className='grid grid-cols-12 gap-6'>
          <PartSearch />
        </div>
        {productsData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <AsideFilter queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
                {productsData.data.content
                  // .filter((product) => product.number_of_products !== 0)
                  .map((product) => (
                    <div className='col-span-1' key={product.id}>
                      <Product product={product} />
                    </div>
                  ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productsData.data.totalPages} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
