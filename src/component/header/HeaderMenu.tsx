import React, { useEffect } from 'react'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import { useNavigate } from 'react-router-dom'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { onSnapshot, collection, } from 'firebase/firestore'
import { db } from '../../firebase/index'
import { fetchProductsInCart } from '../../features/user/userSlice'
import { RootState } from '../../app/store'
import { useAuthState } from '../../app/hooks'

type Props = {
  handleDrawerToggle: any;
}

const HeaderMenu: React.FC<Props> = (props) => {
  const [user, loading] = useAuthState()  
  let productsInCart = useAppSelector((state: RootState) => state.user.cart)
  const { handleDrawerToggle } = props
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  useEffect(() => {
    if (!user) return 
    const uid = user.uid
    console.log(uid)
    const ref = collection(db, 'users', `${uid}`, 'cart')
    const unsub = onSnapshot(ref, 
      (snapshots) => {
        snapshots.docChanges().forEach(change => {
          const product: any = change.doc.data()
          const changeType = change.type
          switch(changeType) {
            case 'added':
              productsInCart.push(product)
              break;
            case 'modified':
              const index = productsInCart.findIndex(product => product.cartId === change.doc.id)
              productsInCart[index] = product
              break;
            case 'removed':
              productsInCart = productsInCart.filter(product => product.cartId !== change.doc.id)
              break;
            default: 
              break;
          }
        })
        dispatch(fetchProductsInCart(uid))
    })
    return () => unsub()
  }, [!!user, loading])
  
  return (
    <>
      <IconButton onClick={() => navigate('/user/cart')} > 
        {/* <Badge badgeContent={1} color="secondary"> */}
        <Badge badgeContent={productsInCart.length} color="secondary">
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
      <IconButton>
        <FavoriteBorderIcon />
      </IconButton>
      <IconButton 
        aria-label="Menu Items"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={(e) => handleDrawerToggle(e, true)}
        color="inherit"
      >
        <MenuIcon />
      </IconButton>
    </>
  )
}

export default HeaderMenu
