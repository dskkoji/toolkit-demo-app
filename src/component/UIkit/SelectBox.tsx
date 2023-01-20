import React from 'react'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Settings } from 'http2'

type PropsType = {
  required: boolean;
  label: string;
  select: any;
  value: string;
  options: {id: string; name: string }[];
}

const SelectBox: React.FC<PropsType> = (props) => {
  return (
    <FormControl sx={{ mb: 2, minWidth: 120, width: "100%" }} >
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={props.value}
        required={props.required}
        onChange={(e) => props.select(e.target.value)}
      >
        {props.options.map((value) => {
          return <MenuItem key={value.id} value={value.id} >{value.name}</MenuItem>
        })}
      </Select>
    </FormControl>
  )
}

export default SelectBox