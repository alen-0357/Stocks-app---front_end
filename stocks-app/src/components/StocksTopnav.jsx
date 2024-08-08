import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const TopnavBar = () => {
  return (
    <AppBar position="static" sx={{ bgcolor: 'white', color: 'black' }}>
      <Toolbar>
     
        <Box sx={{ display: 'flex', gap: 23 }}>
          <Button color="inherit"  >Overview</Button>
          <Button color="inherit" component={Link} to="/chart">Chart</Button>
          <Button color="inherit" component={Link} to="/analysis">Analysis</Button>
          <Button color="inherit" component={Link} to="/news">News</Button>
          <Button color="inherit" component={Link} to="/financials">Financials</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopnavBar;
