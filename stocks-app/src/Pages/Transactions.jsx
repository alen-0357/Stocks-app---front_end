import React from "react";
import Box from '@mui/material/Box';


import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import Transactionlist from "../Transaction Data Lists/Transactoinlist";

export default function Transactions(){
    return(
        <>
        <div className="bgcolor">
        <Navbar/>
        <Box height={70} />
         <Box sx={{ display: 'flex' }}>
         <Sidenav/>
       
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Transactionlist/>
      
      </Box>

         </Box>
        </div>
        </>
    )

}