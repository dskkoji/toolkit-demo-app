import React, { useEffect } from 'react'

import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
import styles from './App.module.scss'
import { useDispatch } from 'react-redux'
import { AppDispatch } from './app/store'
import { useAppDispatch, useAppSelector } from './app/hooks' 
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { RootState } from './app/store'
import { fetchProducts } from './features/product/productSlice'
import { fetchUsers, fetchProductsInCart } from './features/user/userSlice'
import Layout from './Layout'
import { auth } from './firebase/index'



const App: React.FC = () => {
  const navigate = useNavigate()
  const dispatch: AppDispatch = useAppDispatch()
  
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      !user && navigate('/user-auth')
    })
  }, [])

  useEffect(() => {
    const getData = () => {
      dispatch(fetchUsers())
    }
    getData()
    return () => getData()
  }, [])


//   return (
//     <>
//         <Header />
//         <main className="c-main">
//           {/* <ProductList /> */}
//           <Router />
//         </main> 
//     </>
//   )
// }
 const router = useRoutes(routes)
  return (
    <>{router}</>
  )
}

export default App
 