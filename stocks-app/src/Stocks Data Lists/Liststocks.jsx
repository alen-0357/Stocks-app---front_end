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
import Addform from './Addstocks';
import Editform from './Editstocks';
import axios from 'axios';
import { useAppStore } from "../appStore";
import { useUser } from '../UserContext';
import "../Dash.css"
import StockPriceChart from './viewchart';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';





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



  
export default function Stockslist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);
  const empCollectionRef = collection(db, "stocks");

  const [docs, setdocs] = useState("");
  const [open, setOpen] = useState(false);
  const [formid, setFormid] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const [editopen, setEditOpen] = useState(false);

  const { userId } = useUser();
  const [eventDescriptions, setEventDescriptions] = useState([]); // State to store event descriptions
  const [showEventModal, setShowEventModal] = useState(false); // State to control the visibility of the event modal
  const [selectedStockId, setSelectedStockId] = useState(null); // New state to track the selected stock ID
  const [currentDate, setCurrentDate] = useState(new Date());

  const [showChartModal, setShowChartModal] = useState(false);
  const [selectedStockName, setSelectedStockName] = useState(null);

  const [documentButtonData, setDocumentButtonData] = useState({});
  const navigate = useNavigate();

  const handleNavigate = (stockId) => {
    navigate(`/about_stocks/${stockId}`);
  };
 
  const handleViewPrices = (stockName) => {
    setSelectedStockName(stockName);
    // console.log(stockName);
    setShowChartModal(true);
  };

  const handleCloseChartModal = () => {
    setShowChartModal(false);
    setSelectedStockName(null);
  };

  



  useEffect(() => {
    setCurrentDate(new Date());
    console.log(currentDate);
    getUsers();
  
  }, []);

  const handleEventButtonClick = async (fid) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/getspecificevents?stock_id=${fid}`, {
        headers: { Authorization: userId },
      });

      setEventDescriptions(response.data.events);
      setSelectedStockId(fid);
      setShowEventModal(true);
    } catch (error) {
      console.error('Error fetching event descriptions:', error);
    }
  };

  const handleCloseEventModal = () => {
    setShowEventModal(false);
    setSelectedStockId(null);
    setEventDescriptions([]);
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
        setRows([]);
      getUsers();
    }
  };


  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

const editData = (id,stock_name,stock_ticker) => {
  const data = {
    id:id,
    stock_name: stock_name,
    stock_ticker: stock_ticker
  };
  setFormid(data);
  handleEditOpen();
};

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    const userDoc = doc(db, "stocks", id);
    await deleteDoc(userDoc);
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    getUsers();
    // window.location.reload();
  };

  useEffect(() => {
    // Function to fetch document data for each stock
    const fetchDocumentData = async () => {
      const stockDocuments = {}; // Object to store document data for each stock

      // Query the documents collection to get documents for each stock
      for (const stock of rows) {
        const q = query(
          collection(db, 'documents'),
          where('stock_id', '==', stock.id)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // If document exists for the stock, store its data
          const documentData = querySnapshot.docs[0].data();
          stockDocuments[stock.id] = documentData;
        }
      }

      // Set the document data state
      setDocumentButtonData(stockDocuments);
    };

    // Fetch document data when component mounts
    fetchDocumentData();
  }, [rows]); // Trigger effect when rows data changes

  // Function to handle document button click
  const handleViewDocument = async (stockId) => {
    try {
      const documentData = documentButtonData[stockId];
      if (!documentData) {
        console.error('Document data not found for stock ID:', stockId);
        return;
      }
  
      const documentURL = documentData.file_url; // Replace 'file_url' with your actual field name
      if (!documentURL) {
        console.error('Document URL not found in document data:', documentData);
        return;
      }
  
      // Open the document URL in a new tab
      window.open(documentURL, '_blank');
    } catch (error) {
      console.error('Error viewing document:', error);
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
            Stocks List
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
                <TextField {...params} size="small" label="Search Stocks" />
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
          <Addform closeEvent={handleClose}/>
        </Box>
      </Modal>
      <Modal
        open={editopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Editform closeEvent={handleEditClose} fid={formid}/>
        </Box>
      </Modal>
      
      <Modal
        open={showChartModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
      
        
      <Box sx={{ ...style, width: "90%", height: "97vh" }}>
  <StockPriceChart closeEvent={handleCloseChartModal} fid={formid} currentDate={currentDate} sx={{ width: "90%", height: "100%" }}/>
</Box>
      
      </Modal>


    </div>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
       
          </Stack>
          <Box height={10} />
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
             
                <TableCell
                  align="left"
                  style={{ minWidth: "100px" }}
                >
                Stock Name
                  {/* {column.label} */}
                </TableCell>
                <TableCell
                  align="left"
                  style={{ minWidth: "100px" }}
                >
                Stock Ticker
                  {/* {column.label} */}
                </TableCell>
               
               
               
                
                
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow key={row.id} hover role="checkbox" tabIndex={-1} >
                        
                        <TableCell>
                        <Button 
                  variant="outlined"
                  onClick={() => handleNavigate(row.id)}>
                            {row.stock_name}
                            </Button>
                        </TableCell>
                       
                        <TableCell >
                            {row.stock_ticker}
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
        

<Box sx={{ ...style, height: '500px', width: '500px', overflowY: 'auto', position: 'relative' }}>
  <Typography variant="h4" component="div" sx={{ position: 'sticky',  backgroundColor: '#fff', zIndex: 1, padding: '20px 0', marginBottom: '20px' }}>
    Event Descriptions:
  </Typography>
  <div style={{ position: 'sticky', top: '70px', zIndex: 0 }}> {/* Adjust top value to be greater than the height of the fixed header */}
    {eventDescriptions.length > 0 ? (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {eventDescriptions.map((event, index) => (
          <li key={index} style={{ marginBottom: '15px', borderLeft: '4px solid #3f51b5', paddingLeft: '15px' }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {event.date} - 
            </Typography>
            <Typography variant="body1">
              {event.event_description}
            </Typography>
          </li>
        ))}
      </ul>
    ) : (
      <Typography variant="body1" sx={{ color: '#757575' }}>
        No event descriptions available for the specified stock.
      </Typography>
    )}
  </div>
</Box>





      </Modal>
      
      
    </Paper>
  );
}