import React, { useEffect } from 'react'
import List from '@mui/material/List'
import FavoriteItem from './FavoriteItem'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { fetchFavorite } from '../user/userSlice'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

type FList = {
  favoriteId: string;
  productId: string;
  productName: string;
  gender: string;
  price: number;
  size: string;
  images: any[]
}[]

const FavoriteList: React.FC = () => {
  const dispatch = useAppDispatch()
  const flist: FList = useAppSelector((state: RootState) => state.user.favorite)
  const user = useAppSelector((state: RootState) => state.user.selectedUser)
  const navigate = useNavigate()

  useEffect(() => {
    const uid = user.uid
    const getData = (id: string) => {
      dispatch(fetchFavorite(id))
    }
    getData(uid)
  }, [dispatch, user.uid])

  return (
    <section className="c-section-wrapin">
      <h2 className="u-text__headline">お気に入りリスト</h2>
      <List sx={{ m: '0 auto', maxWidth: 512, width: '100%' }}>
        {flist.length > 0 && (
            flist.map((product) => 
            <FavoriteItem 
                product={product} 
                key={product.favoriteId} 
            />
          )
      )}
      </List>
      <div className="module-spacer--small" />
      <div className="p-grid__column">
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

export default FavoriteList