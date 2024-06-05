import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import '../Dash.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.config'; 
import { Card, CardContent, Typography, CircularProgress, Box } from '@mui/material';

const PortfolioReport = () => {
  const [buyPortfolioData, setBuyPortfolioData] = useState([]);
  const [sellPortfolioData, setSellPortfolioData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userId } = useUser();
  const [depositedFunds, setDepositedFunds] = useState(0);

  useEffect(() => {
    // Fetch data only if user ID is available
    if (userId) {
      fetchData('BUY');
      fetchData('SELL');
      fetchDepositedFunds();
    }
  }, [userId]);

  const fetchData = async (transactionType) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/portfolio/${transactionType}`, {
        headers: {
          Authorization: userId,
        },
      });

      if (transactionType === 'BUY') {
        setBuyPortfolioData(response.data);
      } else if (transactionType === 'SELL') {
        setSellPortfolioData(response.data);
      }
    } catch (error) {
      console.error(`Error fetching ${transactionType} portfolio data:`, error);
      setError(`Error fetching ${transactionType} portfolio data. Please try again later.`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepositedFunds = async () => {
    try {
      const q = query(collection(db, 'deposits'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      let totalFunds = 0;
      querySnapshot.forEach((doc) => {
        totalFunds += parseFloat(doc.data().Fund);
      });
      setDepositedFunds(totalFunds);
    } catch (error) {
      console.error('Error fetching deposited funds:', error);
      setError('Error fetching deposited funds. Please try again later.');
    }
  };

  // Render loading or error message if user ID is still not available
  if (!userId) {
    return <p>Loading portfolio data...</p>;
  }

  return (
    <div className="portfolio-container">
      <h1>Portfolio Report</h1>

   
      {/* Display Deposited Funds */}
      <Box display="flex" justifyContent="left" marginBottom={4}>
        <Card variant="outlined" style={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Total Deposited Funds
            </Typography>
            {loading && <CircularProgress />}
            {error && <Typography color="error">{error}</Typography>}
            {!loading && !error && (
              <Typography variant="h4" component="div">
                {depositedFunds} INR
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>


      {/* Display BUY portfolio data */}
      <h2>Total Stocks Bought</h2>
      {loading && <p>Loading portfolio data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Total Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {buyPortfolioData.map((stock) => (
              <tr key={stock.stock_name}>
                <td>{stock.stock_name}</td>
                <td>{stock.total_quantity}</td>
                <td>{stock.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Display SELL portfolio data */}
      <h2>Total Stocks Sold</h2>
      {loading && <p>Loading portfolio data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && (
        <table className="portfolio-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Total Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {sellPortfolioData.map((stock) => (
              <tr key={stock.stock_name}>
                <td>{stock.stock_name}</td>
                <td>{stock.total_quantity}</td>
                <td>{stock.total_price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PortfolioReport;