import { IconButton, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    listAll,
    list,
  } from "firebase/storage";
import { db, storage } from "../firebase.config"; // you have storage initialized in firebase.config.js
import { collection, getDocs, addDoc } from "firebase/firestore";
import InputAdornment from '@mui/material/InputAdornment';
import Swal from "sweetalert2";
import { useAppStore } from "../appStore";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { v4 } from 'uuid';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function Adddocs({ closeEvent }) {
    const [stockNames, setStockNames] = useState([]);
    const [selectedStock, setSelectedStock] = useState("");
    // const [totalprice, setTotalPrice] = useState();
    // const [transactiontype, setTransactionType] = useState("");
    // const [quantity, setQuantity] = useState();

    const setRows = useAppStore((state) => state.setRows);
    const empCollectionRef = collection(db, "documents");
    const [selectedStockId, setSelectedStockId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null); // State to store selected file
    const rows = useAppStore((state) => state.rows);

    // const uploaddocs= () => {
    //     if (selectedFile == null) return;
    //     const docsRef = ref(storage, `docs/${selectedFile.name}`);
    //     uploadBytes(docsRef,selectedFile).then(() => {
    //         alert("Document Uploaded");
    //         getUsers();
    //         // window.location.reload();
    //     })
    // };
    // const uploaddocs = async () => {

    //     try {
    //         // Check if a file is selected
    //         if (!selectedFile) {
    //             console.error("No file selected.");
    //             alert("Please select a Document!");
    //             return;
    //         }
    //                     // Check if a file with the same stock name already exists
    //         const existingFiles = rows.filter((row) => row.stock_name === selectedStock);
    //         if (existingFiles.length > 0) {
    //             alert(`A file for ${selectedStock} already exists.`);
    //             return;
    //         }
    
    //         // Upload the file to Firebase Storage
    //         const storageRef = ref(storage, `docs/${selectedFile.name}`);
    //         await uploadBytes(storageRef, selectedFile);
    
    //         // Get the download URL of the uploaded file
    //         const downloadURL = await getDownloadURL(storageRef);
    
    //          const currentDate = new Date();
    //         const year = currentDate.getFullYear();
    //         const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    //         const day = String(currentDate.getDate()).padStart(2, '0');
    //         const formattedDate = `${year}-${month}-${day}`;
            
    //         await addDoc(collection(db, 'documents'), {
    //             stock_id: selectedStockId,
    //             date: formattedDate,
    //             file_url: downloadURL,
    //             // You can add more fields here if needed
    //         })

    //          // Add document information to 'uploaded_documents_record' collection
    //     await addDoc(collection(db, 'uploaded_documents_record'), {
    //         stock_id: selectedStockId,
    //         date: formattedDate,
    //         file_url: downloadURL,
    //         // You can add more fields here if needed
    //     });
    
    //         // Alert and refresh after successful upload
    //         alert("Document Uploaded");
    //         getUsers();
    //         window.location.reload();
    //     } catch (error) {
    //         console.error("Error uploading document:", error);
    //         // Handle error
    //     }
    // };
    const uploaddocs = async () => {
        try {
            // Check if a file is selected
            if (!selectedFile) {
                console.error("No file selected.");
                alert("Please select a Document!");
                return;
            }
    
            // Check if a file with the same stock name already exists
            const existingFiles = rows.filter((row) => row.stock_name === selectedStock);
            if (existingFiles.length > 0) {
                alert(`A file for ${selectedStock} already exists.`);
                return;
            }
    
            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `docs/${selectedFile.name+v4()}`);
            await uploadBytes(storageRef, selectedFile);
    
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(storageRef);
    
            // Prepare data to send to Firebase Firestore
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
            const day = String(currentDate.getDate()).padStart(2, '0');
            const formattedDate = `${year}-${month}-${day}`;
    
            const firestoreData = {
                stock_id: selectedStockId,
                date: formattedDate,
                file_url: downloadURL,
                file_name: selectedFile.name,
                // You can add more fields here if needed
            };
    
            // Add document to Firebase Firestore
            await addDoc(collection(db, 'documents'), firestoreData);
    
            // Prepare data to send to backend
            const backendData = {
                stock_id: selectedStockId,
                date: formattedDate,
                file_url: downloadURL,
                file_name: selectedFile.name,
                // You can add more fields here if needed
            };
    
            // Make a POST request to the backend to upload the document
            const response = await fetch('http://127.0.0.1:5000/upload_document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(backendData)
            });
    
            if (!response.ok) {
                throw new Error('Failed to upload document to backend.');
            }
    
            // Alert and refresh after successful upload
            alert("Document Uploaded");
            getUsers();
            window.location.reload();
        } catch (error) {
            console.error("Error uploading document:", error);
            // Handle error
        }
    };

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

    const handleFileChange = (event) => {
        // Set the selected file when the input changes
        setSelectedFile(event.target.files[0]);
    };

  
        // const createUser = async () => {
        //     // const newUploadId = uuidv4();
        //     const currentDate = new Date();
        
        //     const year = currentDate.getFullYear();
        //     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        //     const day = String(currentDate.getDate()).padStart(2, '0');
        
        //     const formattedDate = `${year}-${month}-${day}`;
        //     await addDoc(empCollectionRef, {
            
        //         stock_id: selectedStockId,
        //         date: formattedDate,

        //         // Upload_id: newUploadId,
        //     });

        //     getUsers();
        //     window.location.reload();
        // };

        /////////////////////////////////////////////////////////////////////////////////////////////////////////
        // const createUser = async () => {
        //     const currentDate = new Date();
        //     const year = currentDate.getFullYear();
        //     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        //     const day = String(currentDate.getDate()).padStart(2, '0');
        //     const formattedDate = `${year}-${month}-${day}`;
            
        //     try {
        //         // Upload the file to Firebase Storage
        //         const fileRef = storage.ref().child(selectedFile.name);
        //         await fileRef.put(selectedFile);
        //         const downloadURL = await fileRef.getDownloadURL();
                
        //         // Save the document data to Firestore
        //         await addDoc(empCollectionRef, {
        //             stock_id: selectedStockId,
        //             date: formattedDate,
        //             file_url: downloadURL, // Save the file URL along with other data
        //         });
        
        //         // Refresh the list of documents
        //         getUsers();
        //         window.location.reload();
        //     } catch (error) {
        //         console.error("Error creating user:", error);
        //         // Handle error
        //     }
        // };
        /////////////////////////////////////////////////////////////////////////////////////////////////
        // const createUser = async () => {
        //     const currentDate = new Date();
        //     const year = currentDate.getFullYear();
        //     const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        //     const day = String(currentDate.getDate()).padStart(2, '0');
        //     const formattedDate = `${year}-${month}-${day}`;
        
        //     try {
        //         // Ensure that necessary data is available
        //         if (!selectedStockId || !formattedDate || !selectedFile) {
        //             console.error("Missing necessary data.");
        //             return;
        //         }
        
        //         // Prepare data to send to the backend
        //         const dataToSend = {
        //             stock_id: selectedStockId,
        //             date: formattedDate,
        //             file: selectedFile // Assuming selectedFile is a File object
        //         };
        
        //         const formData = new FormData();
        //         formData.append('stock_id', dataToSend.stock_id);
        //         formData.append('date', dataToSend.date);
        //         formData.append('file', dataToSend.file);
        
        //         const response = await fetch('http://127.0.0.1:5000/upload_document', {
        //             method: 'POST',
        //             body: formData
        //         });
        
        //         if (response.ok) {
        //             console.log("Document uploaded successfully");
        //             // Refresh the list of documents
        //             getUsers();
        //             window.location.reload();
        //         } else {
        //             console.error("Failed to upload document:", response.statusText);
        //             // Handle error
        //         }
        //     } catch (error) {
        //         console.error("Error creating user:", error);
        //         // Handle error
        //     }
        // };
