import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Dashboard";
import Sports from "./pages/Sports";
import Tech from "./pages/Tech";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import LoginPage from "./components/LoginPage";
import OAuthCallback from "./pages/OAuthCallback";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="sports" element={<Sports />} />
              <Route path="tech" element={<Tech />} />
              <Route path="search" element={<Search />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
