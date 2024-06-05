import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import { useState,useEffect } from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Modal from '@mui/material/Modal';
import { db } from "../firebase.config";
import Card from '@mui/material/Card';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Adddocs from './Docsupload';

import axios from 'axios';
import { useAppStore } from "../appStore";
import { useUser } from '../UserContext';
import "../Dash.css"

import Grid from '@mui/material/Grid';
import Docsediting from './Docsedit';
import { getStorage, ref, deleteObject } from "firebase/storage";






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



  
export default function Docslist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);
  const empCollectionRef = collection(db, "documents");
  const [open, setOpen] = useState(false);
  const [formid, setFormid] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const [editopen, setEditOpen] = useState(false);

  const { userId } = useUser();
  const [stockiddis, setStockiddis] = useState([]); // State to store event descriptions
  const [showEventModal, setShowEventModal] = useState(false); // State to control the visibility of the event modal
  const [selectedStockId, setSelectedStockId] = useState(null); // New state to track the selected stock ID

  const [currentDate, setCurrentDate] = useState(new Date());

  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedStockName, setSelectedStockName] = useState(null);

  const [pdfSummary, setPdfSummary] = useState([]);



 
  const handleCloseChartModal = () => {
    setShowChartModal(false);
    setSelectedStockName(null);
  };

  const fetchStockName = async (stockId) => {
    const stockDoc = await getDoc(doc(db, "stocks", stockId));
    return stockDoc.exists() ? stockDoc.data().stock_name : '';
  };

  


  useEffect(() => {
    setCurrentDate(new Date());
    console.log(currentDate);
    getUsers();
  }, []);


  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setSelectedStockId(null);
    setStockiddis([]);
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
        setRows([]);
      getUsers();
    }
  };
  const Docsedit = (id,stock_name) => {
    const data = {
      id:id,
      stock_name: stock_name,
      file: null,
      
    };
    setFormid(data);
    handleEditOpen();
  };
  

    const getUsers = async () => {
      const data = await getDocs(empCollectionRef);
      setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

      const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      // Fetch stock names for each transaction
      const updatedRows = await Promise.all(transactions.map(async (transaction) => {
        const stockName = await fetchStockName(transaction.stock_id);
  
        return {
          ...transaction,
          stock_name: stockName,
        };
      }));
  
      setRows(updatedRows);
    };
    
   
  



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };


//   const handlePreviousUploads = async (stockId) => {
//     try {
//         const prevUploadsQuery = query(collection(db, 'uploaded_documents'), where('stock_id', '==', stockId));
//         const prevUploadsSnapshot = await getDocs(prevUploadsQuery);
        
//         const prevUploads = prevUploadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//         // Here, we map through the documents and extract both the document ID and the data
        
//         console.log("Previous Uploads:", prevUploads); // Log the previous uploads
//         setSelectedStockId(stockId);
//         setStockiddis(prevUploads); // Set state with previous uploads
//         setShowEventModal(true); // Show the modal
//     } catch (error) {
//         console.error("Error fetching previous uploads:", error);
//     }
// };

