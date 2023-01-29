import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'
import { RootState } from '../../app/store'
import image from "../..//assets/img/icons/b5ccef43e09175bb07cb7c6741af2724_400x400.jpeg";


const UserMyPage: React.FC = () => {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.user.selectedUser)
  
  return (
    <section className="c-section-container">
      <h2 className="u-text__headline u-text-center">マイページ</h2>
      <div className="module-spacer--medium" />
        <div className="center">
            <img 
              src={image} 
              alt="ユーザー画像" 
              style={{ 
                  objectFit: 'cover',
                  margin: '8px 16px 8px 16px',
                  height: 200,
                  width: 200,
                }}
            />
        </div>
       <p>
        ユーザー名: {user.username}
       </p>
       <p>
        ユーザーID: {user.uid}
       </p>
      
        <div className="module-spacer--small" />
          <div className="center">
            <Button 
              variant="contained"
              color="warning"
              onClick={() => navigate('/user/payment/edit')} 
              sx={{ m: 2 }}
            >
              カード情報の編集
            </Button>
            <Button 
              variant="contained"
              color="warning"
              onClick={() => navigate('/order/confirm')}
              sx={{ m: 2 }}
            >
              注文情報の確認
            </Button>
          </div>
    </section>
  )
}

export default UserMyPage


