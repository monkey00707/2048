import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BoardView from "./components/Board";
import "./main.scss";
import "./styles.scss";

const App = () => {
  const isAuthenticated = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        {/* ✅ Redirect to game if logged in */}
        <Route path="/" element={isAuthenticated ? <BoardView /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
