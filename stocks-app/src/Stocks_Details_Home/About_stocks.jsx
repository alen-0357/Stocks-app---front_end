import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../UserContext';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';

import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import TopnavBar from '../components/StocksTopnav';

const AboutStocks = () => {
  const { stockId } = useParams();
  const { userId } = useUser();
  const [stockData, setStockData] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/specstockid`, {
          params: { stock_id: stockId },
          headers: { Authorization: userId },
        });
        setStockData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchStockData();
  }, [stockId, userId]); 

  if (!stockData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="bgcolor">
        <Navbar/>
        <Box height={70} />
        <Box sx={{ display: 'flex' }}>
          <Sidenav/>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <TopnavBar/>
            <Box sx={{ mt: 3 }}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                  {stockData.stock_name}
                </Typography>
                <Typography variant="h6" gutterBottom color="textSecondary">
                  {stockData.stock_ticker}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Market Cap:</strong> $200 Billion</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>PE Ratio:</strong> 25.6</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Dividend Yield:</strong> 2.5%</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>52 Week High:</strong> $60.00</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>52 Week Low:</strong> $40.00</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1"><strong>Average Volume:</strong> 10M</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default AboutStocks;
