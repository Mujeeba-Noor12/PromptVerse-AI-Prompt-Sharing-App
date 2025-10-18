import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { register as registerUser } from '../api/auth';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
    
      const { confirmPassword, ...userData } = data;
      await registerMutation.mutateAsync(userData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-centered">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>
        <form className="auth-input-group" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div className="auth-input-wrapper">
            <label htmlFor="username" className="auth-label">
              Username
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
              <span className="pl-3 text-gray-400 flex items-center">
                <FiUser className="h-5 w-5" />
              </span>
              <input
                id="username"
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
                    message: 'Username can only contain letters, numbers, and underscores',
                  },
                })}
                className={`flex-1 bg-transparent border-0 focus:ring-0 py-3 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-lg ${errors.username ? 'border-red-300' : ''}`}
                placeholder="Choose a username"
              />
            </div>
            {errors.username && (
              <p className="auth-error">{errors.username.message}</p>
            )}
          </div>

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
                autoComplete="new-password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`flex-1 bg-transparent border-0 focus:ring-0 py-3 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-lg ${errors.password ? 'border-red-300' : ''}`}
                placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div className="auth-input-wrapper">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm Password
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-blue-500 transition-all duration-200">
              <span className="pl-3 text-gray-400 flex items-center">
                <FiLock className="h-5 w-5" />
              </span>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
                className={`flex-1 bg-transparent border-0 focus:ring-0 py-3 px-3 text-gray-900 dark:text-gray-100 placeholder-gray-400 rounded-lg ${errors.confirmPassword ? 'border-red-300' : ''}`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                className="pr-3 text-gray-400 hover:text-gray-600 flex items-center bg-transparent border-0 focus:outline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="auth-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="auth-btn-primary mt-2"
          >
            {isLoading ? (
              <span className="auth-loading"><span className="auth-spinner"></span>Creating account...</span>
            ) : (
              'Create account'
            )}
          </button>

          <div className="text-center mt-6">
            <p className="text-sm pro-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="auth-link"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;