import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

type Size = {
  size: string;
  quantity: string;
}

type PropsType = {
  sizes: {size: string; quantity: string}[];
  setSizes: React.Dispatch<React.SetStateAction<Size[]>>;
}

const SetSizeArea: React.FC<PropsType> = (props) => {
  const [index, setIndex] = useState(0)
  const [size, setSize] = useState("")
  const [quantity, setQuantity] = useState(0)

  const inputSize = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSize(e.target.value)
  }

  const inputQuantity = (e: any) => {
    setQuantity(e.target.value)
  }

  const addSize = (index: number, size: string, quantity: string) => {
    if (size === "" || parseInt(quantity) === 0) {
      return false
    } else {
      if (index === props.sizes.length) {
        props.setSizes((prevState: Size[]) => [...prevState, { size: size, quantity: quantity }])
        setIndex(index + 1)
        setSize("")
        setQuantity(0)
      } else {
        const newSizes = props.sizes
        newSizes[index] = { size: size, quantity: quantity }

        props.setSizes(newSizes)
        setIndex(newSizes.length)
        setSize("")
        setQuantity(0)
        console.log(newSizes)
      }
    }    
  }

  const editSize = (index: number, size: string, quantity: number) => {
    console.log(index)
    setIndex(index)
    setSize(size)
    setQuantity(quantity)
  }

  const deleteSize = (deleteIndex: number) => {
    const newSizes = props.sizes.filter((item, index) => index !== deleteIndex)
    props.setSizes(newSizes)
  }

  useEffect(() => {
    setIndex(props.sizes.length)
    console.log(props.sizes)
  }, [props.sizes.length])

  return (
    <div aira-label="サイズ展開">
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>サイズ</TableCell>
              <TableCell>数量</TableCell>
              <TableCell sx={{ p: 0, height: 6, width: 6 }}/>
              <TableCell sx={{ p: 0, height: 6, width: 6 }}/>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.sizes.length> 0 && (
                props.sizes.map((item ,index) => (
                  <TableRow key={item.size}>
                    <TableCell component="th" scope="row">{item.size}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell 
                      sx={{ p: 0, height: 48, width: 48 }}
                    >
                      <IconButton 
                        sx={{ p: 0, height: 48, width: 48 }}
                        onClick={() => editSize(index, item.size, parseInt(item.quantity))}  
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                    <TableCell 
                      sx={{ p: 0, height: 48, width: 48}}
                    >
                      <IconButton 
                        sx={{ p: 0, height: 48, width: 48 }}
                        onClick={() => deleteSize(index)}  
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )
            }
          </TableBody>
        </Table>
        <div>
          <TextField 
            fullWidth
            label="サイズ"
            onChange={(e) => inputSize(e)}
            rows={1} 
            value={size}
            type="text"
            required={false}
            sx={{ mb: 2 }}
          />
          <TextField 
            fullWidth
            label="数量"
            onChange={(e) => inputQuantity(e)}
            rows={1} 
            value={quantity}
            type="number"
            required={false}
          />
        
        </div>
        <IconButton sx={{ float :'right' }} onClick={() => addSize(index, size, String(quantity))} >
          <CheckCircleIcon />
        </IconButton>
      </TableContainer>
      <div className="module-spacer--small" />
    </div>
  )
}

export default SetSizeArea