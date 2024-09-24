import path from 'src/constants/path'
import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './contexts/app.context'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
// import Login from './pages/Login'
// import ProductList from './pages/ProductList'
// import Profile from './pages/User/pages/Profile'
// import Register from './pages/Register'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout/AdminLayout'

import ActiveRegister from './pages/ActiveRegister'
import ResetPageEmail from './pages/ResetPageEmail'
import Forget from './pages/Forget'

// import ChangePassword from './pages/User/pages/ChangePassword'
// import HistoryPurchase from './pages/User/pages/HistoryPurchase'
// import NotFound from './pages/NotFound'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const ProductListAdmin = lazy(() => import('./pages/ManageProduct'))
const OrderListAdmin = lazy(() => import('./pages/ManageOrder'))
const CategoryListAdmin = lazy(() => import('./pages/ManageCategory'))
const AccountListAdmin = lazy(() => import('./pages/ManageAccount'))
const Profile = lazy(() => import('./pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

function AdminRoute() {
  const { isAuthenticated, role } = useContext(AppContext)
  const allowedRoles = 'Admin'

  return isAuthenticated && allowedRoles.includes(role) ? <Outlet /> : <Navigate to='/forbidden' />
}
function CustomerRoute() {
  const { isAuthenticated, role } = useContext(AppContext)
  const allowedRoles = 'Customer'

  return isAuthenticated && allowedRoles.includes(role) ? <Outlet /> : <Navigate to='/forbidden' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.login,
          element: (
            <RegisterLayout>
              <Suspense>
                <Login />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.register,
          element: (
            <RegisterLayout>
              <Suspense>
                <Register />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.forget,
          element: (
            <RegisterLayout>
              <Suspense>
                <Forget />
              </Suspense>
            </RegisterLayout>
          )
        },
        {
          path: path.reset,
          element: <ResetPageEmail />
        },
        {
          path: path.active,
          element: <ActiveRegister />
        }
      ]
    },
    {
      path: '',
      element: <AdminRoute />,
      children: [
        {
          path: path.profile,
          element: (
            <AdminLayout>
              <Suspense>
                <Profile />
              </Suspense>
            </AdminLayout>
          )
        },
        {
          path: path.category,
          element: (
            <AdminLayout>
              <Suspense>
                <CategoryListAdmin />
              </Suspense>
            </AdminLayout>
          )
        },
        {
          path: path.product,
          element: (
            <AdminLayout>
              <Suspense>
                <ProductListAdmin />
              </Suspense>
            </AdminLayout>
          )
        },
        {
          path: path.account,
          element: (
            <AdminLayout>
              <Suspense>
                <AccountListAdmin />
              </Suspense>
            </AdminLayout>
          )
        },
        {
          path: path.order,
          element: (
            <AdminLayout>
              <Suspense>
                <OrderListAdmin />
              </Suspense>
            </AdminLayout>
          )
        }
      ]
    },
    {
      path: '',
      element: <CustomerRoute />,
      children: [
        {
          path: path.profileHome,
          element: (
            <MainLayout>
              <Suspense>
                <Profile />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.cart,
          element: (
            <MainLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </MainLayout>
          )
        },
        {
          path: path.user,
          element: (
            <MainLayout>
              <UserLayout />
            </MainLayout>
          ),

          children: [
            // {
            //   path: path.profile,
            //   element: (
            //     <Suspense>
            //       <Profile />
            //     </Suspense>
            //   )
            // },

            {
              path: path.changePassword,
              element: (
                <Suspense>
                  <ChangePassword />
                </Suspense>
              )
            },
            {
              path: path.historyPurchase,
              element: (
                <Suspense>
                  <HistoryPurchase />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: path.productDetail,
      element: (
        <MainLayout>
          <Suspense>
            <ProductDetail />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '',
      index: true,
      element: (
        <MainLayout>
          <Suspense>
            <ProductList />
          </Suspense>
        </MainLayout>
      )
    },
    {
      path: '*',
      element: (
        <MainLayout>
          <Suspense>
            <NotFound />
          </Suspense>
        </MainLayout>
      )
    }
  ])
  return routeElements
}
