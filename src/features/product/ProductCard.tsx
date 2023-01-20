import React, { useState } from 'react'
import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import NoImage from '../../assets/img/icons/no_image.png'
import IconButton from '@mui/material/IconButton'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { deleteProduct } from '../../features/product/productSlice'
import { useDispatch } from 'react-redux'
 
const theme = createTheme()

type PropsType = {
  productId: string;
  images: any[];
  price?: number;
  name: string;
}

const ProductCard: React.FC<PropsType> = (props) => {
  const navigate = useNavigate()
  // const dispatch = useDispatch()
  const image = (props.images.length > 0) ? props.images[0] : [NoImage]
  const price = props.price?.toLocaleString()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <Card
        sx={{
          [theme.breakpoints.down('sm')]: {
            margin: 1,
            width: 'calc(50% - 16px)'
          },
          [theme.breakpoints.up('md')]: {
            margin: 2,
            width: 'calc(33.3333% - 32px)'
          }
        }}
      >
        <CardMedia 
          sx={{ height: 0, paddingTop: '100%' }}
          image={image.path}
          onClick={() => navigate(`/product/${props.productId}`)}
        />
          <CardContent 
            sx={{ 
              display: 'flex',
              padding: '2 1',
              textAlign: 'left',
              '&:last-child': {
                paddingBottom: 2
              }
            }}
          >
            <div onClick={() => console.log("clicked!")}>
              <Typography
                color="textSecondary"
                component="p"
                sx={{ 
                  boxOrient: 'vertical',
                  display: '-webkit-box',
                  fontSize: 14,
                  lineHeight: '18px',
                  overflow: 'hidden',
                  [theme.breakpoints.down('sm')]: {
                    height: 36,
                    lineClamp: 2,
                  },
                  [theme.breakpoints.up('md')]: {
                    height: 18,
                    lineClamp: 1
                  }
                }}
              >
                {props.name}
              </Typography>
              <Typography
                component="p"
                sx={{ 
                  color: theme.palette.secondary.dark,
                  fontSize: 16,
                }}
              >
                ￥{price}
              </Typography>
            </div>
            <>
              <IconButton
                sx={{ 
                  marginRight: 0, marginLeft: 'auto'
                }}
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    navigate(`/product/edit/${props.productId}` )
                    handleClose()
                  }}
                >
                  編集する
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    deleteProduct(props.productId)
                    handleClose()
                  }}
                >
                  削除する
                </MenuItem>
              </Menu>
            </>
          </CardContent>
      </Card>
    </ThemeProvider>
  )
}

export default ProductCard