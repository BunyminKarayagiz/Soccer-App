import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function AdminRoute({ children }) {
  const { currentUser, emailVerified, isAdmin } = useAuth();

  if (!currentUser) return <Navigate to="/login" replace />;
  if (!emailVerified) return <Navigate to="/verify-email" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

export default AdminRoute;
