import React from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Sidenav from "../components/Sidenav";
import Navbar from "../components/Navbar";
import Stack from '@mui/material/Stack';
import "../Dash.css"
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AddCardIcon from '@mui/icons-material/AddCard';
import { Button, CardActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import App from '../chatbotcomponent';



export default function Home(){
  const navigate = useNavigate();
    return(

<>
<div className="bgcolor">

    <Navbar/>
    
    <Box height={70} />
    <Box sx={{ display: 'flex' }}>
        <Sidenav/>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Grid container spacing={2}>
  <Grid item xs={8}>
  <Card
  sx={{
    height: "60vh",
    borderRadius: "10px",
    overflow: "hidden",
    background: "linear-gradient(135deg, #3498db 0%, #8e44ad 100%)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
    color: "#fff",
  }}
>
  <CardContent>
    <Typography gutterBottom variant="h5" component="div">
      Stock Information
    </Typography>
    <TableContainer
      component={Paper}
      sx={{
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Stock Name</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Price Curve</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Apple</TableCell>
            <TableCell>₹150.25</TableCell>
            <TableCell>
              <IconButton sx={{ color: "#4caf50" }}>
                <ArrowUpwardIcon />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Google</TableCell>
            <TableCell>₹280.50</TableCell>
            <TableCell>
              <IconButton sx={{ color: "#f44336" }}>
                <ArrowDownwardIcon />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Accenture</TableCell>
            <TableCell>₹570.50</TableCell>
            <TableCell>
              <IconButton sx={{ color: "#4caf50" }}>
                <ArrowUpwardIcon />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Coco Cola</TableCell>
            <TableCell>₹345.70</TableCell>
            <TableCell>
              <IconButton sx={{ color: "#f44336" }}>
                <ArrowDownwardIcon />
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Rockstar Games</TableCell>
            <TableCell>₹765.40</TableCell>
            <TableCell>
              <IconButton sx={{ color: "#4caf50" }}>
                <ArrowUpwardIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </CardContent>
</Card>

                </Grid>
                <Grid item xs={4}>
                    <Stack spacing={2}>
                    <Card
  sx={{
    maxWidth: 420,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }}
  onClick={() => {
    navigate("/stocks");
  }}
>
  <CardContent
    sx={{
      backgroundImage: "linear-gradient(to bottom right, #4e54c8, #8f94fb)",
      borderRadius: "10px",
      color: "#fff",
    }}
  >
    <Stack spacing={2} direction="row" alignItems="center">
      <div className="iconstyle">
        <AddIcon />
      </div>
      <div className="paddingall">
        <span className="pricetitle">Add Stocks</span>
      </div>
    </Stack>
  </CardContent>
</Card><Card
  sx={{
    maxWidth: 420,
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s",
    "&:hover": {
      transform: "scale(1.05)",
    },
  }}
  onClick={() => {
    navigate("/transactions");
  }}
>
  <CardContent
    sx={{
      backgroundImage: "linear-gradient(to bottom right, #4e54c8, #8f94fb)",
      borderRadius: "10px",
      color: "#fff",
    }}
  >
    <Stack spacing={2} direction="row" alignItems="center">
      <div className="iconstyle">
        <AddIcon />
      </div>
      <div className="paddingall">
        <span className="pricetitle">Buy / Sell Stocks</span>
      </div>
    </Stack>
  </CardContent>
</Card>
                        
<Grid item xs={11}>
  <Card sx={{ height: "40vh", padding: "20px", backgroundColor: "#fffafa", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
    <CardContent>
      <Typography variant="h5" gutterBottom style={{ color: "#333333", marginBottom: "20px", borderBottom: "2px solid #cccccc" }}>
        About:
      </Typography>
      <Typography variant="body1" paragraph style={{ color: "#666666", marginBottom: "10px" }}>
        This Stocks App provides users with comprehensive tools and information to manage their stock investments effectively.
      </Typography>
      <Typography variant="body1" paragraph style={{ color: "#666666", marginBottom: "10px" }}>
        With features such as real-time stock prices, portfolio management, transaction tracking, and customizable alerts, users can stay informed and make informed decisions about their investments.
      </Typography>
    </CardContent>
  </Card>  
</Grid>
{/* <App/> */}

 
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    </Box>
</div>
</>
      
      
    )

}