import React from "react";
import Box from '@mui/material/Box';
////////////////////////////////////////////////// Essential
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
//////////////////////////////////////////////////
import Stockslist from "../Stocks Data Lists/Stockslist";

export default function Stocks(){
    return(
        <>
        <div className="bgcolor">
        <Navbar/>
        <Box height={70} />
         <Box sx={{ display: 'flex' }}>
         <Sidenav/>
       
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
       
        <Stockslist/>
      
      </Box>

         </Box>
         </div>
        </>
    )

}