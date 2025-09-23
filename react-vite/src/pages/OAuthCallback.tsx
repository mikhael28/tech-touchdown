import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback, isLoading, error } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed.current) return;
    
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error');
    
    // Debug logging
    console.log('OAuthCallback - Full URL:', window.location.href);
    console.log('OAuthCallback - Search params:', Object.fromEntries(searchParams.entries()));
    console.log('OAuthCallback - Code:', code);
    console.log('OAuthCallback - Error param:', errorParam);

    if (errorParam) {
      console.error('OAuth error:', errorParam);
      hasProcessed.current = true;
      // Redirect to login page after a short delay
      setTimeout(() => navigate('/login'), 3000);
      return;
    }

    if (code) {
      console.log('OAuthCallback - Processing code:', code);
      hasProcessed.current = true;
      handleOAuthCallback(code).then(() => {
        // Redirect to dashboard after successful authentication
        navigate('/');
      }).catch((error) => {
        console.error('OAuthCallback - Error in handleOAuthCallback:', error);
        navigate('/login');
      });
    } else {
      console.log('OAuthCallback - No code parameter found, redirecting to login');
      hasProcessed.current = true;
      // No code parameter, redirect to login
      navigate('/login');
    }
    // include handleOAuthCallback in the dependency array?
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Authentication Failed
          </h2>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <Loader2 className="mx-auto h-12 w-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Authenticating...
        </h2>
        <p className="text-gray-600">
          Please wait while we verify your GitHub account.
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
