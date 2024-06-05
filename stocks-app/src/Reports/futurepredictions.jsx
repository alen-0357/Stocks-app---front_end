import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import Typography from '@mui/material/Typography';

const TheFuturePredictions = () => {
    const [stocks, setStocks] = useState([]);
    const [stockId, setStockId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    
    const [validationError, setValidationError] = useState(null);
    const { userId } = useUser();
    const [futurePredictions, setFuturePredictions] = useState([]);

    useEffect(() => {
        // Fetch stocks when the component mounts
        axios.get('http://127.0.0.1:5000/stocks')
          .then(response => {
            setStocks(response.data);
          })
          .catch(error => {
            console.error('Error fetching stocks:', error);
          });
      }, []);
    
  
    useEffect(() => {
        // Fetch future predictions when stockId and endDate change
        if (stockId && endDate) {
          // Validate dates
          if (new Date(startDate) > new Date(endDate)) {
            setValidationError('Error, Please correct the date given.');
           
           
            setFuturePredictions([]); // Clear future predictions
            return;
          } else {
            setValidationError(null); // Clear validation error
          }
    
          // Fetch future predictions
          axios.post(`http://127.0.0.1:5000/predict_stock_future_transactions`, {
              stock_id: stockId,
              end_date: endDate,
            }, {
              headers: {
                Authorization: userId, // Include the user ID in the headers
              },
            })
            .then(response => {
              // Check if the response has predictions field
              const predictions = response.data.future_predictions || [];
              setFuturePredictions(predictions);
            })
            .catch(error => {
              console.error('Error fetching future predictions:', error);
            });
        }
      }, [stockId, endDate, userId]);
    
        useEffect(() => {
        // Fetch future predictions when stockId and endDate change
        if (stockId && endDate) {
          // Validate dates
          if (new Date(startDate) > new Date(endDate)) {
            setValidationError('Error, Please correct the date given.');
           
            setFuturePredictions([]); // Clear future predictions
            return;
          } else {
            setValidationError(null); // Clear validation error
          }
    
          // Fetch future predictions
          axios.post(`http://127.0.0.1:5000/predict_stock_future_transactions`, {
              stock_id: stockId,
              end_date: endDate,
            }, {
              headers: {
                Authorization: userId, // Include the user ID in the headers
              },
            })
            .then(response => {
              // Check if the response has predictions field
              const predictions = response.data.future_predictions || [];
              setFuturePredictions(predictions);
            })
            .catch(error => {
              console.error('Error fetching future predictions:', error);
            });
        }
      }, [stockId, endDate, userId]);
    

// Render future predictions as a styled table
const renderFuturePredictions = () => {
    return (
      <div>
        <h1 align="center">Future Predictions</h1>
        <table style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Date</th>
              <th style={{ padding: '10px', border: '1px solid #dddddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {futurePredictions.map(prediction => (
              <tr key={prediction[0]}>
                <td style={{ padding: '10px', border: '1px solid #dddddd' }}>
                  {/* Format the date using toLocaleDateString */}
                  {new Date(prediction[0]).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px', border: '1px solid #dddddd', color: prediction[1] === 'BUY' ? 'green' : 'red' }}>
                  {prediction[1]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    
  };
  return (
    <div>
        <div style={{ marginBottom: '20px' }}>
<Typography variant="body1" paragraph style={{ color: "#666666", marginBottom: "10px" }}>
        Provide stock name and date and u will be provided with the predictions for next 5 days 
      </Typography>
</div>
      <div style={{ marginBottom: '20px' }}>
  <label htmlFor="stockSelect" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Stock:</label>
  <select id="stockSelect" onChange={(e) => setStockId(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
    <option value="">Select a stock</option>
    {stocks.map(stock => (
      <option key={stock.id} value={stock.id}>{stock.stock_name}</option>
    ))}
  </select>
</div>



<div style={{ marginBottom: '20px' }}>
  <label htmlFor="endDate" style={{ marginRight: '10px', fontWeight: 'bold' }}>Date:</label>
  <input type="date" id="endDate" onChange={(e) => setEndDate(e.target.value)} min={startDate} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
</div>
      <br />
      {validationError && (
        <div style={{ color: 'red' }}>
          {validationError}
        </div>
      )}
      {renderFuturePredictions()}
      </div>
  );   
};

export default TheFuturePredictions;