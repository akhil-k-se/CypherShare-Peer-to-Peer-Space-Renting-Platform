import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Welcome from './Pages/user/Welcome';
import Provider_Welcome from './Pages/Provider/Provider_Welcome';
import LandingPage from './Pages/LandingPage';
import SmoothScrollWrapper from './Components/SmoothScrollWrapper';
import Loading from './Pages/Loading'; // ✅ Import the loader

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // Show loader for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />; // ✅ Show loader before app mounts
  }

  return (
    <Router>
      <SmoothScrollWrapper>
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
