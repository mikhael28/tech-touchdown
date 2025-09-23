import React from "react";
import GitHubLoginButton from "./GitHubLoginButton";
import WebsitePreviewCarousel from "./WebsitePreviewCarousel";
import MP3Player from "./MusicPlayer";
import { useAuth } from "../contexts/AuthContext";
import { Github, Shield, Users, Code, AlertCircle } from "lucide-react";

const LoginPage: React.FC = () => {
  const { error } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl space-y-8">
        {/* Login Section */}
        <div className="mx-auto max-w-md">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
              <Github className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Welcome to Tech Touchdown
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              A platform for software engineers who are sports fans.
            </p>
          </div>

          <div className="rounded-lg bg-white px-6 py-8 shadow-lg">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Sign in to continue
                </h3>
                <p className="mb-6 text-sm text-gray-500">
                  This platform is exclusively for developers. Sign in with your
                  GitHub account to access the latest sports and tech news.
                </p>
              </div>

              <div className="space-y-4">
                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <GitHubLoginButton size="lg" className="w-full" />

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    By signing in, you agree to our Terms of Service and Privacy
                    Policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Website Preview Carousel */}
        <div className="mt-12">
          <WebsitePreviewCarousel />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
