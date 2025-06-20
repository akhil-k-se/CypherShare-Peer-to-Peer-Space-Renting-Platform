import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Pages/Loading";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("https://cyphershare-peer-to-peer-space-renting-eqhq.onrender.com/auth/me", { withCredentials: true }); // 👈 include cookies
        setUserRole(res.data.role); // Expected { role: "user" | "provider" }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="text-center p-8"><Loading/></div>;
  if (error) return <Navigate to="/" replace />;
  if (!allowedRoles.includes(userRole)) return <Navigate to="/" replace />;

  return children;
};

export default RoleProtectedRoute;
