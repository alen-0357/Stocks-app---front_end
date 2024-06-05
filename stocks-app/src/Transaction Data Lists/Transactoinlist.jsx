// import * as React from 'react';
// import Paper from '@mui/material/Paper';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TablePagination from '@mui/material/TablePagination';
// import TableRow from '@mui/material/TableRow';
// import { Divider } from '@mui/material';
// import Typography from '@mui/material/Typography';
// import { useState, useEffect } from 'react';
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
// import Stack from "@mui/material/Stack";
// import Modal from '@mui/material/Modal';
// import { useAppStore } from "../appStore";


// import { db } from "../firebase.config";
// import {
//   collection,
//   getDocs,
//   doc,
//   getDoc,
// } from "firebase/firestore";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import Swal from "sweetalert2";
// import TextField from "@mui/material/TextField";
// import Autocomplete from "@mui/material/Autocomplete";
// import Addtransaction from './Addtransaction';
// import { getAuth, onAuthStateChanged } from 'firebase/auth';
// import {   query, where } from "firebase/firestore";
// // import { useUser } from '../UserContext';


// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };
// export default function Transactionlist() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   // const [rows, setRows] = useState([]);
//   const empCollectionRef = collection(db, "transactions");
//   const [open, setOpen] = useState(false);
//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);
//   const setRows = useAppStore((state) => state.setRows);
//   const rows = useAppStore((state) => state.rows);
//   const auth = getAuth();


//   useEffect(() => {
//     //  window.location.reload();
//     getUsers();
   
//   }, []);

//   const fetchStockName = async (stockId) => {
//     const stockDoc = await getDoc(doc(db, "stocks", stockId));
//     return stockDoc.exists() ? stockDoc.data().stock_name : '';
//   };

//   // const getUsers = async () => {
//   //   const data = await getDocs(empCollectionRef);
//   //   const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

//   //   // Fetch stock names for each transaction
//   //   const updatedRows = await Promise.all(transactions.map(async (transaction) => {
//   //     const stockName = await fetchStockName(transaction.stock_id);

//   //     return {
//   //       ...transaction,
//   //       stock_name: stockName,
//   //     };
//   //   }));

//   //   setRows(updatedRows);
//   // };
//   const getUsers = async () => {
//     // Get the currently logged-in user
//     const user = auth.currentUser;
  
//     if (user) {
//       // User is signed in
//       const userId = user.uid;
  
//       // Fetch transactions based on the logged-in user's ID
//       const data = await getDocs(
//         query(empCollectionRef, where('userId', '==', userId))
//       );
//       const transactions = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  
//       // Fetch stock names for each transaction
//       const updatedRows = await Promise.all(transactions.map(async (transaction) => {
//         const stockName = await fetchStockName(transaction.stock_id);
  
//         return {
//           ...transaction,
//           stock_name: stockName,
//         };
//       }));
  
//       setRows(updatedRows);
//     } else {
//       // User is not signed in
//       // console.log('');
//     }
//   };


//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   const filterData = (v) => {
//     if (v) {
//       setRows([v]);
//     } else {
//       setRows([]);
//       getUsers();
//     }
//   };

//   return (
//     <>
//     <div>
//     {/* <Button >Open modal</Button> */}
//     <Modal
//       open={open}
//       onClose={handleClose} //This code controls if the text box needed to be closed when clicking anywhere or not
//       aria-labelledby="modal-modal-title"
//       aria-describedby="modal-modal-description"
//     >
//       <Box sx={style}>
//      <Addtransaction closeEvent={handleClose}/>
//       </Box>
//     </Modal>
//   </div>
//     <Paper sx={{ width: '100%', overflow: 'hidden' }}>
//       <Typography
//         gutterBottom
//         variant="h5"
//         component="div"
//         sx={{ padding: "20px" }}
//       >
//         Transaction List
//       </Typography>
//       <Divider />
      
//       <Box height={10} />
      
//           <Stack direction="row" spacing={2} className="my-2 mb-2">
//           &nbsp;&nbsp;&nbsp;
//             <Autocomplete
//               disablePortal
//               id="combo-box-demo"
//               options={rows}
//               sx={{ width: 300 }}
//               onChange={(e, v) => filterData(v)}
//               getOptionLabel={(rows) => rows.transaction_type || ""}
//               renderInput={(params) => (
//                 <TextField {...params} size="small" label="Search Transactions" />
//               )}
//             />
//             <Typography
//               variant="h6"
//               component="div"
//               sx={{ flexGrow: 1 }}
//             ></Typography>
//              <div className="btnStyle">
//             <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleOpen}>
//               Add
//             </Button>
//             </div>
//           </Stack>
//           <Box height={10} />

