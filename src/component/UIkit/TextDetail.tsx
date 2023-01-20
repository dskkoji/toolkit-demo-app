import React from 'react'
import Box from '@mui/material/Box'

type PropsType = {
  label: string;
  value: string;
}

const TextDetail: React.FC<PropsType> = (props) => {
  return (
    <Box sx={{ display: 'flex', flexBox: 'row wrap', marginBottom: 2 }}>
      <Box sx={{ ml: 0, mr: 'auto' }}>
        {props.label}
      </Box>
      <Box sx={{ fontWeight: 600, ml: 'auto', mr: 0 }}>
        {props.value}
      </Box>
    </Box>
  )
} 

export default TextDetail
