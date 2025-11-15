import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("admin_session_token");
  const savedPw = localStorage.getItem("admin_pw");

  if (!token || !savedPw) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
}
