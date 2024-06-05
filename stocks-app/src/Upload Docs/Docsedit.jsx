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
import TableCell from '@mui/material/TableCell';
import { v4 } from 'uuid';
import TableRow from '@mui/material/TableRow';
import { storage } from "../firebase.config";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
} from "firebase/storage";

export default function Docsediting({fid, closeEvent}) {
    const [Stockname, Setstockname] = useState("");
    const [selectedStockId, setSelectedStockId] = useState("");
    const [date, Setdate] = useState("");
    const [file, Setfile] = useState("");
    const [error, setError] = useState('');
    const setRows = useAppStore((state) => state.setRows);
    const empCollectionRef = collection(db,"documents");

    useEffect(() => {
        Setstockname(fid.stock_name);
        Setfile(fid.file_url);
        fetchStockId(fid.stock_name); // Fetch stock ID when the component mounts
    }, [fid]);

    const fetchStockId = async (stockName) => {
        try {
            const stocksCollectionRef = collection(db, "stocks");
            const querySnapshot = await getDocs(stocksCollectionRef);
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.stock_name === stockName) {
                    setSelectedStockId(doc.id);
                }
            });
        } catch (error) {
            console.error("Error fetching stock ID:", error);
        }
    };

    const handlestocknameChange = (event) => {
        Setstockname(event.target.value);
        fetchStockId(event.target.value); // Fetch stock ID when stock name changes
    };

    const handlefileChange = (event) => {
        Setfile(event.target.files[0]);
    };

    const updateUser = async () => {
        if (!file) {
            setError("Please select a file to upload.");
            return;
        }

        try {
            const storageRef = ref(storage, `docs/${file.name+v4()}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;

             
            const userDoc = doc(db,"documents",fid.id);
            const data = {
                stock_id: selectedStockId,
                date: formattedDate,
                file_url: downloadURL,
                file_name: file.name,
            };
            await updateDoc(userDoc,data);

            const response = await fetch('http://127.0.0.1:5000/upload_document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to upload document to backend.');
            }

            getUsers();
            closeEvent();
            window.location.reload();
            // Swal.fire("Success!","Your Document has been updated.","success")
        } catch (error) {
            console.error('Error uploading document:', error);
            // Handle error
        }
    };

    const getUsers = async () => {
        try {
            const data = await getDocs(empCollectionRef);
            setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    return (
        <>
            <Box sx={{m:2}}/>
            <Typography variant="h5" align="center">
                Edit Document
            </Typography>
            <IconButton style={{position:"absolute", top:"0",right:"0"}} onClick={closeEvent}>
                <CloseIcon/>
            </IconButton>
            <Box height={20}/>
            <Grid container spacing={2} >
                <Grid item xs={12}>
                    <TextField id="outlined-basic" label="Stock Name" variant="outlined" disabled={true} value={Stockname} onChange={handlestocknameChange} sx={{ minWidth: "100%" }}/>
                </Grid>
                <Grid item xs={12}>
                    <input type="file" onChange={handlefileChange} />
                </Grid>
                {error && <Typography color="error" variant="subtitle2">{error}</Typography>}
                <Grid item xs={12}>
                    <Typography variant="h5" align="center">
                        <Button variant="contained" onClick={updateUser}>Submit</Button>
                    </Typography>
                </Grid>
            </Grid>
            <Box sx={{m:4}}/>
        </>
    );
}
