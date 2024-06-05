import { IconButton, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";

import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { db } from "../firebase.config";
import { collection, getDocs, addDoc, query, where, getDoc, doc } from "firebase/firestore";
import InputAdornment from '@mui/material/InputAdornment';
import Swal from "sweetalert2";
import { useAppStore } from "../appStore";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { v4 as uuidv4 } from 'uuid';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Addtransaction({ closeEvent }) {
    const [stockNames, setStockNames] = useState([]);
    const [selectedStock, setSelectedStock] = useState("");
    const [totalprice, setTotalPrice] = useState();
    const [transactiontype, setTransactionType] = useState("");
    const [quantity, setQuantity] = useState();
    const setRows = useAppStore((state) => state.setRows);
    const empCollectionRef = collection(db, "transactions");
    const [selectedStockId, setSelectedStockId] = useState("");
    const [totalCost, setTotalCost] = useState(0);  // New state variable
    const [errorMessage, setErrorMessage] = useState(""); // State for error message
    const [depositedFunds, setDepositedFunds] = useState(0);
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

    useEffect(() => {
      const cost = Number(totalprice) * Number(quantity);
      setTotalCost(cost);
  }, [totalprice, quantity]);

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
       
      

      
  
    // const handleStockChange = (event) => {
    //   setSelectedStock(event.target.value);
    // };
  
    const handleTotalPriceChange = (event) => {
      setTotalPrice(event.target.value);
    };
  
    const handleTransactionTypeChange = (event) => {
      setTransactionType(event.target.value);
    };
  
    const handleQuantityChange = (event) => {
      setQuantity(event.target.value);
    };
  
    // const createUser = async () => {
    //   const newTransactionId = uuidv4();
    //   await addDoc(empCollectionRef, {
    //     stock_name: selectedStock,
    //     quantity: Number(quantity),
    //     total_price: Number(totalprice),
    //     transaction_type: transactiontype,
    //     date: String(new Date()),
    //     transaction_id: newTransactionId,
    //   });
    //   getUsers();
    //   closeEvent();
    //   Swal.fire("Submitted!", "The Transaction is Successful!", "success");
    // };
    const createUser = async () => {
      const newTransactionId = uuidv4();
      const currentDate = new Date();
      
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');
    
      const formattedDate = `${year}-${month}-${day}`;

      if (transactiontype === "SELL") {
        const buyTransactionRef = query(empCollectionRef, where("userId", "==", currentUser), where("stock_id", "==", selectedStockId), where("transaction_type", "==", "BUY"));
        const buyTransactionSnapshot = await getDocs(buyTransactionRef);

        if (buyTransactionSnapshot.empty) {
            // Set error message if no "BUY" transaction found
            setErrorMessage("You must buy this stock before selling it.");
            return;
        } else {
            // Clear error message if "BUY" transaction found
            setErrorMessage("");
        }
    }

      // If the transaction type is "BUY", add a corresponding entry to the deposits collection
      if (transactiontype === "BUY") {
        const totalCost = Number(totalprice) * Number(quantity);
        const depositsCollectionRef = collection(db, "deposits");

        const q = query(collection(db, 'deposits'), where('userId', '==', currentUser));
        const querySnapshot = await getDocs(q);
        let totalFunds = 0;
        querySnapshot.forEach((doc) => {
          totalFunds += parseFloat(doc.data().Fund);
        });
        setDepositedFunds(totalFunds);
        
        if (totalFunds < totalCost) {
          // Set error message if available funds are insufficient
          setErrorMessage("Insufficient funds. Please add more funds to buy.");
          return;
      }
  

    

        await addDoc(empCollectionRef, {
          userId: currentUser,
          stock_id: selectedStockId,
        //   stock_name: selectedStock,
          quantity: Number(quantity),
          total_price: Number(totalprice),
          transaction_type: transactiontype,
          date: formattedDate,
          transaction_id: newTransactionId,
        });

       
         
          
          await addDoc(depositsCollectionRef, {
              userId: currentUser,
              Fund: -totalCost,
              date: formattedDate,
              transaction_id: newTransactionId
          });
      }
       
     
        // Swal.fire("Submitted!", "The Transaction is Successful!", "success");
        getUsers();
        window.location.reload();
        
        // Swal.fire("Submitted!", "The Transaction is Successful!", "success")
        // closeEvent()
        // .then((result) => {
        //     if (result.isConfirmed) {
        //         handleClose();
        //         getUsers();
        //         // closeEvent();
             
              
             
        //     }
        //     window.location.reload(); // Reload the browser    
        // });

        
      };
      

    const transactionTypes = [
      {
        value: "BUY",
        label: "Buy",
      },
      {
        value: "SELL",
        label: "Sell",
      },
    ];
  
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
        Add Transaction
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
            select
            label="Transaction Type"
            value={transactiontype}
            onChange={handleTransactionTypeChange}
            variant="outlined"
            sx={{ minWidth: "100%" }}
          >
            {transactionTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
           
          </TextField>
          
        </Grid>

        {/* <Grid item xs={12}>
  <TextField
    id="outlined-basic"
    type="text"
    label="Quantity"
    value={quantity}
    onChange={handleQuantityChange}
    variant="outlined"
    inputProps={{
      inputMode: "numeric", // Set input mode to numeric
      pattern: "[0-9]*", // Only allow numbers
    }}
    sx={{ minWidth: "100%" }}
  />
</Grid> */}

<Grid item xs={12}>
      <TextField
  id="outlined-basic"
  type="text"
  label="Quantity"
  value={quantity}
 
  onChange={handleQuantityChange}
  onInput={(e) => {
    // Allow only numeric characters and a dot
    const sanitizedValue = e.target.value.replace(/[^0-9.]/g, "");
    e.target.value = sanitizedValue;
    setQuantity(sanitizedValue); // Update state with the sanitized value
  }}
  variant="outlined"
  sx={{ minWidth: "100%" }}
/>
</Grid>

<Grid item xs={12}>
      <TextField
  id="outlined-basic"
  type="text"
  label="Price"
  value={totalprice}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <CurrencyRupeeIcon />
      </InputAdornment>
    ),
  }}
  onChange={handleTotalPriceChange}
  onInput={(e) => {
    // Allow only numeric characters and a dot
    const sanitizedValue = e.target.value.replace(/[^0-9.]/g, "");
    e.target.value = sanitizedValue;
    setTotalPrice(sanitizedValue); // Update state with the sanitized value
  }}
  variant="outlined"
  sx={{ minWidth: "100%" }}
/>
</Grid>
{totalCost > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">
                            The Total Price will be ₹{totalCost}
                        </Typography>
                    </Grid>
                )}
 
        
      </Grid>
      {errorMessage && (
                <Typography variant="body1" align="center" color="error">
                    {errorMessage}
                </Typography>
            )}
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
