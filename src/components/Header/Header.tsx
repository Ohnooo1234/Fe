import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import path from 'src/constants/path'
import { AppContext } from 'src/contexts/app.context'
import Popover from '../Popover'
import { purchasesStatus } from 'src/constants/purchase'
import purchaseApi from 'src/apis/purchase.api'
import noproduct from 'src/assets/images/no-product.png'
import { formatCurrency, getAvatarUrl } from 'src/utils/utils'
import icon from '../../assets/images/header/academy-02-01-01-01.png'
import useSearchProducts from 'src/hooks/useSearchProducts'
import authApi from 'src/apis/auth.api'
import { useTranslation } from 'react-i18next'
import { locales } from 'src/i18n/i18n'
import { clearLS } from 'src/utils/auth'
import cartApi from 'src/apis/cart.api'
import useQueryConfig from 'src/hooks/useQueryConfig'
import { CartItemData } from 'src/types/cart.type'
import value from 'src/constants/value'

const MAX_PURCHASES = 5
export default function Header() {
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } = useContext(AppContext)
  const [numberBuys, setNumberBuys] = useState<number>(0)
  const navigate = useNavigate()
  const queryConfig = useQueryConfig()
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]

  const queryClient = useQueryClient()

  const handleLogout = () => {
    setIsAuthenticated(false)
    clearLS()
    navigate(path.home)
    setNumberBuys(0)
  }
  console.log(numberBuys)

  const changeLanguage = (lng: 'en' | 'vi') => {
    i18n.changeLanguage(lng)
  }

  // const { data: purchasesInCartData } = useQuery({
  //   queryKey: ['purchases', { status: purchasesStatus.inCart }],
  //   queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart }),
  //   enabled: isAuthenticated
  // })

  // const purchasesInCart = purchasesInCartData?.data.data
  const { data: cartsData } = useQuery({
    queryKey: ['carts', queryConfig],
    queryFn: () => {
      return cartApi.getCartByUserId({ size: value.MAX_INT })
    },
    enabled: isAuthenticated
  })

  useEffect(() => {
    if (cartsData && isAuthenticated && profile) {
      setNumberBuys(cartsData?.data.content.filter((cart: CartItemData) => cart.user_id == profile.id).length)
    }
  }, [cartsData, isAuthenticated, profile])
  return (
    <div className='bg-white pb-5 pt-2 font-semibold text-black'>
      <div className='container'>
        <div className='mt-4 grid grid-cols-12 items-end gap-4'>
          <Link to='/' className='col-span-2'>
            <img src={icon} alt='icon' className='w-full' />
          </Link>
          <div className='col-span-9 justify-self-end'>
            <div className='flex'>
              <Popover
                className='flex cursor-pointer items-center py-1 hover:text-primaryColor'
                renderPopover={
                  <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                    <div className='flex flex-col py-2 pr-28 pl-3'>
                      <button
                        className='py-2 px-3 text-left hover:text-primaryColor'
                        onClick={() => changeLanguage('vi')}
                      >
                        Tiếng Việt
                      </button>
                      <button
                        className='mt-2 py-2 px-3 text-left hover:text-primaryColor'
                        onClick={() => changeLanguage('en')}
                      >
                        English
                      </button>
                    </div>
                  </div>
                }
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-5 w-5'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418'
                  />
                </svg>
                <span className='mx-1'>{currentLanguage}</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='h-5 w-5'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
                </svg>
              </Popover>
              {isAuthenticated && (
                <Popover
                  className='ml-6 flex cursor-pointer items-center py-1 hover:text-primaryColor'
                  renderPopover={
                    <div className='relative rounded-sm border border-gray-200 bg-white shadow-md'>
                      <Link
                        to={path.profileHome}
                        className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                      >
                        Tài khoản của tôi
                      </Link>
                      <Link
                        to={path.cart}
                        className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                      >
                        Đơn mua
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='block w-full bg-white py-3 px-4 text-left hover:bg-slate-100 hover:text-cyan-500'
                      >
                        Đăng xuất
                      </button>
                    </div>
                  }
                >
                  {/* <div className='mr-2 h-6 w-6 flex-shrink-0'>
                    <img
                      src={getAvatarUrl(profile?.avatar)}
                      alt='avatar'
                      className='h-full w-full rounded-full object-cover'
                    />
                  </div> */}
                  <div>{profile?.email}</div>
                </Popover>
              )}
              {!isAuthenticated && (
                <div className='flex items-center'>
                  <Link to={path.register} className='mx-3 capitalize hover:text-primaryColor'>
                    Đăng ký
                  </Link>
                  <div className='h-4 border-r-[1px] border-r-white/40' />
                  <Link to={path.login} className='mx-3 capitalize hover:text-primaryColor'>
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className='col-span-1 justify-self-end'>
            {/* <Popover
              renderPopover={ */}
            <div className='relative  max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md'>
              {/* {purchasesInCart && purchasesInCart.length > 0 ? (
                    <div className='p-2'>
                      <div className='capitalize text-gray-400'>Sản phẩm mới thêm</div>
                      <div className='mt-5'>
                        {purchasesInCart.slice(0, MAX_PURCHASES).map((purchase) => (
                          <div className='mt-2 flex py-2 hover:bg-gray-100' key={purchase._id}>
                            <div className='flex-shrink-0'>
                              <img
                                src={purchase.product.image}
                                alt={purchase.product.name}
                                className='h-11 w-11 object-cover'
                              />
                            </div>
                            <div className='ml-2 flex-grow overflow-hidden'>
                              <div className='truncate'>{purchase.product.name}</div>
                            </div>
                            <div className='ml-2 flex-shrink-0'>
                              <span className='text-orange'>₫{formatCurrency(purchase.product.price)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className='mt-6 flex items-center justify-between'>
                        <div className='text-xs capitalize text-gray-500'>
                          {purchasesInCart.length > MAX_PURCHASES ? purchasesInCart.length - MAX_PURCHASES : ''} Thêm
                          hàng vào giỏ
                        </div>
                        <Link
                          to={path.cart}
                          className='rounded-sm bg-orange px-4 py-2 capitalize text-white hover:bg-opacity-90'
                        >
                          Xem giỏ hàng
                        </Link>
                      </div>
                    </div>
                  ) : ( */}
              {/* <div className='flex h-[300px] w-[300px] flex-col items-center justify-center p-2'>
                <img src={noproduct} alt='no purchase' className='h-24 w-24' />
                <div className='mt-3 capitalize'>Chưa có sản phẩm</div>
              </div> */}
              {/* )} */}
            </div>
            {/* }
            > */}
            <Link to={isAuthenticated ? path.cart : path.login} className='relative'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='h-8 w-8'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z'
                />
              </svg>
              {/* {purchasesInCart && purchasesInCart.length > 0 && ( */}
              <span className='absolute top-[-5px] left-[17px] rounded-full bg-primaryColor px-[9px] py-[1px] text-xs text-white shadow-2xl'>
                {/* {purchasesInCart?.length} */}
                {numberBuys}
              </span>
              {/* )} */}
            </Link>
            {/* </Popover> */}
          </div>
        </div>
      </div>
    </div>
  )
}
