import React from 'react'
import OrderedProducts from './OrderedProducts'
import Divider from '@mui/material/Divider'
import TextDetail from '../UIkit/TextDetail'

type Props = {
  order: any
}

const OrderHistoryItem: React.FC<Props> = (props) => {
  const shippingDate = props.order.shippingDate
  const orderDate = props.order.created_at

  const datetimeToString = (dt: Date) => {
    return dt.getFullYear() + '-'
      + ('00' + (dt.getMonth() + 1)).slice(-2) + '-'
      + ('00' + dt.getDate()).slice(-2) + ' '
      + ('00' + dt.getHours()).slice(-2) + ':'
      + ('00' + dt.getMinutes()).slice(-2) + ':'
      + ('00' + dt.getSeconds()).slice(-2) 
  }

  const dateToString = (dt: Date) => {
    return dt.getFullYear() + '-'
       + ('00' + (dt.getMonth() + 1)).slice(-2) + '-'
       + ('00' + dt.getDate()).slice(-2)
  }


  return (
    <div>
      <div className="module-spacer--small" />
        <TextDetail label={"注文ID:"}  value={props.order.orderId} />
        <TextDetail label={"注文日時:"} value={datetimeToString(orderDate)} />
        <TextDetail label={"発送予定日:"} value={dateToString(shippingDate)} />
        <TextDetail label={"注文金額:"} value={"¥" + props.order.amount.toLocaleString()} />
          <OrderedProducts products={props.order.products} />
      <div className="module-spacer--extra-extra-small" />
      <Divider />
    </div>
  )
}

export default OrderHistoryItem