import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Fulltransactionschart from './fulltrancchart';



// Dummy Chart


// const DummyTooltip = ({ active, payload, label }) => {
//   if (active && payload && payload.length) {
//     return (
//       <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
//         <p>Date: {label}</p>
//         {payload.map((entry, index) => (
//           <p key={index} style={{ color: entry.color }}>
//             Quantity: {entry.payload.quantity}
//             <br />
//             Price: {entry.payload.total_price}
//           </p>
//         ))}
//       </div>
//     );
//   }

//   return null;
// };




// Main Chart 
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>Date: {label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}:
            <p>Quantity: {entry.payload[`${entry.name.toLowerCase()}Quantity`]}</p>
            <p>Price: {entry.payload[`${entry.name.toLowerCase()}TotalPrice`]}</p>
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const ApexBrushChart = () => {
  const [stocks, setStocks] = useState([]);
  const [stockId, setStockId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [fulltransactions, setfullTransactions] = useState([]);
  const [profit, setProfit] = useState(null);
  const [loss, setLoss] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const { userId } = useUser();
  const [futurePredictions, setFuturePredictions] = useState([]);
// Calculate the stroke color based on profitLoss value
const getStrokeColor = (data) => (data.payload.profitLoss >= 0 ? 'green' : 'red');
const strokeColor = getStrokeColor({ payload: { profitLoss: 0 } }); // Just to ensure it's a string
const [isLoading, setIsLoading] = useState(true); // State to manage loading state

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
    // Fetch transactions when stockId, startDate, or endDate changes
    if (stockId && startDate && endDate) {
      // Validate dates
      if (new Date(startDate) > new Date(endDate)) {
        setValidationError('Error, Please correct the date given.');
        setTransactions([]); // Clear transactions
        setProfit(null); // Clear profit
        setLoss(null); // Clear loss
        return;
      } else {
        setValidationError(null); // Clear validation error
      }

      axios.get(`http://127.0.0.1:5000/stocktransactionsreport?stock_id=${stockId}&start_date=${startDate}&end_date=${endDate}`, {
          headers: {
            Authorization: `${userId}`, // Include the user ID in the headers
          },
        })
        .then(response => {
          setTransactions(response.data.transactions);
          setValidationError(null);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
        });

      // Fetch profit
      axios.get(`http://127.0.0.1:5000/stockprofitreport?stock_id=${stockId}&start_date=${startDate}&end_date=${endDate}`, {
          headers: {
            Authorization: `${userId}`, // Include the user ID in the headers
          },
        })
        .then(response => {
          console.log("Hello", userId)
          setProfit(response.data.profit);
          setLoss(response.data.loss);
        })
        .catch(error => {
          console.error('Error fetching profit:', error);
        });
    }
  }, [stockId, startDate, endDate, userId]);





  
    // useEffect(() => {
    //   // Fetch transactions when stockId changes
    //   if (stockId) {
    //     // Validate dates
    //     if (new Date(startDate) > new Date(endDate)) {
    //       setValidationError('Error, Please correct the date given.');
    //       setTransactions([]); // Clear transactions
    //       setProfit(null); // Clear profit
    //       return;
    //     } else {
    //       setValidationError(null); // Clear validation error
    //     }

    //     axios.get(`http://127.0.0.1:5000/fullstockstransactionsreport?stock_id=${stockId}`, {
    //         headers: {
    //           Authorization: `${userId}`, // Include the user ID in the headers
    //         },
    //       })
    //       .then(response => {
    //         setfullTransactions(response.data);
    //         console.log('Response from backend:', response.data);
    //         setIsLoading(false); // Set loading state to false after data is fetched
    //         setValidationError(null);
       

            

       
        
                              

    //       })
    //       .catch(error => {
    //         // Clear chart data and set error message if stockId is not provided
    //         setfullTransactions([]);
    //         setIsLoading(false); // Set loading state to false if there's an error
    //         console.error('Error fetching transactions:', error);
    //       });
    //     }
    //   }, [stockId, userId]);
    













