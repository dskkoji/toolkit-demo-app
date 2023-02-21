import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { collection, getDocs, query, orderBy, setDoc, doc, Timestamp, deleteDoc, where, startAt, endAt, limit } from 'firebase/firestore';
import { db } from '../../firebase/index'
import { AppThunk, RootState } from '../../app/store'
import { createSelector } from 'reselect'
import { map } from '@firebase/util';
// import escapeStringRegexp from 'escape-string-regexp'

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

export const ngram = (words: any, n: number) => {
  let i
  let grams = []
  for (i = 0; i <= words.length -n; i++) {
    grams.push(words.substr(i, n).toLowerCase())
  }
  return grams
}


export const fetchProducts = createAsyncThunk('product/getAllProducts', async (params: string | null) => {
  const productsRef = collection(db, 'products')
  let queryOption = [
    orderBy('created_at', 'desc'),
  ]
  
  let keyword
  if (params?.includes('gender')) {
    keyword = params.split('?gender=')[1]
    queryOption.push(where('gender', '==', keyword))
  }
  if (params?.includes('category')) {
    keyword = params.split('?category=')[1]
    queryOption.push(where('category', '==', keyword))
  }

  if (params?.includes('keyword')) {
    keyword = params.split('?keyword=')[1]
    let newSearchGrams = ngram(keyword, 2)
    newSearchGrams = newSearchGrams.filter(searchGram => {
      return searchGram.length > 1
    })
    // console.log(newSearchGrams)
    queryOption.push(limit(30))
    newSearchGrams.forEach((searchGram) => {
      queryOption.push(where(`word.${searchGram}`, '==', true))
    })
  }

  const q = query(productsRef, ...queryOption)
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
    const wordArr = ngram(productName, 2)
    let wMap = new Map()
    for (let i = 0; i < wordArr.length; i++) {
      wMap.set(wordArr[i], true)
    }
    const wObj = Object.fromEntries(wMap)
    console.log(wObj)
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
      word: wObj
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
    const wordArr = ngram(productName, 2)
    let wmap = new Map()
    for (let i = 0; i < wordArr.length; i++) {
      wmap.set(wordArr[i], true)
    }
    const wObj = Object.fromEntries(wmap)
    console.log(wObj)
    
     await setDoc(ref, {
      productId: ref.id,
      productName: productName,
      description: description,
      price: parseInt(price, 10),
      gender: gender,
      category: category,
      sizes: parseSizes,
      images: images,
      created_at: dateTime,
      word: wObj
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