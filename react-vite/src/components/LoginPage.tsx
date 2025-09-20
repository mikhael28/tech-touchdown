import React from 'react';
import GitHubLoginButton from './GitHubLoginButton';
import { useAuth } from '../contexts/AuthContext';
import { Github, Shield, Users, Code, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { error } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-gray-900 rounded-full flex items-center justify-center">
            <Github className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Tech Touchdown
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            A developer-exclusive platform for sports and tech news
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Sign in to continue
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                This platform is exclusively for developers. Sign in with your GitHub account to access the latest sports and tech news.
              </p>
            </div>

            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                    <div className="ml-3">
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <GitHubLoginButton 
                size="lg" 
                className="w-full"
              />
              
              <div className="text-center">
                <p className="text-xs text-gray-500">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <p className="mt-2 text-xs text-gray-600">Secure</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <p className="mt-2 text-xs text-gray-600">Developer-Only</p>
            </div>
            <div className="text-center">
              <div className="mx-auto h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Code className="h-4 w-4 text-purple-600" />
              </div>
              <p className="mt-2 text-xs text-gray-600">Tech-Focused</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