//       <TableContainer sx={{ maxHeight: 440 }}>
//         <Table stickyHeader aria-label="sticky table">
//           <TableHead>
//             <TableRow>
//               <TableCell align="left" style={{ minWidth: "100px"}}>
//                 Date
//               </TableCell>
//               <TableCell align="left" style={{ minWidth: "100px"}}>
//                 Transaction id
//               </TableCell>
//               <TableCell align="left" style={{ minWidth: "100px"}}>
//                 Stock Name
//               </TableCell>
//               <TableCell align="left" style={{ minWidth: "100px"}}>
//                 Quantity
//               </TableCell>
//               <TableCell align="left" style={{ minWidth: "100px"}}>
//                 Total Price
//               </TableCell>
//               <TableCell align="left" style={{ minWidth: "100px"}}>
//                 Transaction Type
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row) => (
//                 <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
//                   <TableCell align="left">{row.date}</TableCell>
//                   <TableCell align="left">{row.transaction_id}</TableCell>
//                   <TableCell align="left">{row.stock_name}</TableCell>
//                   <TableCell align="left">{row.quantity}</TableCell>
//                   <TableCell align="left">{row.total_price}</TableCell>
//                   <TableCell align="left">{row.transaction_type}</TableCell>
//                 </TableRow>
//               ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 15, 20]}
//         component="div"
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//     </>);
// }
import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Divider } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState, useEffect } from 'react';
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Modal from '@mui/material/Modal';
import { useAppStore } from "../appStore";

import { db } from "../firebase.config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Addtransaction from './Addtransaction';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {   query, where } from "firebase/firestore";
import { useUser } from '../UserContext';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

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

export default function Transactionlist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const empCollectionRef = collection(db, "transactions");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);
  const auth = getAuth();
  const { userId } = useUser(); // Get userId from the context
  const [searchType, setSearchType] = useState('transactionType'); // Default search type
  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  useEffect(() => {
    getUsers();
  }, [userId]); // Trigger the effect when userId changes

  const fetchStockName = async (stockId) => {
    const stockDoc = await getDoc(doc(db, "stocks", stockId));
    return stockDoc.exists() ? stockDoc.data().stock_name : '';
  };

  const getUsers = async () => {
    // Fetch transactions based on the logged-in user's ID (userId from the context)
    const data = await getDocs(
      query(empCollectionRef, where('userId', '==', userId))
      
    );
    
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


// Create sets to store unique transaction types and stock names
const uniqueTransactionTypes = new Set(rows.map(row => row.transaction_type));
const uniqueStockNames = new Set(rows.map(row => row.stock_name));
  // const filterData = (selectedTransactionType) => {
  //   if (selectedTransactionType) {
  //     // Filter rows based on the selected transaction type
  //     const filteredRows = rows.filter(row => row.transaction_type === selectedTransactionType);
  //     setRows(filteredRows);
  //   } else {
  //     // If no transaction type is selected, reset the rows to the original data
  //     getUsers();
  //   }
  // };
 
const filterData = (searchValue) => {
  if (searchValue) {
    // Filter rows based on the selected search type (transaction type or stock name)
    const filteredRows = rows.filter(row => {
      if (searchType === 'transactionType') {
        return row.transaction_type.toUpperCase().includes(searchValue.toUpperCase());
      } else {
        return row.stock_name.toUpperCase().includes(searchValue.toUpperCase());
      }
    });
    setRows(filteredRows);
  } else {
    // If no search value is provided, reset the rows to the original data
    getUsers();
  }
};

  return (
    <>
      <div>
 
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Addtransaction closeEvent={handleClose} />
          </Box>
        </Modal>
      </div>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography
          gutterBottom
          variant="h5"
          component="div"
          sx={{ padding: "20px" }}
        >
          Transaction List
        </Typography>
        <Divider />

        <Box height={10} />

        <Stack direction="row" spacing={2} className="my-2 mb-2">
          &nbsp;&nbsp;&nbsp;
{/*         
 <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={uniqueTransactionTypes}
        sx={{ width: 300 }}
        onChange={(e, selectedValue) => filterData(selectedValue)}
        getOptionLabel={(transactionType) => transactionType || ""}
        renderInput={(params) => (
          <TextField {...params} size="small" label="Search Transactions" />
        )}
      /> */}
      {/* // Render the search type selector and Autocomplete component */}
<FormControl sx={{ m: 1, minWidth: 120 }}>
  <InputLabel id="search-type-label">Search Type</InputLabel>
  <Select
    labelId="search-type-label"
    id="search-type"
    value={searchType}
    onChange={handleSearchTypeChange}
    label="Search Type"
  >
    <MenuItem value="transactionType">Transaction Type</MenuItem>
    <MenuItem value="stockName">Stock Name</MenuItem>
  </Select>
</FormControl>

<Autocomplete
  disablePortal
  id="combo-box-demo"
  options={searchType === 'transactionType' ? Array.from(uniqueTransactionTypes) : Array.from(uniqueStockNames)}
  sx={{ width: 300, height: 50 }}
  onChange={(e, selectedValue) => filterData(selectedValue)}
  getOptionLabel={(option) => option || ""}
  renderInput={(params) => (
    <TextField {...params} size="small" label={`Search ${searchType === 'transactionType' ? 'Transaction Type' : 'Stock Name'}`}  />
  )}
/>

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <div className="btnStyle">
            <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleOpen}>
              Add
            </Button>
          </div>
        </Stack>
        <Box height={10} />

        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Date
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Transaction id
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Stock Name
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Quantity
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Total Price
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Transaction Type
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="left">{row.transaction_id}</TableCell>
                    <TableCell align="left">{row.stock_name}</TableCell>
                    <TableCell align="left">{row.quantity}</TableCell>
                    <TableCell align="left">{row.total_price}</TableCell>
                    <TableCell align="left">{row.transaction_type}</TableCell>
                  </TableRow>
                ))}
                       </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 15, 20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
}

