
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

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {   query, where } from "firebase/firestore";
import { useUser } from '../UserContext';
import Addevent from './addevent';
import Editeventform from './editevent';

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

export default function Eventlist() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const empCollectionRef = collection(db, "events");
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);
  const auth = getAuth();
  const { userId } = useUser(); // Get userId from the context
  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);
  const [editopen, setEditOpen] = useState(false);
  const [formid, setFormid] = useState("");

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

  const editData = (id,event_description) => {
    const data = {
      id:id,
      event_description: event_description,
      
    };
    setFormid(data);
    handleEditOpen();
  };


  const uniqueselectedstockname = [...new Set(rows.map(row => row.stock_name))];
  const filterData = (selectedstockname) => {
    if (selectedstockname) {
      // Filter rows based on the selected transaction type
      const filteredRows = rows.filter(row => row.stock_name === selectedstockname);
      setRows(filteredRows);
    } else {
      // If no transaction type is selected, reset the rows to the original data
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
            <Addevent closeEvent={handleClose} />
          </Box>
        </Modal>
        <Modal
        open={editopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Editeventform closeEvent={handleEditClose} fid={formid}/>
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
          Events List
        </Typography>
        <Divider />

        <Box height={10} />

        <Stack direction="row" spacing={2} className="my-2 mb-2">
          &nbsp;&nbsp;&nbsp;
       
 <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={uniqueselectedstockname}
        sx={{ width: 300 }}
        onChange={(e, selectedValue) => filterData(selectedValue)}
        getOptionLabel={(stock_name) => stock_name || ""}
        renderInput={(params) => (
          <TextField {...params} size="small" label="Search Events" />
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
                  Event id
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Stock Name
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Event Description
                </TableCell>
                <TableCell align="left" style={{ minWidth: "100px"}}>
                  Actions
                </TableCell>
               
               
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    <TableCell align="left">{row.date}</TableCell>
                    <TableCell align="left">{row.event_id}</TableCell>
                    <TableCell align="left">{row.stock_name}</TableCell>
                    <TableCell align="left">{row.event_description}</TableCell>
                    <TableCell align="left">
                          <Stack spacing={2} direction="row">
                            &nbsp;&nbsp;&nbsp;
                            <EditIcon
                              style={{
                                fontSize: "20px",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => {
                                editData(row.id, row.event_description);
                              }}
                            />
                            
                          </Stack>
                        </TableCell>
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