/////////////////////////////////////////

/////////////////////////////////////////


        // const handleFileUpload = async () => {
        //     try {
        //         // Ensure that storage is properly initialized
        //         if (!storage) {
        //             console.error("Firebase Storage is not initialized.");
        //             return;
        //         }
        
        //         // Upload the file to Firebase Storage
        //         const fileRef = storage.ref().child(selectedFile.name);
        //         await fileRef.put(selectedFile);
        //         const downloadURL = await fileRef.getDownloadURL();
        //         console.log("File uploaded successfully. Download URL:", downloadURL);
        
        //         // Save the document data to Firestore along with stock ID and date
        //         const currentDate = new Date();
        //         const year = currentDate.getFullYear();
        //         const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        //         const day = String(currentDate.getDate()).padStart(2, '0');
        //         const formattedDate = `${year}-${month}-${day}`;
        
        //         await addDoc(empCollectionRef, {
        //             stock_id: selectedStockId,
        //             date: formattedDate,
        //             file_url: downloadURL,
        //         });
        
        //         // Refresh the list of documents
        //         getUsers();
        //         window.location.reload();
        //     } catch (error) {
        //         console.error("Error uploading file:", error);
        //         // Handle error
        //     }
        // };


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
                Add Document
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
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </Grid>
            </Grid>
    
            <Grid item xs={12}>
                <br/>
                <Typography variant="h5" align="center">
                    <Button variant="contained" onClick={uploaddocs}>
                        Submit
                    </Button>
                </Typography>
            </Grid>
        </>
    );
}
