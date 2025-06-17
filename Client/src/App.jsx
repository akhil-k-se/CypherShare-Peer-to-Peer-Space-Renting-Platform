import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Welcome from './Pages/user/Welcome';
import Provider_Welcome from './Pages/Provider/Provider_Welcome';
import LandingPage from './Pages/LandingPage';
import SmoothScrollWrapper from './Components/SmoothScrollWrapper'; // ✅ import here

const App = () => {
  return (
    <Router>
      <SmoothScrollWrapper> {/* ✅ wrap all routes */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome-user" element={<Welcome />} />
          <Route path="/welcome-renter" element={<Provider_Welcome />} />
        </Routes>
      </SmoothScrollWrapper>
    </Router>
  );
};

export default App;
