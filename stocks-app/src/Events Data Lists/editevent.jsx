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
 
export default function Editeventform({fid, closeEvent})
{
    const[Eventdescription, Seteventdescription] = useState("");
    
    const [error, setError] = useState('');
    const setRows = useAppStore((state) => state.setRows);
    const empCollectionRef = collection(db,"events");

    useEffect(() => {
    console.log("FID:" + fid.id);
 
    Seteventdescription(fid.event_description);
    },[]);

const handleeventdescriptionChange = (event) => {
    Seteventdescription(event.target.value);
};



    const updateUser = async()=> {
        if (!Eventdescription) {
            // Display an error message if any of the required fields are empty
            // alert("Please enter all data to submit.");
            setError("Please enter all data to submit.");
            return;
          }
    const userDoc = doc(db,"events",fid.id);
    const newFields = {
        event_description:Eventdescription,
       
    };
    await updateDoc(userDoc,newFields);
    getUsers();
    closeEvent();
    
    // Swal.fire("Success!","Your Stock has been updated.","success");
    window.location.reload();
    };

    
  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


    return(
        <>
        <Box sx={{m:2}}/>
        <Typography variant="h5" align="center">
            Edit Event
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
          <TextField id="outlined-basic" label="Event Discription" variant="outlined" value={Eventdescription} onChange={handleeventdescriptionChange} sx={{ minWidth: "100%" }}/>

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