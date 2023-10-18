import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import HomePage from './pages/HomePage'
import AdminHome from './pages/AdminHome';
import AdminAddServices from './pages/AdminAddServices';

// User Imports
import UserHome from './pages/UserHome';

// Service Imports
import ServiceHome from './pages/ServiceHome';

import Navbar from './component/Navbar';

function App() {
  

  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminaddservices" element={<AdminAddServices />} />
        <Route path="/*" element={<Navigate to="/signin" />} />
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/servicehome" element={<ServiceHome />} />
        <Route path="/homepage" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;