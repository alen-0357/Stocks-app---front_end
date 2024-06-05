import React from "react";
import Box from '@mui/material/Box';


import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import Docslist from "../Upload Docs/Docslist";

export default function Upload_Docs(){
    return(
        <>
        <div className="bgcolor">
        <Navbar/>
        <Box height={70} />
         <Box sx={{ display: 'flex' }}>
         <Sidenav/>
       
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Docslist/>
      
      </Box>

         </Box>
        </div>
        </>
    )

}