import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import NoImage from '../../assets/img/icons/no_image.png'
import { Navigation, Pagination } from 'swiper'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type PropsType = {
  images: any[];
}

const ImageSwiper: React.FC<PropsType> = (props) => {
  const images = props.images
  

  return (
    <Swiper 
      modules={[Navigation, Pagination]}
      pagination={{ clickable: true }}
      navigation
      spaceBetween={30}
    >
      {images.length === 0 ? ( 
        <div className="p-media__thumb">
          <img src={NoImage} alt="No Image" />
        </div>
      ) : (
        images.map((image) => (
          <div className="p-media__thumb" key={image.id}>
            <img src={image.path} alt="商品画像" />
          </div>
        ))
      )}
    </Swiper>
  )
}

export default ImageSwiper