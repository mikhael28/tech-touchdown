import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FantasyLeagueProvider } from "./contexts/FantasyLeagueContext";
import Layout from "./components/Layout";
import Home from "./pages/Dashboard";
import Sports from "./pages/Sports";
import Games from "./pages/Games";
import Gambling from "./pages/Gambling";
import Slideshow from "./pages/Slideshow";
import PodcastRecording from "./pages/PodcastRecording";
import Companies from "./pages/Companies";
import Experiments from "./pages/Experiments";
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
                <Route path="games" element={<Games />} />
                <Route path="gambling" element={<Gambling />} />
                <Route path="experiments" element={<Experiments />} />
                <Route path="podcast" element={<PodcastRecording />} />
                <Route path="slideshow" element={<Slideshow />} />
                <Route path="companies" element={<Companies />} />
              </Route>
            </Routes>
          </Router>
        </FantasyLeagueProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
