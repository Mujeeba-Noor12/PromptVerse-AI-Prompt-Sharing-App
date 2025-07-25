

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { login, register as registerUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Auth = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const password = watch('password');

  const loginMutation = useMutation(login, {
    onSuccess: (data) => {
      authLogin(data.user, data.token);
      navigate('/', { replace: true });
      toast.success('Welcome back!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
    },
  });

  const registerMutation = useMutation(registerUser, {
    onSuccess: (data) => {
      authLogin(data.user, data.token);
      navigate('/', { replace: true });
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    },
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    reset();
  };

  const onLoginSubmit = async (data) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      await registerMutation.mutateAsync(userData);
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-centered">
      <div className="auth-card">
        <h1 className="auth-title">{activeTab === 'login' ? 'Sign In' : 'Create Account'}</h1>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => handleTabChange('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => handleTabChange('signup')}
          >
            Sign Up
          </button>
        </div>

        {activeTab === 'login' && (
          <form onSubmit={handleSubmit(onLoginSubmit)} className="auth-input-group">
            {/* Email */}
            <div className="auth-input-wrapper">
              <label htmlFor="login-email" className="auth-label">Email Address *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.email ? 'border-red-400' : ''}`}>
                <FiMail className="text-gray-400 mr-2" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="guest@example.com"
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="auth-input-wrapper">
              <label htmlFor="login-password" className="auth-label">Password *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.password ? 'border-red-400' : ''}`}>
                <FiLock className="text-gray-400 mr-2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="flex-1 bg-transparent outline-none pr-8"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button type="button" onClick={() => navigate('/forgot-password')} className="text-sm auth-link">
                Forgot your password?
              </button>
            </div>

           
            <button
  type="submit"
  disabled={isLoading}
  className={`w-full mt-4 flex justify-center items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold ${
    isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
  }`}
>
  {isLoading ? (
    <>
      <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin" />
      Signing in...
    </>
  ) : (
    <>
      Login
      <FiArrowRight className="w-4 h-4 ml-1" />
    </>
  )}
</button>

          </form>
        )}

        {activeTab === 'signup' && (
          <form onSubmit={handleSubmit(onRegisterSubmit)} className="auth-input-group">
            {/* Username */}
            <div className="auth-input-wrapper">
              <label htmlFor="signup-username" className="auth-label">Username *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.username ? 'border-red-400' : ''}`}>
                <FiUser className="text-gray-400 mr-2" />
                <input
                  id="signup-username"
                  type="text"
                  autoComplete="username"
                  {...register('username', {
                    required: 'Username is required',
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters',
                    },
                    maxLength: {
                      value: 30,
                      message: 'Username must be less than 30 characters',
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Only letters, numbers, and underscores allowed',
                    },
                  })}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && <p className="auth-error">{errors.username.message}</p>}
            </div>

            {/* Email */}
            <div className="auth-input-wrapper">
              <label htmlFor="signup-email" className="auth-label">Email Address *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.email ? 'border-red-400' : ''}`}>
                <FiMail className="text-gray-400 mr-2" />
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="auth-input-wrapper">
              <label htmlFor="signup-password" className="auth-label">Password *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.password ? 'border-red-400' : ''}`}>
                <FiLock className="text-gray-400 mr-2" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  className="flex-1 bg-transparent outline-none pr-8"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="auth-input-wrapper">
              <label htmlFor="signup-confirm-password" className="auth-label">Confirm Password *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.confirmPassword ? 'border-red-400' : ''}`}>
                <FiLock className="text-gray-400 mr-2" />
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className="flex-1 bg-transparent outline-none pr-8"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="auth-btn-primary">
              {isLoading ? (
                <div className="auth-loading"><div className="auth-spinner" />Creating account...</div>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
