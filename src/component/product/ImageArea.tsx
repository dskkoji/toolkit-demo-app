import React, { useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import { storage } from '../../firebase/index'
import ImagePreview from './ImagePreview'
import { deleteObject, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

type PropsType = {
  images: {id: string; path: string;} [];
  setImages: any;
}

const ImageArea: React.FC<PropsType> = (props) => {

  const deleteImage = useCallback(async (id: string) => {
    const ret = window.confirm("この画像を削除しますか？")
    if (!ret) {
      return false
    } else {
      const newImages = images.filter(image => image.id !== id)
      props.setImages(newImages)
      await deleteObject(ref(storage, `images/${id}`))
    }
  }, [props.images])

  const uploadImage = useCallback((e: any) => {
    const file = e.target.files
    let blob = new Blob(file, { type: 'image/jpeg' })

    const S = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    const N=16
    const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N))).map((n) => S[n%S.length]).join('')

    const uploadRef = ref(storage, `image/${fileName}`)
    const uploadTask = uploadBytesResumable(uploadRef, blob)

    uploadTask.on("state_changed", 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            const newImage = { id: fileName, path: downloadURL }
            props.setImages((prevState: any) => [...prevState, newImage])
          })
      }
    )
  }, [props.setImages])

  const images = props.images
  return (
    <div>
      <div className="p-grid__list-images">
        {images.length > 0 && (
          images.map((image) => 
          <ImagePreview 
            delete={deleteImage}
            key={image.id}
            id={image.id}
            path={image.path}
           />
          )
        )}
      </div>
      <div className="u-text-right">
        <span>商品画像を登録する</span>
        <IconButton sx={{ mr: 8, height: 48, width: 48 }}>
          <label>
            <AddPhotoAlternateIcon />
            <input 
              className="u-display-none" 
              type="file" 
              id="image"
              onChange={(e) => uploadImage(e)}
            />
          </label>
        </IconButton>
      </div>
    </div>
  )
}

export default ImageArea