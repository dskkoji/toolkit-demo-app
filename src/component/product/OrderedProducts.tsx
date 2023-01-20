import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import { useNavigate } from 'react-router-dom'

type Props = {
  products: any
}

const OrderedProducts: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const products = props.products
  return (
    <List>
      {products.map((product: any) => (
      <>
        <ListItem key={product.id} sx={{ background: '#fff', height: 'auto'}}>
         <ListItemAvatar>
            <img 
              src={product.images[0].path} 
              alt={"商品画像"}
              style={{ objectFit: 'cover', margin: "8px 16px 8px 0", height: 96, width: 96 }} 
            />
         </ListItemAvatar>
         <Box component="div" sx={{ width: '100%' }}>
            <ListItemText primary={product.name} secondary={"サイズ: " + product.size} />
            <ListItemText primary={"¥" + product.price.toLocaleString()} />
         </Box>
         <Button 
            color="primary"
            variant="outlined"
            type="button"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            詳細を見る
          </Button>          
        </ListItem>
        <Divider />
      </>
      ))}
    </List>
  )
}

export default OrderedProducts