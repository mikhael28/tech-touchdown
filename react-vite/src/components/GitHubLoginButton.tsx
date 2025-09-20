import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Github } from 'lucide-react';

interface GitHubLoginButtonProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const GitHubLoginButton: React.FC<GitHubLoginButtonProps> = ({
  className = '',
  size = 'md',
  variant = 'default',
}) => {
  const { login, isLoading } = useAuth();

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    default: 'bg-gray-900 hover:bg-gray-800 text-white',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700',
    ghost: 'hover:bg-gray-100 text-gray-700',
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  return (
    <button
      onClick={login}
      disabled={isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <Github className="w-4 h-4 mr-2" />
      {isLoading ? 'Signing in...' : 'Sign in with GitHub'}
    </button>
  );
};

export default GitHubLoginButton;
