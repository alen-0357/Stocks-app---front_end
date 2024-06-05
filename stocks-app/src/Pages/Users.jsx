import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import Box from '@mui/material/Box';
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";

const UserList = () => {
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    // Fetch users from the API
    fetch('http://127.0.0.1:5000/users')
      .then((response) => response.json())
      .then((data) => setRowData(data.users || []))
      .catch((error) => console.error('Error fetching users:', error));
  }, []);

  const columnDefs = [
    
    { headerName: 'User ID', field: 'uid' ,width: 550},
    { headerName: 'Email', field: 'email' ,width: 690},
  ];

  return (
    <>
          <Navbar />
          <Box height={30} />
          <Box sx={{ display: 'flex' }}>
              <Sidenav />

              <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <br/>
              <div className="ag-theme-alpine" style={{ height: 500, width: '100%' }}>
              <AgGridReact rowData={rowData} columnDefs={columnDefs} />
          </div>

              </Box>

          </Box>

      </>
  );
};

export default UserList;
