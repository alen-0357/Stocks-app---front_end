import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import MiniDrawer from "../components/Sidenav";
import Navbar from "../components/Navbar";
import Stack from '@mui/material/Stack';
import "../Dash.css";
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AddCardIcon from '@mui/icons-material/AddCard';
import { Button, CardActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from "@mui/material";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import App from '../chatbotcomponent';
import Homeposting from "../Home_Posting_Data/posting";
import Fetchposts from "../Home_Posting_Data/fetching_posts";
import StockTicker from "./Stocktickers";
import Fetchuser from "../Extra_Homepage_res/Welcomeuser";
import { useAppStore } from '../appStore'; // Import useAppStore
import { keyframes } from '@mui/system';

const stockData = [
  { name: "Apple", price: "150.25", trend: 0 }, // trend: 0 for initial state
  { name: "Google", price: "280.50", trend: 0 },
  { name: "Accenture", price: "570.50", trend: 0 },
  { name: "Coco Cola", price: "345.70", trend: 0 },
];

const CompanyLogos = [
  { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg", percentage: 10 },
  { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", percentage: -5 },
  { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg", percentage: 8 },
  { name: "Coca Cola", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg", percentage: 3 },
];

const slideAnimation = keyframes`
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
`;


const Home = () => {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState(stockData);
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);
  const [currentPercentage, setCurrentPercentage] = useState(CompanyLogos[0].percentage);
  
  // Function to generate a random price variation
  const generateRandomPrice = (price) => {
    const numericPrice = parseFloat(price); // Convert price to number
    if (isNaN(numericPrice)) {
      return price; // Return original price if conversion fails
    }
    const change = (Math.random() * 2 - 1) * 10; // Random change between -10 and 10
    return (numericPrice + change).toFixed(2); // Return formatted number
  };
 
   // Function to randomly update trend every few seconds
   useEffect(() => {
    const interval = setInterval(() => {
      const updatedStocks = stocks.map(stock => ({
        ...stock,
        trend: Math.random() > 0.3 ? 1 : -1, // Randomly set trend to 1 (up) or -1 (down)
        price: generateRandomPrice(stock.price), // Update price with random variation
      }));
      setStocks(updatedStocks);
    }, 3000); // Change trend every 3 seconds

    return () => clearInterval(interval);
  }, [stocks]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCompanyIndex((prevIndex) => (prevIndex + 1) % CompanyLogos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentPercentage(CompanyLogos[currentCompanyIndex].percentage);
  }, [currentCompanyIndex]);





  return (
    <>
      <div className="bgcolor">
        <Navbar />
        <Box height={70} />
        {/* <Box sx={{ display: 'flex' }}> */}
        {/* <Box sx={{ display: 'flex', position: 'relative' }}> */}
        {/* <MiniDrawer /> */}
          {/* <Box component="main" sx={{ flexGrow: 1, p: 3 }}> */}
          {/* <Box component="main" sx={{ flexGrow: 1, p: 3, ml: 3}}> */}
          <Box sx={{ display: 'flex', position: 'relative' }}>
          <MiniDrawer />
          <Box component="main" sx={{ flexGrow: 6, p: 3,  transition: 'margin-left 0.3s ease' }}>
            <Grid container spacing={2}>
              <div>
                <StockTicker />
              </div>
              <Grid item xs={8}>
                <Fetchuser/>
                <br/>
    
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
                            <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: '#fff' }}>Stock Name</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: '#fff' }}>Price</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', background: '#1976d2', color: '#fff' }}>Price Curve</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {stocks.map((stock, index) => (
                            <TableRow key={index} sx={{ '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' } }}>
                              <TableCell>{stock.name}</TableCell>
                              <TableCell>{`₹${stock.price}`}</TableCell>
                              <TableCell>
                                <IconButton sx={{ color: stock.trend === 1 ? "#4caf50" : "#f44336" }}>
                                  {stock.trend === 1 ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Grid>

              

            
              
              <Grid item xs={4}>
              
              {/* <Grid item xs={10} style={{ marginTop: '30px', height: '31.5%' }}>
  <Card variant="outlined" style={{ minWidth: 270, height: '100%' }}>
    <CardContent style={{ height: '100%' }}>
      <Typography variant="h5" component="div">
       Comin
      </Typography>
      
      <Typography variant="h4" component="div">
      SOOOOOOOn!
      </Typography>
      
    </CardContent>
  </Card>
</Grid> */}
    <Grid item xs={10} style={{ marginTop: '30px', height: '31.5%' }}>
      <Card variant="outlined" style={{ minWidth: 270, height: '100%' }}>
        <CardContent
          style={{
            height: '100%',
            backgroundImage: `url(${CompanyLogos[currentCompanyIndex].logo})`,
            backgroundSize: 'contain', // Adjust to ensure the logo fits
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Background color for contrast
            borderRadius: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            animation: `${slideAnimation} 12s infinite`, // Slow down the animation
          }}
        >
          <Typography variant="h5" component="div">
            Featured
          </Typography>
          <Typography variant="h4" component="div">
            {currentPercentage}%
          </Typography>
        </CardContent>
      </Card>
    </Grid>
                {/* <br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/> */}
                {/* <Stack spacing={2}> */}
                <Stack spacing={3} sx={{ marginTop: '25px' }}> {/* Adjust spacing and marginTop as needed */}
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
                  </Card>
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
                      navigate("/upload_Docs");
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
                          <span className="pricetitle">Upload Documents</span>
                        </div>
                      </Stack>
                    </CardContent>
                  </Card>
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
                      navigate("/events");
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
                          <span className="pricetitle">Add Events</span>
                        </div>
                      </Stack>
                    </CardContent>
                  </Card>
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
                      navigate("/portfolio_management");
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
                          <LocalAtmIcon />
                        </div>
                        <div className="paddingall">
                          <span className="pricetitle">View Portfolio</span>
                        </div>
                      </Stack>
                    </CardContent>
                  </Card>
                
                </Stack>
          
              </Grid>
              
              <Grid item xs={4}>
                <Homeposting />
              </Grid>
            </Grid>
            <br />
            <br />
            <Grid container spacing={3}>
              <Grid item xs={12} sm={8}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <Fetchposts />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </div>
    </>
  );
};

export default Home;
