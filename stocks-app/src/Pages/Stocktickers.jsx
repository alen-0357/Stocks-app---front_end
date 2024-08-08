import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import '../Ticker.css';

const stockNames = [
  'Apple', 'Google', 'Accenture', 'Coco Cola',
  'Microsoft', 'Amazon', 'Facebook', 'Tesla',
  'Netflix', 'Adobe', 'Nvidia', 'BYD'
];

const generateRandomStockData = () => {
  return stockNames.map(name => ({
    name,
    change: (Math.random() * 20 - 10).toFixed(2), // Random percentage change between -10 and 10
    chartData: Array.from({ length: 10 }, () => Math.random() * 20 - 10), // Random chart data
  }));
};

const StockTicker = () => {
  const [stockData, setStockData] = useState(generateRandomStockData());

  useEffect(() => {
    const interval = setInterval(() => {
      setStockData(generateRandomStockData());
    }, 3000); // Update every 5 seconds (slower speed)

    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="ticker">
      {stockData.map((stock, index) => (
        <Box key={index} className="ticker-item">
          <Typography variant="body1">
            {stock.name}: {stock.change}%
          </Typography>
          <Sparklines data={stock.chartData} width={60} height={20}>
            <SparklinesLine color={stock.change >= 0 ? 'green' : 'red'} />
          </Sparklines>
        </Box>
      ))}
    </Box>
  );
};

export default StockTicker;
