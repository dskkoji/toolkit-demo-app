import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { db } from '../../firebase/index'
import { getDocs, collection, query, orderBy, doc, setDoc, Timestamp, writeBatch, getDoc, DocumentData, where } from 'firebase/firestore'

interface UserState {
  idCount: number;
  users: { 
    uid: string; 
    username: string; 
    email: string;
    isSignedIn: boolean; 
  }[];
  selectedUser: { uid: string; username: string; isSignedIn: boolean; },
  cart: {
    cartId: string;
    productId: string;
    productName: string;
    gender: string;
    price: number;
    size: string;
    images: any[];
  }[],
  orders: {
    orderId: string;
    amount: number,
    products: [],
    created_at: Timestamp,
    updated_at: Timestamp,
    shippingDate: Timestamp,
  }[],
  favorite: {
    favoriteId: string;
    productId: string,
    productName: string;
    size: string;
    gender: string;
    price: number;
    images: any[]
  }[],
  userId: string;
}

const initialState: UserState = {
  idCount: 1,
  users: [],
  selectedUser: { uid: '', username: '', isSignedIn: false },
  cart: [],
  orders: [],
  favorite: [],
  userId: ''
}

export const fetchUsers = createAsyncThunk('user/getAllUsers', async () => {
  const res = await getDocs(
    query(
      collection(db, 'users'),
      orderBy('created_at', 'desc')
    )
  )
  const allUsers = res.docs.map((doc) => ({
    uid: doc.id,
    username: doc.data().username,
    email: doc.data().email,
    isSignedIn: doc.data().isSignedIn,
    cart: doc.data().cart,
    orders: doc.data().orders,
    favorite: doc.data().favorite,
  }))

  const userNumber =  allUsers.length
  const passData = { allUsers, userNumber }
  return passData
})

export const fetchOrderHistory = createAsyncThunk('user/getAllOrders', async (uid:string) => {
  const res = await getDocs(
    query(
      collection(db, 'users', `${uid}`, 'orders'),
      orderBy('updated_at', 'desc')
    )
  )
  const allOrderHistory = res.docs.map((doc) => ({
    orderId: doc.data().id,
    amount: doc.data().amount,
    products: doc.data().products,
    created_at: doc.data().created_at.toDate(),
    updated_at: doc.data().updated_at.toDate(),
    shippingDate: doc.data().shipping_date.toDate(),
  }))
  const orderNumber = allOrderHistory.length
  const passData = { allOrderHistory, orderNumber }
  return passData
})

export const fetchUserId  = createAsyncThunk('user/getUserId', async () => {
  const q = 
    query(
      collection(db, 'users'), 
      where('isSignedIn', '==', true)
    )
  const res = await getDocs(q)
  const userId = res.docs.map((doc) => ({
    userId: doc.data().uid
  }))
  return userId[0]
})
export const fetchSelectedUser = createAsyncThunk('user/getSelectedUser', async () => {
  const q = 
    query(
      collection(db, 'users'), 
      where('isSignedIn', '==', true)
    )
  const res = await getDocs(q)
  const allUsers = res.docs.map((doc) => ({
    uid: doc.data().uid,
    username: doc.data().username,
    // email: doc.data().email
    isSignedIn: doc.data().isSignedIn
  }))
   
  return allUsers[0]
})

export const fetchFavorite  = createAsyncThunk('user/getFavorite', async(arg: string) => {
  const res = await getDocs(
    query(
      collection(db, 'users', arg, 'favorite'),
      orderBy('added_at', 'desc')
    )
  )
  const allFavorite = res.docs.map((doc) => ({
    uid: doc.data().uid,
    favoriteId: doc.data().favoriteId,
    productId: doc.data().productId,
    productName: doc.data().productName,
    gender: doc.data().gender,
    price: doc.data().price,
    images: doc.data().images,
    size: doc.data().size,
  }))

  const favoriteNumber = allFavorite.length
  const passData = { allFavorite, favoriteNumber }
  return passData
})

export const fetchProductsInCart = createAsyncThunk('user/getAllProductsInCart', async (arg: string) => {
  const res = await getDocs(
    query(
      collection(db, 'users', `${arg}`, 'cart'),
      orderBy('added_at', 'desc')
    )
  )
  const allProductsInCart = res.docs.map((doc) => ({
      uid: doc.data().uid,
      cartId: doc.data().cartId,
      productId: doc.data().productId,
      productName: doc.data().productName,
      gender: doc.data().gender,
      price: doc.data().price,
      size: doc.data().size,
      images: doc.data().images
  }))

  const cartNumber = allProductsInCart.length
  const passData = { allProductsInCart, cartNumber }
  return passData
})

