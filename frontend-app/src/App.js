import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom'; 
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

// Admin Imports
import AdminHome from './pages/AdminHome';
import AdminAddServices from './pages/AdminAddServices';

import Navbar from './component/Navbar';



function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/adminhome" element={<AdminHome/>} />
        <Route path="/adminaddservices" element={<AdminAddServices/>} />
        <Route path="/*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
