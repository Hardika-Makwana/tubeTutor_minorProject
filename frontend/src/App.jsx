import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VideoPlayer from "./pages/VideoPlayer";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/video/:id" element={<VideoPlayer userId={3} videoId={1} />} />
      </Routes>
    </Router>
  );
}

export default App;







