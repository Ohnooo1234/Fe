import { Link } from 'react-router-dom'
import path from 'src/constants/path'
import { Product as ProductType } from 'src/types/product.type'
import { formatCurrency, generateNameId } from 'src/utils/utils'

interface Props {
  product: ProductType
}

export default function Product({ product }: Props) {
  const linkTo =
    product.number_of_products === 0
      ? path.home
      : `${path.home}${generateNameId({ name: product.name, id: product.id.toString() })}`
  return (
    <Link to={linkTo}>
      <div className='overflow-hidden rounded-sm bg-white shadow transition-transform duration-100 hover:translate-y-[-0.04rem] hover:shadow-md'>
        <div className='relative w-full pt-[100%]'>
          <img
            src={`/src/assets/${product.thumbnailUrl}`}
            alt={product.name}
            className='absolute top-0 left-0 h-full w-full bg-white object-cover'
          />
        </div>
        <div className='overflow-hidden p-2'>
          <div className='min-h-[2rem] text-sm line-clamp-2'>{product.name}</div>
          <div className='min-h-[2rem] text-xs line-clamp-2'>
            {'>'}
            {'>'}
            {product.category_name}
          </div>
          <div className='mt-3 flex flex-col items-start justify-start'>
            <div className='ml-1 truncate text-orange'>
              <span className='text-xs'>₫</span>
              <span className='text-sm'>{formatCurrency(product.price)}</span>
            </div>
            <div>
              <span className='text-sm text-primaryColor underline-offset-1'>
                {product.number_of_products === 0 ? 'Đã hết' : `${product.number_of_products} sản phẩm`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
