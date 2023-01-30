import React, { useState, useEffect } from 'react'
import { auth } from '../../firebase/index'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Link from '@mui/material/Link'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { getDoc, doc, Timestamp, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/index'
import { useAppDispatch } from '../../app/hooks'
import { signIn, setUserId, fetchProductsInCart, fetchFavorite } from '../user/userSlice'

const Copyright = () => {
  return (
    <Typography variant="body2" color="textSecodary" align="center">
      {'Copyright ©️ '}
      <Link color="inherit" href="https://mui.com">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

interface AuthDataTypes {
  username?: string;
  email: string;
  password: string;
}

const UserAuth:React.FC = () => {
  const [isSignedIn, setIsSignedIn] = useState(true)
  const { register, handleSubmit, formState: { errors } } = useForm<AuthDataTypes>()
  const theme = createTheme()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSignIn = async (data: AuthDataTypes) => {
    const { email, password } = data
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const userState = result.user
          if (!userState) {
            throw new Error('ユーザーIDを取得できません')
          }
          const userId = userState.uid
            getDoc(doc(db, 'users', userId))
            .then((snapshot) => {
              const fsdata = snapshot.data()
              if (!fsdata) {
                throw new Error('ユーザーデータが存在しません')
              }
              updateDoc(doc(db, 'users', userId), {
                isSignedIn: true
              })
              dispatch(signIn({
                uid: userId,
                username: fsdata.username,
                email: email,
                isSignedIn: true,
              }))
              dispatch(setUserId(userId))
              dispatch(fetchProductsInCart(userId))
              dispatch(fetchFavorite(userId)) 
            })
          })
        navigate('/')
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleSignUp = async (data: AuthDataTypes) => {
    const { username, email, password} = data
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user
          if (user) {
            const uid = user.uid
            const dateTime = Timestamp.fromDate(new Date())

            setDoc(doc(db, 'users', uid), {
              uid: uid,
              username: username,
              email: email,
              isSignedIn: true,
              created_at: dateTime
            })
            dispatch(signIn({
              uid: uid,
              username: username,
              email: email,
              isSignedIn: true,
            }))
          }
        })
        navigate('/')
    } catch (err: any) {
      alert(err.message)
    }
  }

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      user && navigate('/')
    })
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Avatar sx={{ m: 1, bgColor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {isSignedIn ? 'ログイン': '新規登録'}
          </Typography>
          <form 
              onSubmit={
              isSignedIn 
                ? handleSubmit(handleSignIn) 
                : handleSubmit(handleSignUp)              
              }
              noValidate
            >
              {
                !isSignedIn ? (
                <>
                  <TextField
                    variant="outlined" 
                    margin="normal"
                    fullWidth
                    id="username"
                    label="username"
                    {...register('username', {
                      required: 'ユーザー名を入力して下さい'
                    })}
                    autoComplete="username"
                    autoFocus
                  />
                {errors.username && errors.username.message}
                </>
                ) : (
                  <></>
                )
              }
            <TextField
              variant="outlined"
              margin="normal" 
              fullWidth
              id="email"
              label="Email Address"
              {...register('email', {
                required: 'メールアドレスを入力して下さい',
                pattern: {
                  value:  /^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-za-z0-9_.-]{1,}[A-Za-z0-9]{1,}$/,
                  message: 'メールアドレスの形式が不正です'
                }
              })}
              autoComplete="email"
              autoFocus
            />
            {errors.email && errors.email.message}
            <TextField 
              variant="outlined"
              margin="normal"
              fullWidth
              id="password"
              type="password"
              label="password"
              {...register('password', {
                required: 'パスワードを入力して下さい',
                minLength: {
                  value: 6,
                  message: '6文字以上で入力して下さい'
                },
                maxLength: {
                  value: 8,
                  message: '8文字以内で入力して下さい'
                }
              })}
            />
            {errors.password && errors.password.message}
          <Button 
            type="submit"
            fullWidth 
            variant="contained"
            color="primary" 
            sx={{ mt: 3, mb: 2 }}
            >
            {isSignedIn ? 'ログインする' : '新規登録する' }
          </Button>
          <Grid container>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                onClick={() => setIsSignedIn(!isSignedIn)}
              >
                {isSignedIn 
                  ? 'アカウントをお持ちでない方はこちら'
                  : 'アカウントをお持ちの方はこちら'
                }
              </Link>
            </Grid>
          </Grid>
          </form>
        </Box>
        <Box>
          <Copyright />
        </Box>
      </Container>
    </ThemeProvider>
  )
}

export default UserAuth