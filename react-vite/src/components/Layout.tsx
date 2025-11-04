import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ThemeToggle from "./ThemeToggle";
import HeaderMusicPlayer from "./HeaderMusicPlayer";
import { Button } from "./ui/button";
import { Menu, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, login, logout, isAuthenticated } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b bg-card px-6">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex-shrink-0"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <HeaderMusicPlayer />
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {user && (
                  <div className="flex items-center gap-2">
                    <img
                      src={user.avatar_url}
                      alt={user.name || user.login}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="hidden sm:block text-sm font-medium">
                      {user.name || user.login}
                    </span>
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={login}
                className="gap-2"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign in with GitHub</span>
              </Button>
            )}
            <ThemeToggle />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
