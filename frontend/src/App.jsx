import {Routes, Route, Router } from "react-router-dom";
import AboutUsPage from "./pages/AboutUsPage";
import HomePage from "./pages/HomePage";
import Support from "./pages/Support";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {

  return (
    <>
<div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1 }}>      <Navbar />
      <Routes>
<Route path="/" element={<HomePage />} />
<Route path="/about" element={<AboutUsPage />} />

<Route path="/support" element={<Support />} />

</Routes>
</div>
<Footer />
</div>
</>
    
  );
}

export default App;