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
import InputBase from '@mui/material/InputBase';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

export default function Adddeposit({ closeEvent,value, ...props  }) {
  
    const [paymentMethod, setPaymentMethod] = useState("Card");
    const [mm_yy, setmmyy] = useState();
    const [cvv, setcvv] = useState();
    const [phno, setphno] = useState();
    const [fname, setfname] = useState();
    const [lname, setlname] = useState();
    const [event_description, setQuantity] = useState();
    const setRows = useAppStore((state) => state.setRows);
    const empCollectionRef = collection(db, "deposits");
    const [selectedStockId, setSelectedStockId] = useState("");
    const [error, setError] = useState('');
    const [totalprice, setTotalPrice] = useState();
    const auth = getAuth();
    let currentUser;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user.uid;
      }
    });

    

  
    // useEffect(() => {
    //   // Fetch stock names when the component mounts
    //   fetchStockNames();
    // }, []);

    const handleTotalPriceChange = (event) => {
        setTotalPrice(event.target.value);
      };

      const handleQuantityChange = (event) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    const formattedValue = value.replace(/(\d{4})/g, '$1-').slice(0, 19); // Add hyphen after every 4 characters
        
    setQuantity(formattedValue);
      };
    
      const handlemmyyChange = (event) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        const formattedVvalue = value.replace(/(\d{2})/g, '$1/').slice(0, 5); // Add hyphen after every 4 characters
        setmmyy(formattedVvalue);
      };

      const handlecvvChange= (event) => {
        const value = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setcvv(value);
      };

      const handlephnoChange= (event) => {
        const valuue = event.target.value.replace(/\D/g, ''); // Remove non-numeric characters
        setphno(valuue);
      };
    
      const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };
  
    const handlefnameChange = (event) => {
        setfname(event.target.value);
    };
  
    const handlelnameChange = (event) => {
        setlname(event.target.value);
    };
  
   
      
        
    

   
      
 
       
      

      


  
 
   
    const createUser = async () => {
          // Validate input data
  if (  !totalprice || !paymentMethod || !fname || !lname) {
    // Display an error message if any of the required fields are empty
    // alert("Please enter all data to submit.");
    setError("Please enter all data to submit.");
    return;
  }

      const depositId = uuidv4();
      const currentDate = new Date();
      
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(currentDate.getDate()).padStart(2, '0');
    
      const formattedDate = `${year}-${month}-${day}`;


      let depositData = {
      userId: currentUser,
      Fund: totalprice,
      date: formattedDate,
      deposit_id: depositId,
      firstname: fname,
      lastname: lname,
      paymenttype: paymentMethod
    };

    if (paymentMethod === "Card") {
      depositData = {
        ...depositData,
        cardno: event_description,
        MM_YY: mm_yy,
        CVV: cvv
      };
    }

    if (paymentMethod === "UPI") {
      depositData = {
        ...depositData,
        phoneno: phno
      };
    }

    await addDoc(empCollectionRef, depositData);
    window.location.reload();
        
      };
      


  return (
    <>
      <Box sx={{ ...style, width: "200%", height: "70vh", overflow: "auto" }}>
      <Typography variant="h5" align="center">
        FUND YOUR ACCOUNT
      </Typography>

      <IconButton
        style={{ position: "absolute", top: "0", right: "0" }}
        onClick={closeEvent}
      >
        <CloseIcon />
      </IconButton>
<br/><br/>
      <Grid container spacing={2}>
        {/* <Grid item xs={12}>
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
    */}
    



<Grid container spacing={3} alignItems="center">

<Grid item xs={12}>
      <TextField
  id="outlined-basic"
  type="text"
  label="Fund"
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

<Grid item xs={12}>
                        <TextField
                            id="outlined-basic"
                            select
                            label="Payment Method"
                            value={paymentMethod}
                            onChange={handlePaymentMethodChange}
                            variant="outlined"
                            fullWidth
                        >
                            <MenuItem value="Card">Card</MenuItem>
                            <MenuItem value="UPI">UPI</MenuItem>
                        </TextField>
                    </Grid>

                    {paymentMethod === "Card" && (
                        <Grid item xs={6} md={8}>
                            <TextField
                                id="outlined-basic"
                                type="text"
                                label="Credit/Debit Card Number"
                                value={event_description}
                                onChange={handleQuantityChange}
                                variant="outlined"
                                fullWidth
                                inputProps={{
                                    pattern: "[0-9]*", // Only allow numbers
                                    maxLength: 19, // Limit maximum length to 16 characters
                                }}
                            />
                        </Grid>
                        
                    )}

    {/* <Grid item xs={6} md={8}>
  <TextField
    id="outlined-basic"
    type="text"
    label="Credit/Debit Card Number"
    value={event_description}
    onChange={handleQuantityChange}
    variant="outlined"
    fullWidth
    inputProps={{
      pattern: "[0-9]*", // Only allow numbers
      maxLength: 19, // Limit maximum length to 16 characters
    }}
  />


</Grid> */}
            {paymentMethod === "Card" && (
                    <Grid item xs={3} md={2}>
                        <TextField
                        id="outlined-basic"
                        type="text"
                        label="MM/YY"
                        value={mm_yy}
                        onChange={handlemmyyChange}
                        variant="outlined"
                        fullWidth
                        inputProps={{
                            pattern: "[0-9]*", // Only allow numbers
                            maxLength: 5, // Limit maximum length to 16 characters
                        }}
                        />

                    </Grid>
            )}
        {paymentMethod === "Card" && (
                    <Grid item xs={3} md={2}>
                        <TextField
                        id="outlined-basic"
                        type="text"
                        label="CVV"
                        value={cvv}
                        onChange={handlecvvChange}
                        variant="outlined"
                        fullWidth
                        inputProps={{
                            pattern: "[0-9]*", // Only allow numbers
                            maxLength: 3, // Limit maximum length to 16 characters
                        }}
                        />
                    </Grid>
        )}

{paymentMethod === "UPI" && (
                        <Grid item  xs={6} md={8}>
                            <TextField
                                id="outlined-basic"
                                type="text"
                                label="Phone Number"
                                value={phno}
                                onChange={handlephnoChange}
                                fullWidth
                        inputProps={{
                            pattern: "[0-9]*", // Only allow numbers
                            maxLength: 10, // Limit maximum length to 16 characters
                        }}
                                />
                                </Grid>
)}


      <Grid item xs={6} md={6}>
          <TextField id="outlined-basic" value={fname} onChange={handlefnameChange} label="First Name" variant="outlined"  />
          {/* value={} onChange={handlestocknameChange}*/}
          </Grid>

          <Grid item xs={6} md={4}>
          <TextField id="outlined-basic" value={lname} onChange={handlelnameChange} label="Last Name" variant="outlined"  />
          {/* value={} onChange={handlestocknameChange}*/}
          </Grid>
          

          
    </Grid>





{error && <Typography color="error" variant="subtitle2">{error}</Typography>}
        
      </Grid>
      <Grid item xs={12}>
      <br/><br/><br/>
        <Typography variant="h5" align="center">
          <Button variant="contained" onClick={createUser}>
            Deposit
          </Button>
        </Typography>
      </Grid>
      </Box>
    </>
  );
                    }
