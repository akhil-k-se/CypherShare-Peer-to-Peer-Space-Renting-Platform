import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register'
import Welcome from './Pages/user/Welcome';
import Provider_Welcome from './Pages/Provider/Provider_Welcome';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome-user" element={<Welcome />} />
        <Route path="/welcome-renter" element={<Provider_Welcome />} />


      </Routes>
    </Router>
  );
};

export default App;
