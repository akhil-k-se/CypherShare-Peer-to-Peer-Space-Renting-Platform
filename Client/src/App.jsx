import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Welcome from "./Pages/user/Welcome";
import Provider_Welcome from "./Pages/Provider/Provider_Welcome";
import LandingPage from "./Pages/LandingPage/LandingPage";
import SmoothScrollWrapper from "./Components/SmoothScrollWrapper";
import Loading from "./Pages/Loading";
import BackToTopButton from "./Components/ui/backToTopButton";

// ✅ This component will access useLocation inside the Router
const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      <SmoothScrollWrapper>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/welcome-user" element={<Welcome />} />
          <Route path="/welcome-renter" element={<Provider_Welcome />} />
        </Routes>
      </SmoothScrollWrapper>

      {/* Show BackToTop only on Landing Page */}
      {isLandingPage && <BackToTopButton />}
    </>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <Loading />;

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
