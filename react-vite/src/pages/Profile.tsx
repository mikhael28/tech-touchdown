import React from "react";
import { Button } from "../components/ui/button";
import { User, Mail, Calendar, Trophy, Laptop, ThumbsUp, MessageCircle, Clock, Settings, Github, ExternalLink, MapPin, Building } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return null; // This should not happen due to ProtectedRoute, but just in case
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <div className="flex space-x-2">
            <Button variant="outline" asChild>
              <a href={`https://github.com/${user.login}`} target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on GitHub
                <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
            <Button variant="outline" onClick={logout}>
              <Settings className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Profile Header */}
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <img
                src={user.avatar_url}
                alt={user.name || user.login}
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
              <p className="text-muted-foreground">@{user.login}</p>
              {user.bio && (
                <p className="mt-1 text-sm text-muted-foreground">{user.bio}</p>
              )}
              <p className="mt-1 text-sm text-muted-foreground">
                Member since {formatDate(user.created_at)}
              </p>
            </div>
          </div>
          
          {/* Additional GitHub Info */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {user.location && (
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.location}</span>
              </div>
            )}
            {user.company && (
              <div className="flex items-center space-x-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.company}</span>
              </div>
            )}
            {user.blog && (
              <div className="flex items-center space-x-2">
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  {user.blog}
                </a>
              </div>
            )}
            {user.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{user.email}</span>
              </div>
            )}
          </div>
        </div>

      {/* GitHub Statistics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-4 text-xl font-semibold">GitHub Statistics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Github className="h-5 w-5 text-blue-500" />
                <span className="text-muted-foreground">Public Repositories</span>
              </div>
              <span className="font-semibold">{user.public_repos}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-green-500" />
                <span className="text-muted-foreground">Followers</span>
              </div>
              <span className="font-semibold">{user.followers}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-purple-500" />
                <span className="text-muted-foreground">Following</span>
              </div>
              <span className="font-semibold">{user.following}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-yellow-500" />
                <span className="text-muted-foreground">Account Age</span>
              </div>
              <span className="font-semibold">
                {Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24 * 365))} years
              </span>
            </div>
          </div>
        </div>


      </div>

   
    </div>
    </ProtectedRoute>
  );
};

export default Profile;
