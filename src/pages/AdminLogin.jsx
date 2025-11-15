import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [pw, setPw] = useState("");
  const REAL_PW = import.meta.env.VITE_ADMIN_PANEL_PW;

  function handleLogin() {
    if (pw === REAL_PW) {
      localStorage.setItem("admin_session_token", "verified");
      localStorage.setItem("admin_pw", pw);
      navigate("/admin");
    } else {
      alert("Incorrect password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-semibold mb-4">Admin Login</h2>

        <input
          type="password"
          placeholder="Enter admin password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
