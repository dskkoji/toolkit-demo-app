import Layout from './Layout'
import ProductList from './features/product/ProductList'
import ProductDetail from './features/product/ProductDetail'
import ProductEdit from './features/product/ProductEdit'
import ProductCreate from './features/product/ProductCreate'
import UserMyPage from './features/user/UserMyPage'
import OrderConfirm from './features/user/OrderConfirm'
import OrderHistory from './features/user/OrderHistory'
import OrderComplete from './features/user/OrderComplete'
import UserAuth from './features/user/UserAuth'
import CartList from './features/user/CartList'



export const routes = [
  {
    path: '/user-auth',
    element: <UserAuth />
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ProductList />,
      }, {
          path: '/product/:id',
          element: <ProductDetail />
      },
      {
        path: '/user/mypage',
        element: <UserMyPage />
      },
      {
        path: 'user/cart',
        element: <CartList />
      },
      {
        path: '/order/history',
        element: <OrderHistory />
      },
      {
        path: '/order/confirm',
        element: <OrderConfirm />
      },
      {
        path: '/product/create',
        element: <ProductCreate />
      },
      {
        path: '/product/edit/:id',
        element: <ProductEdit />
      },
      {
        path: 'order/complete',
        element: <OrderComplete />
      }
    ]
  }
]