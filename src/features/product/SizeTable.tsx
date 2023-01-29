import React from 'react'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

type PropsType = {
  sizes: {size: string; quantity: number;}[];
  addProduct: (selectedSize: string) => void;
  addFavorite: (selectedSize: string) => void;
}

const SizeTable: React.FC<PropsType> = (props) => {
  
  return (
    <TableContainer>
      <Table aria-label="simple table">
        <TableBody>
          {props.sizes.length > 0 && (
            props.sizes.map((item, index) => (
              <TableRow key={item.size}>
                <TableCell component="th" scope="row">{item.size}</TableCell>
                <TableCell>残り{item.quantity}</TableCell>
                <TableCell sx={{ p: 0, height: 48, width: 48 }}>
                  {item.quantity > 0 ? ( 
                    <IconButton
                      sx={{ p: 0, height: 48, width: 48 }}
                      onClick={() => props.addProduct(item.size)}
                    >
                      <ShoppingCartIcon />
                    </IconButton>
                    ): (
                      <div>売切</div>
                    )}
                </TableCell>
                <TableCell sx={{ p: 0, height: 48, width: 48 }}>
                  <IconButton 
                    sx={{ p: 0, height: 48, width: 48 }}
                    onClick={() => props.addFavorite(item.size)}
                    >
                      <FavoriteBorderIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SizeTable