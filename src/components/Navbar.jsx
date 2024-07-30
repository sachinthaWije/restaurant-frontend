import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import React from 'react'

const Navbar = () => {
  return (
    <AppBar position='static'>
        <Toolbar>
            <Typography variant='h6' sx={{flexGrow:1}}>
                ABC Restaurant
            </Typography>
            <Button color='inherit'>Home</Button>
            <Button color='inherit'>Menu</Button>
            <Button color='inherit'>About Us</Button>
            <Button color='inherit'>Contact</Button>
        </Toolbar>
    </AppBar>
  )
}

export default Navbar