import React, { useState, useEffect } from 'react'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { db, auth } from '../../firebase/index'
import { signOut } from 'firebase/auth'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { query, getDocs, orderBy, collection, doc, updateDoc,  } from 'firebase/firestore'
import { RootState } from '../../app/store'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '../../app/hooks'
import { signOutUser } from '../../features/user/userSlice'


type Props = {
  open: boolean;
  onClose: any;
}

const theme = createTheme()

const ClosableDrawer: React.FC<Props> = (props) => {
  const navigate = useNavigate()
  const { register } = useForm()
  const dispatch = useAppDispatch()
  const [keyword, setKeyword] = useState('')

  const selectMenu = (event: any, path: string) => {
    navigate(path)
    props.onClose(event, false)
  }
  
  const [filters, setFilters] = useState([
    { func: selectMenu, label: "すべて", id: "all", value: "/" },
    { func: selectMenu, label: "メンズ", id: "male", value: "/?gender=male" },
    { func: selectMenu, label: "レディス", id: "female", value: "/?gender=female" }
  ])

  const menus = [
    { func: selectMenu, label: "商品登録", icon: <AddCircleIcon /> , id: "register" , value: "/product/create" },
    { func: selectMenu, label: "注文履歴", icon: <HistoryIcon />, id: "history", value: "/order/history" },
    { func: selectMenu, label: "プロフィール", icon: <PersonIcon />, id: "profile", value: "/user/mypage" }
  ]

  useEffect(() => {
    const unsub = () => {
      const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
      const list: any[] = []
      getDocs(q)
        .then((snapshots) => {
          snapshots.forEach((snapshot) => {
            const category = snapshot.data()
            list.push({ func: selectMenu, label: category.name, id: category.id, value: `/?category=${category.id}` })
          })
          setFilters((prevState) => [...prevState, ...list])
        })
    }
    return() => unsub()
  }, [])

  const logOut = async () => {
    try {
      const user = auth.currentUser
      if (user) {
        const uid = user.uid
        await updateDoc(doc(db, 'users', uid), {
          isSignedIn: false
        })
      }
      signOut(auth)
      dispatch(signOutUser())
      navigate('/user-auth')
    } catch (err: any) {
      throw new Error(err)
    }
  }

   return (
   <ThemeProvider theme={theme}>
    <Box
      component="nav"
      aria-label="mainbox folders"
      sx={{
        [theme.breakpoints.up('sm')]: {
          width: 256,
          flexShrink: 0,
        }
      }}
    >
      <Drawer
        variant="temporary"
        anchor={"right"}
        open={props.open}
        onClose={(e) => props.onClose(e, false)}
        sx={{ width: 256 }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {/* <div
          onKeyDown={(e) => props.onClose(e, false)}
        > */}
          <Box sx={{ alignItems: 'center', display: 'flex', marginLeft: 4 }}>
            <TextField 
              fullWidth
              multiline={false}
              rows={1}
              type="text"
              label={"キーワードを入力"}
              id="keyword"
              {...register('keyword', {
                required: false
              })}
              value={keyword}
              onChange={(e: any) => setKeyword(e.target.value)}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </Box>
          <Divider />
          <List>
            {menus.map(menu => {
              return (
                <ListItem key={menu.id} onClick={(e) => menu.func(e, menu.value)}>
                  <ListItemIcon>
                    {menu.icon}
                  </ListItemIcon>
                  <ListItemText primary={menu.label} />
                </ListItem>
              )
            })}
            <ListItem 
              // button 
              key="logout" 
              onClick={() => logOut()}
            > 
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="ログアウト" />
            </ListItem>
          </List>
          <Divider />
          <List>
            {filters.map(filter => (
              <ListItem 
                  button 
                  key={filter.id}
                  onClick={(e) => filter.func(e, filter.value) }
                  >
                <ListItemText primary={filter.label } />
              </ListItem>
            ))}
          </List>
        {/* </div> */}
      </Drawer>
    </Box>
   </ThemeProvider>
  )
}

export default ClosableDrawer