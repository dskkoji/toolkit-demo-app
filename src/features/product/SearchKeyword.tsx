import React, { useState, useEffect } from 'react'
import escapeStringRegexp from 'escape-string-regexp'
import { RootState } from '../../app/store'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { fetchProducts } from '../product/productSlice'
import ProductCard from '../product/ProductCard'

const SearchKeyword: React.FC = () => {
  const products = useAppSelector((state: RootState) => state.product.products)
  const [searchKeyword, updateSearchKeyword] = useState('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    const getData = () => {
      dispatch(fetchProducts(null))
    }
    getData()
  }, [])
  
  let list = products.map((item) => 
    item.productName
  )

  const onInput = (e: React.FormEvent<HTMLInputElement>) => {
    updateSearchKeyword(e.currentTarget.value)
  }

  const filteredList = list.filter((item) => {
    const escapedText = escapeStringRegexp(searchKeyword.toLowerCase())
    return new RegExp(escapedText).test(item.toLowerCase())
  })

  return (
    <div className="c-section-wrapin">
      <h1>Simple Keyword search</h1>
      <div>
        <label htmlFor="search-keyword">Search</label>
        <input 
          id="search-keyword"
          type="text"
          onInput={onInput}
          placeholder={"input search keyword"}
        />
      </div>
      <ul>
        {filteredList.map((item) => {
          return <li key={item}>{item}</li>
        })}
      </ul>
      <div className="p-grid__row">
        {products.length > 0 && (
          products.map((product) => (
            <ProductCard
              key={product.productId}
              productId={product.productId}
              name={product.productName}
              images={product.images}
              price={product.price}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default SearchKeyword