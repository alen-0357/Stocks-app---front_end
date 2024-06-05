import { IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close"
import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material";
import MenuItem from "@mui/material";
import Button from "@mui/material/Button";
import { db } from "../firebase.config"
import { collection, updateDoc ,doc, getDocs, get } from "firebase/firestore";
import Swal from "sweetalert2"; 
import { useAppStore } from "../appStore";
 
export default function Editform({fid, closeEvent})
{
    const[Stockname, Setstockname] = useState("");
    const[Stockticker, Setstockticker] = useState("");
    const [error, setError] = useState('');
    const setRows = useAppStore((state) => state.setRows);
    const empCollectionRef = collection(db,"stocks");

    useEffect(() => {
    console.log("FID:" + fid.id);
    Setstockname(fid.stock_name);
    Setstockticker(fid.stock_ticker);
    },[]);

const handlestocknameChange = (event) => {
    Setstockname(event.target.value);
};

const handlestocktickerChange = (event) => {
    Setstockticker(event.target.value);
};

    const updateUser = async()=> {
        if (!Stockname || !Stockticker) {
            // Display an error message if any of the required fields are empty
            // alert("Please enter all data to submit.");
            setError("Please enter all data to submit.");
            return;
          }
    const userDoc = doc(db,"stocks",fid.id);
    const newFields = {
        stock_name:Stockname,
        stock_ticker:Stockticker
    };
    await updateDoc(userDoc,newFields);
    getUsers();
    closeEvent();
    Swal.fire("Success!","Your Stock has been updated.","success")
    };

    
  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


    return(
        <>
        <Box sx={{m:2}}/>
        <Typography variant="h5" align="center">
            Edit Stock
        </Typography>
       <IconButton
       style={{position:"absolute", top:"0",right:"0"}}
        onClick={closeEvent}
         >
            <CloseIcon/>
         </IconButton>
         <Box height={20}/>
         <Grid container spacing={2}>
          <Grid item xs={12}>
          <TextField id="outlined-basic" label="Stock Name" variant="outlined" value={Stockname} onChange={handlestocknameChange} sx={{ minWidth: "100%" }}/>

          </Grid>
          <Grid item xs={12}>
          <TextField id="outlined-basic" label="Stock Ticker" variant="outlined" value={Stockticker} onChange={handlestocktickerChange} sx={{ minWidth: "100%" }}/>

          </Grid>

          {error && <Typography color="error" variant="subtitle2">{error}</Typography>}
          <Grid item xs={12}>
            <Typography variant="h5" align="center">
                <Button variant="contained" onClick={updateUser}>
                    Submit
                </Button>
            </Typography>
          </Grid>

         </Grid>
         <Box sx={{m:4}}/>
        </>
        
    )
}