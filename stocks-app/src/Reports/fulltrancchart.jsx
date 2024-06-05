import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../UserContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns'; // Import the format function from date-fns



const DummyTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // console.log(payload);
    const { totalQuantityBought, totalQuantitySold } = payload[0].payload;
    const profitLossPercentage = payload[0].payload.profit_loss_percentage; // Extract profit_loss_percentage from payload
    

     // Determine the color based on the sign of the profit loss percentage
     const color = profitLossPercentage >= 0 ? 'green' : 'red';

    return (
      <div style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
        <p>Date: {label}</p>
        <p>Total Quantity Bought: {totalQuantityBought}</p>
        <p>Total Quantity Sold: {totalQuantitySold}</p>
        <p style={{ color: color }}>Profit Loss Percentage: {profitLossPercentage}</p>
        
      </div>
    );
  }
  return null;
};
  
const Fulltransactionschart = ({stockId }) => {
    const [stocks, setStocks] = useState([]);
    // const [stockId, setStockId] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [transactions, setTransactions] = useState([]);
    
    const [fulltransactions, setfullTransactions] = useState([]);
    const [profit, setProfit] = useState([]);
    const [validationError, setValidationError] = useState(null);
    const { userId } = useUser();
    const [futurePredictions, setFuturePredictions] = useState([]);

  const [isLoading, setIsLoading] = useState(true); // State to manage loading state
  
  
   
  
  useEffect(() => {
    if (stockId) {
      // Validate dates
      if (new Date(startDate) > new Date(endDate)) {
        setValidationError('Error, Please correct the date given.');
        setProfit(null); // Clear profit
        return;
      } else {
        setValidationError(null); // Clear validation error
      }
  
      // Fetch profit and transactions simultaneously
      Promise.all([
        axios.get(`http://127.0.0.1:5000/getprofitperdayreport?stock_id=${stockId}`, {
          headers: {
            Authorization: `${userId}`, // Include the user ID in the headers
          },
        }),
        axios.get(`http://127.0.0.1:5000/fullstockstransactionsreport?stock_id=${stockId}`, {
          headers: {
            Authorization: `${userId}`, // Include the user ID in the headers
          },
        })
      ])
      .then(([profitResponse, transactionsResponse]) => {
        const profitData = profitResponse.data;
        const transactionsData = transactionsResponse.data;
  
        console.log("Profit array:", profitData);
        console.log("Transactions:", transactionsData);
  
        // Aggregate transactions
        const aggregatedTransactions = aggregateTransactions(transactionsData.transactions);
  
        // Update transactions with profit_loss_percentage after profit array is populated
        const updatedTransactions = aggregatedTransactions.map(transaction => {
          const correspondingProfit = Array.isArray(profitData.profit) ? profitData.profit.find(profitEntry => profitEntry.date === transaction.date) : null;
          return {
            ...transaction,
            profit_loss_percentage: correspondingProfit ? correspondingProfit.profit_loss_percentage : null
          };
        });
  
        setTransactions(updatedTransactions); // Update transactions including profit_loss_percentage
        console.log("Final:", updatedTransactions);
        setIsLoading(false); // Set loading state to false after data is fetched
      })
      .catch(error => {
        // Clear chart data and set error message if there's an error
        setTransactions([]);
        setIsLoading(false); // Set loading state to false if there's an error
        console.error('Error fetching data:', error);
      });
    }
  }, [stockId, userId, startDate, endDate]);
  

  
     const aggregateTransactions = (data) => {
      const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
      const aggregatedData = {};
      sortedData.forEach(transaction => {
        const date = format(new Date(transaction.date), 'yyyy-MM-dd');
        if (!aggregatedData[date]) {
          aggregatedData[date] = { 
            date, 
            total_price: 0, 
            quantity: 0, 
            totalQuantityBought: 0, 
            totalQuantitySold: 0, 
            transaction_type: {} ,
            
          };
        }
        
        if (transaction.transaction_type === "BUY") {
          // Add the total cost of BUY transactions to total_price
          aggregatedData[date].total_price += transaction.total_price;
          
        } 
        aggregatedData[date].quantity += transaction.quantity; // Add quantity to total_quantity
        // Increment the count for each transaction type
        aggregatedData[date].transaction_type[transaction.transaction_type] = (aggregatedData[date].transaction_type[transaction.transaction_type] || 0) ;
        // Calculate totalQuantityBought and totalQuantitySold
        if (transaction.transaction_type === "BUY") {
          aggregatedData[date].totalQuantityBought += transaction.quantity;
        } else if (transaction.transaction_type === "SELL") {
          aggregatedData[date].totalQuantitySold += transaction.quantity;
        }
      });
      return Object.values(aggregatedData);
    };
    
   
  
  
  
  
  
    return (
      <div>
        <h1 align="center">Transactions Chart</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : transactions.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={transactions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Price', angle: -90, position: 'insideLeft' }} />
                <Tooltip content={<DummyTooltip transactions={transactions} />} />
                <Line type="monotone" dataKey="total_price" stroke="#8884d8" dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p style={{ textAlign: 'center' }}>The line represents the aggregated buy and sell transactions of the selected stock</p>
          </>
        ) : (
          <p>No transactions available</p>
        )}
      </div>
    );
  };

export default Fulltransactionschart;
  