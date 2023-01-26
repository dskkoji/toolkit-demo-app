import React, { useState, useEffect } from 'react'
import List from '@mui/material/List'
import { RootState } from '../../app/store'
import Button from '@mui/material/Button'
import CartListItem from '../../component/product/CartListItem'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchProductsInCart } from '../user/userSlice'

type ProductsInCart = {
  cartId: string;
  productId: string;
  productName: string;
  gender: string;
  price: number;
  size: string;
  images: any[];
}[]

const CartList: React.FC = () => {
  const productsInCart: ProductsInCart = useAppSelector((state: RootState) => state.user.cart)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const user = useAppSelector((state: RootState) => state.user.selectedUser)
  // const uid  = useAppSelector((state: RootState) => state.user.userId)
  
  useEffect(() => {
    const uid = user.uid
    const getData = (id: string) => {
      dispatch(fetchProductsInCart(id))
    }
    getData(uid) 
   }, [])

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">ショッピングカート</h2>
      <List sx={{ m: '0 auto', maxWidth: 512, width: '100%' }}>
        {productsInCart.length > 0 && (
          productsInCart.map((product => 
          <CartListItem 
            product={product} key={product.cartId}  
          />
          ))
        )}
      </List>
      <div className="module-spacer--small" />
      <div className="p-grid__column">
        <Button
          sx={{ width: 256 }}
          variant="contained"
          onClick={() => navigate('/order/confirm')}
        >
          レジへ進む
          </Button>
        <div className="module-spacer--small" />
        <Button
          sx={{ width: 256 }}
          variant="contained"
          onClick={() => navigate('/')} 
        >
          ショッピングを続ける
        </Button>
      </div>
    </section>
  )
}

export default CartList