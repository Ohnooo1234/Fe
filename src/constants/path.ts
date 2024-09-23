const path = {
  home: '/',
  homePage: '/home',
  user: '/user',
  profile: '/profile',
  profileHome: '/profile-home',
  changePassword: '/user/password',
  historyPurchase: '/user/purchase',
  login: '/login',
  register: '/register',
  forget: '/forget',
  logout: '/logout',
  productDetail: ':nameId',
  cart: '/cart',
  category: '/category',
  order: '/order',
  product: '/product',
  account: '/account',
  active: '/active',
  reset: '/auth/new-password'
} as const

export default path
