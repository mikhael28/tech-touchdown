import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FantasyLeagueProvider } from "./contexts/FantasyLeagueContext";
import Layout from "./components/Layout";
import Home from "./pages/Dashboard";
import Sports from "./pages/Sports";
import FantasyLeague from "./pages/FantasyLeague";
import Profile from "./pages/Profile";
import LoginPage from "./components/LoginPage";
import OAuthCallback from "./pages/OAuthCallback";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FantasyLeagueProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="sports" element={<Sports />} />
                <Route path="fantasy" element={<FantasyLeague />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </Router>
        </FantasyLeagueProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
