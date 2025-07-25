import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { login } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      authLogin(data.user, data.token);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
      toast.success('Welcome back!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-centered">
      <div className="auth-card">
        <h2 className="auth-title">Sign in to your account</h2>
        <form className="auth-input-group" onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field */}
          <div className="auth-input-wrapper">
            <label htmlFor="email" className="auth-label">
              Email address
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
              <span className="pl-3 text-gray-400 flex items-center">
                <FiMail className="h-5 w-5" />
              </span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`flex-1 bg-transparent border-0 focus:ring-0 py-3 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-lg ${errors.email ? 'border-red-300' : ''}`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="auth-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="auth-input-wrapper">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
              <span className="pl-3 text-gray-400 flex items-center">
                <FiLock className="h-5 w-5" />
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`flex-1 bg-transparent border-0 focus:ring-0 py-3 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-lg ${errors.password ? 'border-red-300' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="pr-3 text-gray-400 hover:text-gray-600 flex items-center bg-transparent border-0 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="auth-error">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between mt-2">
            <Link
              to="/forgot-password"
              className="auth-link text-sm"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-btn-primary mt-4"
          >
            {isLoading ? (
              <span className="auth-loading"><span className="auth-spinner"></span>Signing in...</span>
            ) : (
              'Login'
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm pro-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="auth-link"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
