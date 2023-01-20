import React from 'react'

type PropsType = {
  delete: (id: string) => void;
  id: string;
  path: string;
}

const ImagePreview:React.FC<PropsType> = (props) => {
  return (
    <div className="p-media__thumb" onClick={() => props.delete(props.id)}>
      <img alt="image" src={props.path} />
    </div>
  )
}

export default ImagePreview