import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import AboutUsPage from "./pages/AboutUsPage";
import HomePage from "./pages/HomePage";
import Support from "./pages/Support";
import LoginSignup from "./pages/LoginSignup";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
  }, []);
  const isAuthenticated = !!localStorage.getItem("isAuthenticated");
  return (
    <>
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>
          <Navbar />
          <Routes>
            <Route path="/auth" element={<LoginSignup />} />
            <Route
              path="/"
              element={isAuthenticated ? <HomePage /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/about"
              element={isAuthenticated ? <AboutUsPage /> : <Navigate to="/auth" replace />}
            />
            <Route
              path="/support"
              element={isAuthenticated ? <Support /> : <Navigate to="/auth" replace />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default App;