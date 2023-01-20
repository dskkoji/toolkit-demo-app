import React, { useMemo, useCallback } from 'react'
import CartListItem from '../../component/product/CartListItem'
import List from '@mui//material/List'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextDetail from '../../component/UIkit/TextDetail'
import { RootState } from '../../app/store'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
// import { useDispatch } from 'react-redux'
import { db } from '../../firebase/index'
import { collection, doc, writeBatch, Timestamp , getDoc, DocumentData} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { orderProduct } from '../user/userSlice'

const theme = createTheme()

const OrderConfirm: React.FC = () => {
  const navigate = useNavigate()
  const productsInCart = useAppSelector((state: RootState) => state.user.cart)
  const uid = useAppSelector((state: RootState) => state.user.selectedUser).uid
  const dispatch = useAppDispatch()
  
  const subtotal = useMemo<number>(() => {
    return (productsInCart.reduce((sum, product) => sum += product.price, 0))
  }, [productsInCart])


  const shippingFee = useMemo(() => (subtotal >= 1000) ? 0 : 220, [subtotal])
  const tax = useMemo(() => (subtotal + shippingFee) * 0.1 ,[subtotal, shippingFee])
  const total = useMemo(() => (subtotal + shippingFee + tax) ,[subtotal, shippingFee, tax])

  console.log(productsInCart)

  const order = useCallback(() => {
    orderProduct(productsInCart, total, uid)
    navigate('/order/complete')
  }, [productsInCart, total, uid])

  
  
  return (
    <ThemeProvider theme={theme}>
      <section className="c-section-wrapin">
        <h2 className="u-text__headline">注文の確認</h2>
        <div className="p-grid__row">
          <Box 
            component="div"
            sx={{
              m: 'o auto',
              [theme.breakpoints.down('sm')]: {
                width: 320
              },
              [theme.breakpoints.up('md')]: {
                width: 512
              }
            }}>
            <List>
              {productsInCart.length > 0 && (
                productsInCart.map((product: any) => <CartListItem product={product} key={product.cartId} />)
              )}
            </List>
          </Box>
          <Box
            component="div"
            sx={{
              border: '1px solid rgba(0, 0, 0, 0.2)',
              borderRadius: 4,
              boxShadow: '0 4px 2px 2px rgba(0, 0, 0, 0.2)',
              height: 220,
              margin: '24px auto 16px auto',
              padding: 2,
              width: 288
            }}
          >
            <TextDetail label={"商品合計"} value={"¥" + subtotal.toLocaleString()} />
            <TextDetail label={"送料"} value={"¥" + shippingFee.toLocaleString()} />
            <TextDetail label={"消費税"} value={"¥" + tax.toLocaleString()} />
            <Divider />
            <div className="module-spacer--extra-extra-small" />
            <TextDetail label={"合計(税込)"} value={"¥" + total.toLocaleString()} />
            <Button 
              fullWidth
              variant="contained"
              color="primary" 
              onClick={order}
              >
                注文を確定する
              </Button>
          </Box>
        </div>
      </section>
    </ThemeProvider>
  )
}

export default OrderConfirm
