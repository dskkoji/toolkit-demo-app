import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs, query, orderBy, setDoc, doc, Timestamp, deleteDoc, where } from 'firebase/firestore';
import { db } from '../../firebase/index'
import { AppThunk, RootState } from '../../app/store'
import { createSelector } from 'reselect'

interface ProductState {
  idCount: number;
  products: { 
    productId: string; 
    productName: string;
    description: string;
    price: number;
    category: string;
    gender: string;
    sizes: [];
    images: [];
    created_at: Date | null;  
  }[]
  selectedProduct: {
    productId: string; 
    productName: string;
    price: number;
    description: string;
    category: string;
    gender: string; 
    sizes: [];
    images: [];
    created_at: Date | null;  
  }
}

const initialState: ProductState = {
  idCount: 1,
  products: [],
  selectedProduct: { 
    productId: '', 
    productName: '',
    price: 0,
    description: '',
    category: '',
    gender: '',
    sizes: [],
    images: [],
    created_at: null,
   },
}

export const fetchProducts = createAsyncThunk('product/getAllProducts', async (qp: string) => {
  const gender = /^\?gender=/.test(qp) ? qp.split('?gender=')[1] : ''
  const category = /^\?category=/.test(qp) ? qp.split('?category=')[1] : ''
  let q = query(
    collection(db, 'products'), 
    orderBy('created_at', 'desc'),
    // where('category', '==', 'tops')
    // where('gender', '==', `${gender}`)
    )
  

  const res = await getDocs(q)
  const allProducts = res.docs.map((doc) => ({
    productId: doc.id,
    productName: doc.data().productName,
    description: doc.data().description,
    price: doc.data().price,
    gender: doc.data().gender,
    category: doc.data().category,
    sizes: doc.data().sizes,
    images: doc.data().images,
    created_at: doc.data().created_at
  }))

  const productNumber = allProducts.length
  const passData = { allProducts, productNumber }
  return passData

})

export const editProduct = async (submitData: {
  productId: string;
  productName: string;
  description: string;
  price: string;
  category: string;
  gender: string;
  sizes: { size: string; quantity: string; }[];
  images?: { id: string; path: string; }[];
}): Promise<void> => {
  const {
    productId, productName, description, price, gender, category, sizes, images
  } = submitData
  const parseSizes = sizes.map((size) => {
    return {
      size: size.size, 
      quantity: parseInt(size.quantity)
    }
  })
  const dateTime = Timestamp.fromDate(new Date())
  try {
    await setDoc(doc(db, 'products', productId), { 
      productId: productId,
      productName: productName,
      description: description,
      price: parseInt(price, 10),
      category: category,
      gender: gender,
      sizes: parseSizes,
      images: images,
      updated_at: dateTime,
     }, { merge: true })
  } catch(err) {
    console.log('Error updating document:', err)
  }
}

export const addProduct = async (submitData: {
  productId: string;
  productName: string;
  description: string;
  price: number;
  category: string;
  gender: string;
  sizes: { size: string; quantity: number;}[],
  images?: {id: string, path: string}[];
}): Promise<void> => {
  const { 
    productId,
    productName,
    description,
    price,
    category,
    gender,
    sizes,
    images,
   } = submitData
  const dateTime = Timestamp.fromDate(new Date())
  try {
    const ref = doc(collection(db, 'products', productId))
    await setDoc(ref, {
      // productId: ref.id,
      productName: productName,
      description: description,
      price: price,
      category: category,
      gedner: gender,
      sizes: sizes,
      images: images,
      updated_at: dateTime,
    }, { merge: true })
  } catch(err) {
    console.log('Error writing document:', err)
  }
}

export const saveProduct = async (submitData: {
  productName: string;
  description: string;
  price: string;
  category: string;
  gender: string;
  sizes: { size: string; quantity: string}[];
  images?: {id: string; path: string;}[]
}): Promise<void> => {
  const {
    productName, 
    description,
    price,
    category,
    gender,
    sizes,
    images
  } = submitData
  const dateTime = Timestamp.fromDate(new Date()) 
  const parseSizes = sizes.map((size) => {
    return {
      size: size.size,
      quantity: parseInt(size.quantity)
    }
  })
  try {
    const ref = doc(collection(db, 'products'))
     await setDoc(ref, {
      productId: ref.id,
      productName: productName,
      description: description,
      price: parseInt(price, 10),
      gender: gender,
      category: category,
      sizes: parseSizes,
      images: images,
      created_at: dateTime
    })
  } catch(err: any) {
    alert(err.message)
  }
}


export const deleteProduct = async (id: string) => {
  await deleteDoc(doc(db, 'products', id))
}


export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.products = action.payload.allProducts
      state.idCount = action.payload.productNumber
    })
  }
})

export const productSelector = (state: RootState) => state.product

export const selectedProductsSelctor = createSelector(productSelector, (product) => {
  return product.selectedProduct
})


export default productSlice.reducer