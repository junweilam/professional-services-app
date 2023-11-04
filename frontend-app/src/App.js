import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage'
import AdminHome from './pages/AdminHome';
import AdminAddServices from './pages/AdminAddServices';
import PaymentPage from './pages/PaymentPage';
import CartPage from './pages/CartPage';
import CheckoutSuccess from './component/CheckoutSucess'
import FaqPage from './pages/FAQPage'
import AdminAddUsers from './pages/AdminAddUsers';
import OrderHistory from './pages/HistoryPage';
import ServiceHomePage from './pages/ServiceHomePage';


// Service Imports
import ServiceHome from './pages/ServiceHome';

import Navbar from './component/Navbar';
import { EmailProvider } from './context/EmailContext';
import AdminUpdateService from './pages/AdminUpdateService';

function App() {


  return (
    <Router>
      <Navbar/>
      
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/adminhome" element={<AdminHome />} />
          <Route path="/checkout-success" element={<CheckoutSuccess />} />
          <Route path="/adminaddservices" element={<AdminAddServices />} />
          <Route path="/adminaddusers" element={<AdminAddUsers/>} />
          <Route path="/adminupdateservice" element={<AdminUpdateService/>}/>
          <Route path="/*" element={<Navigate to="/signin" />} />
          <Route path="/servicehome" element={<ServiceHome />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/orderhistory" element={<OrderHistory />} />
          <Route path="/servicehomepage" element={<ServiceHomePage />} />
        </Routes>
      

    </Router>
  );
}

export default App;