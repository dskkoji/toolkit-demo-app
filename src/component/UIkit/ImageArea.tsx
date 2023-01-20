import React from 'react'
import noImage from 'assets/img/no_image.png'

type PropsType = {
  id: string;
  upload: (e: any) => void;
  preview: (id: string, e: any) => void;
  delete: (id: string) => void;
}

const ImageArea: React.FC<PropsType> = (props) => {
  return (
    <div className="p-input__image">
      <img 
        src={noImage}
        id={props.id + "-thumb"}
        onClick={() => props.upload(props.id)}
        alt="image"
      />
      <input 
        id={props.id} 
        type="file" 
        data-name=""
        onChange={e => props.preview(props.id, e)}
        />
        <button onClick={() => props.delete(props.id)}>&times;</button>
    </div>
  )
}

export default ImageArea