const handlePreviousUploads = async (stockId) => {
  try {
    // Query the "uploaded_documents" collection for documents related to the current stockId
    const prevUploadsQuery = query(collection(db, 'uploaded_documents'), where('stock_id', '==', stockId));
    const prevUploadsSnapshot = await getDocs(prevUploadsQuery);
    
    // Map through the documents and extract both the document ID and the data
    const prevUploads = prevUploadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Filter out documents with the same file name as the currently displayed file
    const uniquePrevUploads = prevUploads.filter((doc) => {
      // Check if the current document's file name exists in the rows array
      const fileExists = rows.some(row => row.file_name === doc.file_name);
      return !fileExists;
    });

    console.log("Previous Uploads:", uniquePrevUploads); // Log the previous uploads
    setSelectedStockId(stockId);
    setStockiddis(uniquePrevUploads); // Set state with previous uploads
    setShowEventModal(true); // Show the modal
  // } 
  // catch (error) {
  //   console.error("Error fetching previous uploads:", error);
  // }
  
  // Send uniquePrevUploads data to the backend
 
  const response = await fetch('http://127.0.0.1:5000/read-pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ prevUploads: uniquePrevUploads })
  });

  if (!response.ok) {
    throw new Error('Failed to send data to backend');
  }

  // Optionally, you can handle the response from the backend here
  // const responseData = await response.json();
  // console.log('Response from backend:', responseData);
   // Extract pdfSummaries from the response
   const { pdfSummaries } = await response.json();
   setPdfSummary(pdfSummaries); // Set pdfSummaries state variable
} 
catch (error) {
  console.error("Error", error);
}
  
};

  const handleDeletePreviousUpload = async (uploadId) => {
    console.log("Upload ID:", uploadId);
    try {
        // Send the upload ID to the backend for deletion
        const response = await axios.post('http://127.0.0.1:5000/delete-upload', { upload_id: uploadId });
        if (response.data.success) {
            console.log("Document deleted successfully:", uploadId);
            handlePreviousUploads(selectedStockId);
        } else {
            console.error("Error deleting previous upload:", response.data.message);
        }
    } catch (error) {
        console.error("Error deleting previous upload:", error.message);
    }
};





  return (
     
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
             <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
          >
            Documents List
          </Typography>
          <Divider />
          <Box height={10} />
          <Stack direction="row" spacing={2} className="my-2 mb-2">
            &nbsp;&nbsp;<Autocomplete
              disablePortal
              id="combo-box-demo"
              options={rows}
              sx={{ width: 300 }}
              onChange={(e, v) => filterData(v)}
              getOptionLabel={(rows) => rows.stock_name || ""}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Search Documents" />
              )}
            />
    <div>
      
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Adddocs closeEvent={handleClose}/>
        </Box>
      </Modal>
    
      <Modal
        open={editopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Docsediting closeEvent={handleEditClose} fid={formid}/>
        </Box>
      </Modal>
   


    </div>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            <div className="btnStyle">
            <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleOpen} >
              Add
            </Button>
            </div>
          </Stack>
          <Box height={10} />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
        <TableHead>
  <TableRow>
    <TableCell align="left" style={{ minWidth: "100px" }}>
      Stock Name
    </TableCell>
    <TableCell align="left" style={{ minWidth: "100px" }}>
      Date
    </TableCell>
    <TableCell align="left" style={{ minWidth: "100px" }}>
      Documents
    </TableCell>
    <TableCell align="left" style={{ minWidth: "100px" }}>
      Actions
    </TableCell>
    <TableCell align="left" style={{ minWidth: "100px" }}>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Previous Uploads
    </TableCell>
  </TableRow>
</TableHead>
<TableBody>
  {rows
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((row) => {
      return (
        <TableRow key={row.id} hover role="checkbox" tabIndex={-1}>
          <TableCell align="left">
            {row.stock_name}
          </TableCell>
          <TableCell align="left">
            {row.date}
          </TableCell>
          <TableCell align="left">
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(row.file_url, "_blank")}
            >
              {row.file_name}
            </Button>
          </TableCell>
          <TableCell align="left">
            <Stack spacing={2} direction="row">
              <EditIcon
                style={{
                  fontSize: "20px",
                  color: "blue",
                  cursor: "pointer",
                }}
                className="cursor-pointer"
                onClick={() => {
                  Docsedit(row.id, row.stock_name,  row.file_url);
                }}
              />
            </Stack>
          </TableCell>
          <TableCell align="left">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          console.log("Clicked row id:", row.stock_id); // Log the row id
                          handlePreviousUploads(row.stock_id);
                        }}
                        
                      >
                        
                        Previous Uploads
                      </Button>
                    </TableCell>
        </TableRow>
      );
    })}
</TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
        
        
        <Modal
  open={showEventModal}
  onClose={handleCloseEventModal}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
<Box sx={{ ...style, width: "50%", height: "50vh", overflow: "auto" }}>
  <Typography variant="h5" component="div" gutterBottom>
    Previous Uploads
  </Typography>
  <Divider />
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell >Date</TableCell>
          <TableCell>File Name</TableCell>
          <TableCell>Summary</TableCell>
          <TableCell  align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      {/* Conditionally render TableBody based on the presence of previous uploads */}
      {stockiddis.length > 0 ? (
        <TableBody>
          {stockiddis.map((event, index) => (
            <TableRow key={event.id}>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.file_name}</TableCell>
              <TableCell>{pdfSummary[index]}</TableCell> {/* Display the pdfSummary using index */}
              <TableCell>
                <Stack direction="column" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => window.open(event.file_url, "_blank")}
                  >
                    Open PDF
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDeletePreviousUpload(event.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      ) : (
        <TableBody>
          <TableRow>
            <TableCell colSpan={3} align="center">
              No data available
            </TableCell>
          </TableRow>
        </TableBody>
      )}
    </Table>
  </TableContainer>
</Box>


</Modal>







      
    
    </Paper>
  );
}