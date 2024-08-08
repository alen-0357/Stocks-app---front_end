
import React from "react";
import {Routes,Route, BrowserRouter } from "react-router-dom"
import Transactions from "./Pages/Transactions";
import Stocks from "./Pages/Stocks";
import Home from "./Pages/Home";
import Portfolio_Management from "./Pages/Portfolio Management";
import Users from "./Pages/Users";
import Events from "./Pages/events";
import Login from "./Login and Register/Login";
import Register from "./Login and Register/Register";
import AuthProvider from './AuthProvider';
import View_Portfolio from "./Pages/View Portfolio";
import The_FuturePredictions from "./Pages/Future predictions";
import Upload_Docs from "./Pages/Upload Docs";
// import Stockdetails from "./Pages/Stocksdetails";
import Aboutstocks from "./Stocks_Details_Home/About_stocks";
import Listingstocks from "./Pages/Listingstocks";


export default function App() {
  return (
  <AuthProvider>
  <BrowserRouter>
  
  <Routes>
    
    <Route path='/' exact element={<Login />}></Route>
    <Route path='/Register' exact element={<Register />}></Route>
    <Route path='/stocks' exact element={<Stocks />}></Route>
    <Route path='/events' exact element={<Events />}></Route>
    <Route path='/users' exact element={<Users />}></Route>
    <Route path='/Home' exact element={<Home />}></Route>
    <Route path='/transactions' exact element={<Transactions />}></Route>
    <Route path='/portfolio_management' exact element={<Portfolio_Management />}></Route>
    <Route path='/view_portfolio' exact element={<View_Portfolio />}></Route>
    <Route path='/future_predictions' exact element={<The_FuturePredictions />}></Route>
    <Route path='/upload_Docs' exact element={<Upload_Docs />}></Route>
    <Route path='/about_stocks/:stockId' exact element={<Aboutstocks />}></Route> 
    <Route path='/List_Stocks' exact element={<Listingstocks />}></Route> 



  </Routes>
  </BrowserRouter>

  </AuthProvider>
  )
}


