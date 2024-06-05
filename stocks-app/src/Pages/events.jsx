import React from "react";
import Box from '@mui/material/Box';


import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import Eventlist from "../Events Data Lists/eventlist";


export default function Events(){
    return(
        <>
        <div className="bgcolor">
        <Navbar/>
        <Box height={70} />
         <Box sx={{ display: 'flex' }}>
         <Sidenav/>
       
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Eventlist/>
      </Box>

         </Box>
        </div>
        </>
    )

}