//////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    // Fetch future predictions when stockId and endDate change
    if (stockId && endDate) {
      // Validate dates
      if (new Date(startDate) > new Date(endDate)) {
        setValidationError('Error, Please correct the date given.');
        setTransactions([]); // Clear transactions
        setProfit(null); // Clear profit
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

  //////////////////////////////////////////////////////////////////////////////////////////////////



  // Combine buy and sell transactions for each date
  const combinedData = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = {
        date: date,
        buyQuantity: 0,
        sellQuantity: 0,
        buyTotalPrice: 0,
        sellTotalPrice: 0,
      };
    }
    if (transaction.transaction_type === 'BUY') {
      acc[date].buyQuantity += transaction.quantity;
      acc[date].buyTotalPrice += transaction.total_price;
    } else if (transaction.transaction_type === 'SELL') {
      acc[date].sellQuantity += transaction.quantity;
      acc[date].sellTotalPrice += transaction.total_price;
    }
    return acc;
  }, {});

  // Convert combined data into array format for recharts and sort by date
  const chartData = Object.values(combinedData)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
    
  
    // const renderchart = () => {
    //   return (
    //     <div>
    //       <h1 align="center">Transactions Chart</h1>
    //       {isLoading ? ( // Display loading message while fetching data
    //         <p>Loading...</p>
    //       ) : transactions.length > 0 ? ( // Check if there are transactions available
    //         <ResponsiveContainer width="100%" height={400}>
    //           <LineChart data={fulltransactions}>
    //             <CartesianGrid strokeDasharray="3 3" />
    //             <XAxis dataKey="date" />
    //             <YAxis />
    //             <Tooltip content={<DummyTooltip />} />
    //             <Line type="monotone" dataKey="total_price" stroke="#8884d8" dot={false} />
    //           </LineChart>
    //         </ResponsiveContainer>
    //       ) : ( // Display message if there are no transactions
    //         <p>No transactions available</p>
    //       )}
    //     </div>
    //   );
    // };


  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
  <label htmlFor="stockSelect" style={{ marginRight: '10px', fontWeight: 'bold' }}>Select Stock:</label>
  <select id="stockSelect" onChange={(e) => setStockId(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
    <option value="">Select a stock</option>
    {stocks.map(stock => (
      <option key={stock.id} value={stock.id}>{stock.stock_name}</option>
    ))}
  </select>
</div>
<br />
<div style={{ marginBottom: '20px' }}>
  <label htmlFor="startDate" style={{ marginRight: '10px', fontWeight: 'bold' }}>Start Date:</label>
  <input type="date" id="startDate" onChange={(e) => setStartDate(e.target.value)} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
</div>
<br />
<div style={{ marginBottom: '20px' }}>
  <label htmlFor="endDate" style={{ marginRight: '10px', fontWeight: 'bold' }}>End Date:</label>
  <input type="date" id="endDate" onChange={(e) => setEndDate(e.target.value)} min={startDate} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
</div>
      <br />
      {validationError && (
        <div style={{ color: 'red' }}>
          {validationError}
        </div>
      )}
      {/* {profit !== null && (
        <div>
          <strong>Profit: ₹{profit}</strong>
          
        </div>
      )} */}
       {profit !== null && (
      <div>
        {profit > 0 ? (
          <strong>Profit: ₹{profit}</strong>
        ) : (
          <strong>Loss: ₹{loss}</strong>
        )}
      </div>
    )}
      <br />
      <h1 align="center">Report of Transactions</h1>
      <ResponsiveContainer width="100%" height={400}>
       
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" type="category" />
          <YAxis label={{ value: 'Quantity', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="buyQuantity" stroke="green" name="Buy" />
          <Line type="monotone" dataKey="sellQuantity" stroke="red" name="Sell" />
        </LineChart>
      </ResponsiveContainer>
      {/* {renderchart()} */}
      <Fulltransactionschart stockId={stockId} />
    </div>
    
  );

  
  
};

export default ApexBrushChart;
