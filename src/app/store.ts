import { combineReducers, configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import userReducer from '../features/user/userSlice'
import productReducer from '../features/product/productSlice'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' 
// import { combineReducers } from 'redux'

const reducers = combineReducers({
  counter: counterReducer,
  user: userReducer,
  product: productReducer,
})

const middleware = getDefaultMiddleware({
  serializableCheck: false
})

export const store = configureStore({
  // reducer: {
  //   counter: counterReducer,
  //   user: userReducer,
  //   product: productReducer,
  // },
  reducer: reducers,
  // middleware: (getDefaultMiddleware) => {
  //     getDefaultMiddleware({
  //       serializableCheck: false
  //  })
  // }
  middleware: middleware
})


const persistConfig = {
  key: 'root',
  storage
}

export const persistedReducer = persistReducer(persistConfig, reducers)

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>

export type AppDispatch = typeof store.dispatch