import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({children}){
  const {currentUser, emailVerified} = useAuth();

  if(!currentUser) return <Navigate to="/login"/>
  if(!emailVerified) return <Navigate to="/verify-email" replace />

  return children;
}

export default ProtectedRoute;
