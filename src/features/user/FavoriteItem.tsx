import React from 'react'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import Divider from '@mui/material/Divider'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase/index'
import Box from '@mui/material/Box'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'
  
type Props = {
  product: {
    favoriteId: string;
    productId: string;
    productName: string;
    images: any[];
    size: string;
    price: number;
  }
}

const FavoriteItem: React.FC<Props> = (props: Props) => {
  const image = props.product.images[0].path
  const price = props.product.price.toLocaleString()
  const user = useSelector((state: RootState) => state.user.selectedUser)
  const navigate = useNavigate()

  const removeFavoriteFromList = (favoriteId: string) => {
    deleteDoc(doc(db, 'users', `${user.uid}`, 'favorite', `${favoriteId}`))
  }

  return (
    <>
      <ListItem sx={{ height: 128 }}>
        <ListItemAvatar>
          <img src={image} alt="商品画像" style={{ objectFit: 'cover', margin: 16, height: 96, width: 96 }} />
        </ListItemAvatar>
        <Box component="div" sx={{ width: '100%' }}>
          <ListItemText primary={props.product.productName} secondary={"サイズ: " + props.product.size} />
          <ListItemText primary={"¥" + price} />
        </Box>
        <Button 
            color="primary"
            variant="outlined"
            type="button"
            onClick={() => navigate(`/product/${props.product.productId}`)}
          >
            詳細を見る
          </Button>    
        <IconButton onClick={() => removeFavoriteFromList(props.product.favoriteId)}>
          <DeleteIcon />
        </IconButton>
      </ListItem>
      <Divider />
    </>
  )
}

export default FavoriteItem