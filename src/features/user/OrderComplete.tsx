import React from 'react'
import Button from '@mui/material/Button'
import { useNavigate } from 'react-router-dom'

const OrderComplete: React.FC = () => {
  const navigate = useNavigate()
  return (
    <div className="c-section-wrapin">
      <p>ご注文ありがとうございました</p>
      <div className="module-spacer--medium" />
      <Button color="primary" variant="contained" onClick={() => navigate('/')}>ショッピングを続ける</Button>
    </div>
  )
}

export default OrderComplete