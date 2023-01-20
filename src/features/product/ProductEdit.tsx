import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import SelectBox from '../../component/UIkit/SelectBox'
import TextField from '@mui/material/TextField'
import { useForm  } from 'react-hook-form'
import ImageArea from '../../component/product/ImageArea'
import SetSizeArea from '../../features/product/SetSizeArea'
import { db } from '../../firebase/index'
import { editProduct } from '../product/productSlice'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'

type SubmitData = {
  productName: string;
  description: string;
  price: string;
}

type Size = {
  size: string;
  quantity: string;
}

const ProductEdit: React.FC = () => {
  let productId  = window.location.pathname.split('/product/edit')[1]
  if (productId !== '') {
    productId = productId.split('/')[1]
  }
  console.log(productId)
  const navigate = useNavigate()
  const { register, handleSubmit, setValue } = useForm<SubmitData>()
  const [gender, setGender] = useState('')
  const [category, setCategory] = useState('')
  const [images, setImages] = useState<any>([])
  const [sizes, setSizes] = useState<Size[]>([])
  // const [description, setDescription] = useState<string>('')
  const [price, setPrice] = useState<any>(0)
  // const [productName, setProductName] = useState<string>('')


  const genders = [
    { id: 'all', name: 'すべて'},
    { id: 'male',  name: 'メンズ' },
    { id: 'female',  name: 'レディス' }
  ]

  const categories = [
    { id: 'shirts', name: 'シャツ' },
    { id: 'pants', name: 'パンツ' }
  ]

  
  const onSubmit = async (data: SubmitData) => {
    const sendData = {
      productId: productId,
      productName: data.productName,
      description: data.description,
      price: data.price,
      category: category,
      gender: gender,
      sizes: sizes,
      images: images
    }
    await editProduct(sendData)
    navigate('/')
  }
  
  useEffect(() => {
    let productId  = window.location.pathname.split('/product/edit')[1]
    if (productId !== '') {
    productId = productId.split('/')[1]
  }
    getDoc(doc(db, 'products', productId))
      .then(snapshot => {
        const product: any = snapshot.data()
        setCategory(product.category)
        setGender(product.gender)
        setSizes(product.sizes)
        setImages(product.images)
        setValue('productName', product.productName)
        setValue('description', product.description)
        setValue('price', product.price)
      })
  }, [productId, setValue])


  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録・編集</h2>
      <div className="c-section-container">
        <form
          onSubmit={handleSubmit(onSubmit)} 
          >
            <ImageArea 
              images={images} 
              setImages={setImages} 
            />
            <TextField 
              sx={{ mb: 2 }}
              fullWidth
              label="商品名"
              type="text"
              InputLabelProps={{ shrink: true }}
              {...register('productName', {
                required: true
              })}
            />
            <TextField 
              sx={{ mb: 2 }}
              fullWidth
              label="商品説明"
              type="text"
              InputLabelProps={{ shrink: true }}
              rows={5}
              {...register('description', {
                required: true
              })}
            />
            <TextField  
              sx={{ mb: 2 }}
              fullWidth
              label="価格"
              type="number"
              defaultValue={price}
              {...register('price', {
                required: true
              })}
            />
            <SelectBox 
              required={true}
              label={"性別"}
              select={setGender}
              options={genders}
              value={gender}
            />
            <SelectBox 
              required={true}
              label={"カテゴリー"}
              select={setCategory}
              options={categories}
              value={category}
            />
            <div className="module-spacer--small" />
            <SetSizeArea sizes={sizes} setSizes={setSizes} />
            <div className="center">
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
              >
                商品情報を保存
              </Button>
          </div>
        </form>
      </div>  
    </section>
  )
}

export default ProductEdit