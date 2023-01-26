import React, { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
import { AppDispatch } from './app/store'
import { useAppDispatch, useAppSelector } from './app/hooks' 
import  { RootState } from './app/store'
import { onAuthStateChanged } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { 
  // fetchUsers, 
  fetchUserId, 
  fetchSelectedUser 
} from './features/user/userSlice'
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
      // dispatch(fetchUsers())
      dispatch(fetchUserId())
      dispatch(fetchSelectedUser())
    }
    getData()
    return () => getData()
  }, [])

 const router = useRoutes(routes)
  return (
    <>{router}</>
  )
}

export default App
 