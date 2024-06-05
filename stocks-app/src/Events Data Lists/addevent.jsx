import { IconButton, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { db } from "../firebase.config";
import { collection, getDocs,addDoc } from "firebase/firestore";
import InputAdornment from '@mui/material/InputAdornment';
import Swal from "sweetalert2";
import { useAppStore } from "../appStore";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Addevent({ closeEvent }) {
    const [stockNames, setStockNames] = useState([]);
    const [selectedStock, setSelectedStock] = useState("");
   
    const [event_description, setQuantity] = useState();
    const setRows = useAppStore((state) => state.setRows);
    const empCollectionRef = collection(db, "events");
    const [selectedStockId, setSelectedStockId] = useState("");
    const [error, setError] = useState('');
    const auth = getAuth();
    let currentUser;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user.uid;
      }
    });

  
    useEffect(() => {
      // Fetch stock names when the component mounts
      fetchStockNames();
    }, []);
  
    const handleStockChange = async (event) => {
        const selectedStockName = event.target.value;
      
        // Fetch the stock_id based on the selected stock name
        const stockId = await fetchStockId(selectedStockName);
      
        setSelectedStock(selectedStockName);
        setSelectedStockId(stockId);
      };
      
      const fetchStockId = async (stockName) => {
        try {
          const stocksCollectionRef = collection(db, "stocks");
          const stocksSnapshot = await getDocs(stocksCollectionRef);
      
          for (const stockDoc of stocksSnapshot.docs) {
            const data = stockDoc.data();
            if (data.stock_name === stockName) {
              return stockDoc.id;
            }
          }
      
          console.error("No stock found with the name:", stockName);
          return "";
        } catch (error) {
          console.error("Error fetching stock ID:", error);
          return "";
        }
      };
       
      

      


  
    const handleQuantityChange = (event) => {
      setQuantity(event.target.value);
    };
  
   
    const createUser = async () => {
          // Validate input data
  if (!selectedStockId || !event_description) {
    // Display an error message if any of the required fields are empty
    // alert("Please enter all data to submit.");
    setError("Please enter all data to submit.");
    return;
  }

      const neweventId = uuidv4();
      const currentDate = new Date();
      
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');
    
      const formattedDate = `${year}-${month}-${day}`;
        await addDoc(empCollectionRef, {
          userId: currentUser,
          stock_id: selectedStockId,
          event_description: event_description,
          date: formattedDate,
          event_id: neweventId,
        });
        getUsers();
        window.location.reload();
        
      };
      

// const getUsers = async () => {
//     const data = await getDocs(empCollectionRef);
//     setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//   };
const getUsers = async () => {
    try {
      const data = await getDocs(empCollectionRef);
      const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
      // Fetch stock names for each transaction
      const updatedRows = await Promise.all(transactions.map(async (transaction) => {
        try {
          const stockName = await fetchStockNames(transaction.stock_id);
          return {
            ...transaction,
            stock_name: stockName,
          };
        } catch (error) {
          console.error("Error fetching stock name:", error);
          return transaction; // Return the original transaction in case of an error
        }
      }));
  
      setRows(updatedRows);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };
  

  const fetchStockNames = async () => {
    try {
      const stocksCollectionRef = collection(db, "stocks");
      const stocksSnapshot = await getDocs(stocksCollectionRef);
      const stocksData = stocksSnapshot.docs.map((doc) => doc.data().stock_name);
      setStockNames(stocksData);
    } catch (error) {
      console.error("Error fetching stock names:", error);
    }
  };
  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center">
        Add Event
      </Typography>
      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
<br/>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            id="outlined-basic"
            select
            label="Stockname"
            value={selectedStock}
            onChange={handleStockChange}
            variant="outlined"
            sx={{ minWidth: "100%" }}
          >
            {stockNames.map((stockName) => (
              <MenuItem key={stockName} value={stockName}>
                {stockName}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
   
        <Grid item xs={12}>
          
        <TextField
        
        
  id="outlined-basic"
  type="text"
  label="Event description"
  value={event_description}
  onChange={handleQuantityChange}
 
  variant="outlined"
  sx={{ minWidth: "100%" }}
/>    </Grid> 


{error && <Typography color="error" variant="subtitle2">{error}</Typography>}
        
      </Grid>
      <Grid item xs={12}>
      <br/>
        <Typography variant="h5" align="center">
          <Button variant="contained" onClick={createUser}>
            Submit
          </Button>
        </Typography>
      </Grid>
    </>
  );
}
