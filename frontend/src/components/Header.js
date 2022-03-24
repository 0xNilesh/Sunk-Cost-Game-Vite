import React from 'react';
import { AppBar, IconButton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Header = ({ toggleTheme }) => {
  let theme = useTheme();

  return (
    <div>
      <AppBar position="static">  
        <Typography variant="h6" component="div">
          Home
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>        
      </AppBar>
    </div>
  );
}

export default Header;