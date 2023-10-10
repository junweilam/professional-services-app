import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, BrowserRouter } from 'react-router-dom'; 
import SignIn from './SignIn';
import SignUp from './SignUp';
import Navbar from './component/Navbar';



function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;
