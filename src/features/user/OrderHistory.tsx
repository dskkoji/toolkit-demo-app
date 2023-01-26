import React, { useEffect } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import List from '@mui/material/List'
import OrderHistoryItem from '../../component/product/OrderHistoryItem'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchOrderHistory }from './userSlice'
import { RootState, AppDispatch } from '../../app/store'
  
const theme = createTheme()

const OrderHistory: React.FC = () => {
  const orders = useAppSelector((state: RootState) => state.user.orders)
  const dispatch: AppDispatch = useAppDispatch()
  // const user = useAppSelector((state: RootState) => state.user.selectedUser)
  const uid = useAppSelector((state: RootState) => state.user.userId) 

  useEffect(() => {
    // const uid = user.uid
    const getData = (id: string) => {
      dispatch(fetchOrderHistory(id))
    }
    getData(uid)
  }, [uid])

  return (
    <ThemeProvider theme={theme}>
      <section className="c-section-wrapin">
        <List sx={{  
          background: theme.palette.grey['100'],
          margin: '0 auto',
          padding: 4,
          [theme.breakpoints.down('sm')]: {
            width: '100%',
          },
          [theme.breakpoints.up('md')]: {
            width: 768
          }
        }}>
          {orders.length > 0 && (
            orders.map((order: any) => 
                <OrderHistoryItem key={order.orderId} order={order} />
              )
          )}
        </List>
      </section>
    </ThemeProvider>
  )
}

export default OrderHistory