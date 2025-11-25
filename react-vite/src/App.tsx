import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { FantasyLeagueProvider } from "./contexts/FantasyLeagueContext";
import Layout from "./components/Layout";
import News from "./pages/News";
import Games from "./pages/Games";
import Shows from "./pages/Shows";
import Podcast from "./pages/Podcast";
import PodcastRecording from "./pages/PodcastRecording";
import Companies from "./pages/Companies";
import Experiments from "./pages/Experiments";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import BlogEditor from "./pages/BlogEditor";
import Radio from "./pages/Radio";
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
                <Route index element={<Games />} />
                <Route path="news" element={<News />} />
                <Route path="sports" element={<Games />} />
                <Route path="shows" element={<Shows />} />
                <Route path="radio" element={<Radio />} />
                <Route path="experiments" element={<Experiments />} />
                <Route path="podcast" element={<Podcast />} />
                <Route path="podcast-studio" element={<PodcastRecording />} />
                <Route path="companies" element={<Companies />} />
                <Route path="blog">
                  <Route index element={<BlogList />} />
                  <Route path="new" element={<BlogEditor />} />
                  <Route path=":slug" element={<BlogPost />} />
                  <Route path=":slug/edit" element={<BlogEditor />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </FantasyLeagueProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
