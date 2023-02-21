import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../app/store'
import { useDispatch } from 'react-redux'
import { fetchProducts } from '../../features/product/productSlice'
import ProductCard from './ProductCard'
import { AppDispatch } from '../../app/store'
import { useSearchParams } from 'react-router-dom'
import escapeStringRegexp from 'escape-string-regexp'

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
  const [searchParams, setSearchParams] = useSearchParams()

  
  useEffect(() => { 
    let params: string | null = null
 
    if (window.location.search.includes('gender')) {
        params = window.location.search
        console.log(params)
      }
    if (window.location.search.includes('category')) {
        params = window.location.search
        console.log(params)
      }
    if (window.location.search.includes('keyword')) {
      params = window.location.search
      console.log(params)
    }
   
  
    const getData = (p: string | null ) => {
      dispatch(fetchProducts(p))
    }
    getData(params)
  }, [dispatch, searchParams])

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