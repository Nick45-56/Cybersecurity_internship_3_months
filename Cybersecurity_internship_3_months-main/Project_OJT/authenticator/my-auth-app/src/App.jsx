import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import Home from "./Homepage";
import Navbar from "./Navbar";
import Howtouse from "./Howtouse";
import Spline from "@splinetool/react-spline";;

function isAuthed() {
  return !!localStorage.getItem("token");
}

export default function App() {
  return (
    <main>
      {/* Background */}
      <div className="spline-bg">
        <Spline scene="https://prod.spline.design/JOiuuuf6YXIeCES6/scene.splinecode" />
      </div>

      {/* Floating Nav */}
      <Navbar />

      {/* Routes */}
      
        <Routes>
          <Route path="/" element={<Home />} />
        <Route path="/howtouse" element={<Howtouse />} />
          <Route path="/auth" element={<AuthForm />} />
          <Route
            path="/dashboard"
            element={isAuthed() ? <Dashboard /> : <Navigate to="/auth" />}
          />
          <Route
            path="*"
            element={<Navigate to={isAuthed() ? "/dashboard" : "/auth"} />}
          />
        </Routes>
      
    </main>
  );
}