export const addProductToCart = async (addedProduct: {
      uid: string,
      added_at: Timestamp,
      description: string;
      gender: string
      images: []
      productName: string,
      price: number,
      productId: string,
      quantity: number,
      size: string
}): Promise<void> => {
  try {
    const cartRef = doc(collection(db, 'users', addedProduct.uid, 'cart'))
    await setDoc(cartRef, {
      ...addedProduct, cartId: cartRef.id
    }, { merge: true })
  } catch(err) {
    console.log('Error document writing:', err)
  }
}

export const addFavoriteToList = async (addedProduct: {
  uid: string;
  added_at: Timestamp;
  description: string;
  productId: string;
  productName: string;
  gender: string;
  price: number;
  images: [];
  size: string;
}): Promise<void> => {
  try {
    const favRef = doc(collection(db, 'users', addedProduct.uid, 'favorite'))
    await setDoc(favRef, {
      ...addedProduct, favoriteId: favRef.id },
       { merge: true })
  } catch(err) {
    console.log('Error document writing:', err)
    }
}

export const orderProduct = async (
  productsInCart: {
    cartId: string;
    productId: string;
    productName: string;
    price: number;
    size: string;
    images: any[];
  }[], 
  price: number, 
  uid: string
) => {
  let products: any[] = []
  let soldOutProducts: any = []
  const batch = writeBatch(db)

  try {
    for (const product of productsInCart) {
      await getDoc(doc(db, 'products', `${product.productId}`))
      .then((snapshot: DocumentData) => {
        const sizes = snapshot.data().sizes
        console.log(sizes)
        const updatedSizes = sizes.map((size: { size: string; quantity: number }) => {
          if (size.size === product.size) {
            if (size.quantity === 0) {
              soldOutProducts.push(product.productName)
              return size
            }
            return {
              size: size.size,
              quantity: size.quantity - 1
            }
          } else {
            return size
          }
        })
        products.push({
          id: product.productId,
          images: product.images,
          name: product.productName,
          price: product.price,
          size: product.size
        })
        batch.update(doc(db, 'products', `${product.productId}`) ,{ sizes: updatedSizes })
        batch.delete(doc(db, 'users', `${uid}`, 'cart' ,`${product.cartId}`))
      })  
    }
    if (soldOutProducts.length > 0) {
      const errorMessage = (soldOutProducts.length > 1) 
                              ? soldOutProducts.join('と')
                              : soldOutProducts[0]
      alert('大変申し訳ありません。' + errorMessage +  'が在庫切れとなったため注文処理を中断しました。')
      return false
    } else {
      const orderRef = doc(collection(db, 'users', `${uid}`, 'orders'))
      const dateTime = Timestamp.fromDate(new Date())
      const D = dateTime.toDate()
      const shippingDate = Timestamp.fromDate(new Date(D.setDate(D.getDate() + 3)))
      const history = {
        amount: price,
        created_at: dateTime,
        id: orderRef.id,
        products: products,
        shipping_date: shippingDate,
        updated_at: dateTime
      }
      batch.set(orderRef, history, { merge: true })
    }
    return batch.commit() 
  } catch (e){
    console.log(e)
    alert('注文処理に失敗しました。通信環境をご確認のうえ、再度お試しください。')
  }
}


export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.selectedUser = ({...action.payload})
      state.userId = action.payload.uid
    },
    setUserId: (state, action) => {
      state.userId = action.payload
    },
    signOutUser: (state) => {
      // state.users = initialState.users
      state.selectedUser = { uid: '', username: '', isSignedIn: false }
      state.userId = ''
    },
  },
  extraReducers: (builder) => {
      builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
          state.users = action.payload.allUsers
          state.idCount = action.payload.userNumber
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.orders = action.payload.allOrderHistory
      })
      .addCase(fetchProductsInCart.fulfilled, (state, action) => {
        state.cart = action.payload.allProductsInCart
      })
      .addCase(fetchUserId.fulfilled, (state, action) => {
        state.userId = action.payload.userId
      })
      .addCase(fetchSelectedUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload
      })
      .addCase(fetchFavorite.fulfilled, (state ,action) => {
        state.favorite = action.payload.allFavorite
      })
  }
})

export const { signIn, signOutUser, setUserId } = userSlice.actions

export default userSlice.reducer