import React, { useCallback, useState, useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { db } from '../../firebase/index'
import { getDoc, Timestamp, doc } from 'firebase/firestore'
import HTMLReactParser from 'html-react-parser'
import Box from '@mui/material/Box'
// import { useAppSelector } from '../../app/hooks'
import { useNavigate } from 'react-router-dom'
import { addProductToCart } from '../../features/user/userSlice'
import ImageSwiper from '../../features/product/ImageSwiper'
 import { useDispatch, useSelector } from 'react-redux'
import SizeTable from '../../features/product/SizeTable'
import { AppDispatch } from '../../app/store'
import { RootState } from '../../app/store'


const theme = createTheme()

const ProductDetail: React.FC = () => {
  const [product, setProduct] = useState<any>(null)
  const id = window.location.pathname.split('/product/')[1]
  const navigate = useNavigate()
  const dispatch: AppDispatch = useDispatch()
  const user = useSelector((state: RootState) => state.user.selectedUser)
  console.log(user.uid)

  useEffect(() => {
    getDoc(doc(db, 'products', id))
        .then(doc => {
          const data: any = doc.data()
          console.log(data)
          setProduct(data)
        })
  }, [])

  const addProduct = useCallback((selectedSize: string) => {
   const dateTime = Timestamp.fromDate(new Date())
   addProductToCart({
    uid: user.uid,
    added_at: dateTime,
    description: product.description,
    gender: product.gender,
    images: product.images,
    productName: product.productName,
    price: product.price,
    productId: product.productId,
    quantity: 1,
    size: selectedSize,
   })
   navigate('/user/cart')
  }, [product])

  const returnCodeToBr = (text: string) => {
    if (text === '') {
      return text
    } else {
      return HTMLReactParser(text.replace(/\r?\n/g, '<br/>'))
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <section className="c-section-wrapin">
        {product && (
          <div className="p-grid__row">
            <Box component="div" sx={{
              [theme.breakpoints.down('sm')]: {
                margin: '0 auto 24px auto',
                height: 320,
                width: 320
              },
              [theme.breakpoints.up('sm')]: {
                margin: '0 auto',
                height: 400,
                width: 400
              }
            }}>
              <ImageSwiper images={product.images} />
            </Box>
            <Box component="div" sx={{
              textAlign: 'left',
              [theme.breakpoints.down('sm')]: {
                margin: '0 auto 16px auto',
                height: 320,
                width: 320
              },
              [theme.breakpoints.up('sm')]: {
                margin: '0 auto',
                height: 'auto',
                width: 400
              }
            }}>
              <h2 className="u-text__headline">{product.productName}</h2>
              <Box component="p" sx={{ fontSize: 36 }}>¥{(product.price).toLocaleString()}</Box>
              <div className="module-spacer--small" />
              <SizeTable addProduct={addProduct} sizes={product.sizes} />
              <div className="module-spacer--small" />
              <p>{returnCodeToBr(product.description)}</p>
            </Box>
          </div>
        )}
      </section>
    </ThemeProvider>
  )
}

export default ProductDetail