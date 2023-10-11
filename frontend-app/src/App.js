import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/HomePage';
import AdminHome from './pages/AdminHome';
import AdminAddServices from './pages/AdminAddServices';

// User Imports
import UserHome from './pages/UserHome';

//Service Imports
import ServiceHome from './pages/ServiceHome';

import Navbar from './component/Navbar';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (service) => {
    setCart([...cart, service]);
  };

  const removeFromCart = (service) => {
    const updatedCart = cart.filter((item) => item.id !== service.id);
    setCart(updatedCart);
  };

  return (
    <Router>
      <Navbar cart={cart} removeFromCart={removeFromCart} />
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/adminhome" element={<AdminHome />} />
        <Route path="/adminaddservices" element={<AdminAddServices />} />
        <Route path="/" element={<Home addToCart={addToCart} />} />
        <Route path="/*" element={<Navigate to="/signin" />} />
      </Routes>
    </Router>
  );
}

export default App;

