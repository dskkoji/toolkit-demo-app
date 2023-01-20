import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { useDispatch } from 'react-redux'
import { fetchProducts } from '../../features/product/productSlice'
import ProductCard from './ProductCard'
import { AppDispatch } from '../../app/store'

type Products = {
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

const ProductList: React.FC = () => {
  const products: Products = useSelector((state: RootState) => state.product.products)
  const dispatch: AppDispatch = useDispatch()

  // const query = window.location.search
  // const gender = /^\?gender=/.test(query) ? query.split('?gender=')[1] : ""
  // const category = /^\?category=/.test(query) ? query.split('?category=')[1] : "" 

  // useEffect(() => {
  //   dispatch(fetchProducts(gender, category))
  // }, [query])
  useEffect(() => {
    const getData = () => {
      dispatch(fetchProducts())
    }
    getData()
  }, [])

  return (
    <section className="c-section-wrapin">
      <div className="p-grid__row">
        {products.length > 0 && (
          products.map((product) => (
            <ProductCard 
              key={product.productId}
              productId={product.productId}
              images={product.images}
              price={product.price}
              name={product.productName}
            />
          ))
        )}
      </div>
    </section>
  )
}

export default ProductList