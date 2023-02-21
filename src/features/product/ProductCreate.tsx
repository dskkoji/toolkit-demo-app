import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import SelectBox from '../../component/UIkit/SelectBox'
import { useDispatch } from 'react-redux'
// import { AppDispatch } from '../../app/store'
import TextField from '@mui/material/TextField'
import { useForm } from 'react-hook-form'
import ImageArea from '../../component/product/ImageArea'
import SetSizeArea from '../../features/product/SetSizeArea'
import { db } from '../../firebase/index'
import { saveProduct, fetchProducts } from '../product/productSlice'
import { useNavigate } from 'react-router-dom'
import { collection, Timestamp, setDoc, doc, query, orderBy, getDocs } from 'firebase/firestore'

type SubmitData = {
  productName: string;
  description: string;
  price: string;
}

type Size = {
  size: string;
  quantity: string;
}

const ProductCreate: React.FC = () => {
  const navigate = useNavigate()
  const { register, handleSubmit } = useForm<SubmitData>()
  const [gender, setGender] = useState('')
  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [images, setImages] = useState<any>([])
  const [sizes, setSizes] = useState<Size[]>([])


  const genders = [
    { id: 'all', name: 'すべて' },
    { id: 'male', name: 'メンズ' },
    { id: 'female', name: 'レディス' },
  ]

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('order', 'asc'))
    getDocs(q)
      .then((querySnapshot) => {
        const list: any[] = []
        querySnapshot.forEach((snapshot) => {
          const data = snapshot.data()
          list.push({
            id: data.id,
            name: data.name
          })
        })
        setCategories(list)
      })
  }, [])

  const onSubmit = async (data: SubmitData) => {
    const sendData = {
      productName: data.productName,
      description: data.description,
      price: data.price,
      category: category,
      gender: gender,
      sizes: sizes,
      images: images
    }
    await saveProduct(sendData)
    navigate('/')
  }

  return (
    <section>
      <h2 className="u-text__headline u-text-center">商品の登録</h2>
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
            {...register('productName', {
              required: true
            })}
          />
          <TextField 
            sx={{ mb: 2 }}
            fullWidth
            label="商品説明"
            type="text"
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

export default ProductCreate