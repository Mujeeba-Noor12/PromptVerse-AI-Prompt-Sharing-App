


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { login, register as registerUser } from '../api/auth';
import { Link} from 'react-router-dom';   // ✅ added Link

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
    localStorage.setItem("token", data.token);
    authLogin(data.user, data.token);
    navigate("/", { replace: true });
    toast.success("Welcome back!");
  },
  onError: (error) => {
    // Console spam avoid karne ke liye error log remove kar sakte ho
    console.error("❌ Login failed:", error.response?.data);

    const data = error.response?.data;

    if (data?.errors) {
      data.errors.forEach((err) => toast.error(err.msg));
    } else {
      const message = data?.message || "Invalid email or password";
      toast.error(message);
    }
  },
});


  
  const registerMutation = useMutation(registerUser, {
    onSuccess: (data) => {
      authLogin(data.user, data.token);
      navigate('/', { replace: true });
      toast.success('Account created successfully!');
    },
    onError: (error) => {
      const data = error.response?.data;
      if (data?.errors) {
        data.errors.forEach((err) => toast.error(err.msg));
      } else {
        const message = data?.message || 'Registration failed';
        toast.error(message);
      }
    },
  });


  const handleTabChange = (tab) => {
    setActiveTab(tab);
    reset();
  };

  
  const onLoginSubmit = async (formData) => {
  setIsLoading(true);
  try {
    const { email, password } = formData;
    console.log("🚀 Sending login data:", { email, password });
    await loginMutation.mutateAsync({ email, password });
  } catch (err) {
    
  } finally {
    setIsLoading(false);
  }
};


  const onRegisterSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = formData;
      console.log("🚀 Sending register data:", userData);
      await registerMutation.mutateAsync(userData);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-centered">
      <div className="auth-card">
        <h1 className="auth-title">
          {activeTab === 'login' ? 'Sign In' : 'Create Account'}
        </h1>

       
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

        {/* {activeTab === 'login' && (
          <form onSubmit={handleSubmit(onLoginSubmit)} className="auth-input-group">
            <div className="auth-input-wrapper">
              <label htmlFor="login-email" className="auth-label">Email *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white ${errors.email ? 'border-red-400' : ''}`}>
                <FiMail className="text-gray-400 mr-2" />
                <input
                  id="login-email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="guest@example.com"
                />
              </div>
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

            <div className="auth-input-wrapper">
              <label htmlFor="login-password" className="auth-label">Password *</label>
              <div className={`flex items-center border rounded-lg px-3 py-2 bg-white ${errors.password ? 'border-red-400' : ''}`}>
                <FiLock className="text-gray-400 mr-2" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className="flex-1 bg-transparent outline-none"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="auth-btn-primary"
            >
              {isLoading ? "Signing in..." : "Login"}
            </button>
          </form>
        )} */}
        {activeTab === 'login' && (
  <form onSubmit={handleSubmit(onLoginSubmit)} className="auth-input-group">
    <div className="auth-input-wrapper">
      <label htmlFor="login-email" className="auth-label">Email *</label>
      <div className={`pro-input flex items-center border rounded-lg px-3 py-2 bg-white ${errors.email ? 'border-red-400' : ''}`}>
        <FiMail className="text-gray-400 mr-2" />
        <input
          id="login-email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="flex-1 bg-transparent outline-none"
          placeholder="guest@example.com"
        />
      </div>
      {errors.email && <p className="auth-error">{errors.email.message}</p>}
    </div>

    <div className="auth-input-wrapper">
      <label htmlFor="login-password" className="auth-label">Password *</label>
      <div className={`pro-input flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.password ? 'border-red-400' : ''}`}>
        <FiLock className="text-gray-400 mr-2" />
        <input
          id="login-password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { required: 'Password is required' })}
          className="flex-1 bg-transparent outline-none"
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {errors.password && <p className="auth-error">{errors.password.message}</p>}
    </div>

    {/* Forgot Password Link (added here) */}
    <div className="flex items-center justify-between mt-2">
      <Link to="/forgot-password" className="auth-link text-sm">
        Forgot your password?
      </Link>
    </div>

    <button
      type="submit"
      disabled={isLoading}
      className="auth-btn-primary mt-4"
    >
      {isLoading ? "Signing in..." : "Login"}
    </button>
  </form>
)}


     
        {/* {activeTab === 'signup' && (
          <form onSubmit={handleSubmit(onRegisterSubmit)} className="auth-input-group">
         
            <div className="auth-input-wrapper">
              <label htmlFor="signup-username" className="auth-label">Username *</label>
              <input
                id="signup-username"
                type="text"
                {...register('username', { required: 'Username is required' })}
                className="flex-1 bg-transparent outline-none"
                placeholder="Choose a username"
              />
              {errors.username && <p className="auth-error">{errors.username.message}</p>}
            </div>

          
            <div className="auth-input-wrapper">
              <label htmlFor="signup-email" className="auth-label">Email *</label>
              <input
                id="signup-email"
                type="email"
                {...register('email', { required: 'Email is required' })}
                className="flex-1 bg-transparent outline-none"
                placeholder="Enter your email"
              />
              {errors.email && <p className="auth-error">{errors.email.message}</p>}
            </div>

        
            <div className="auth-input-wrapper">
              <label htmlFor="signup-password" className="auth-label">Password *</label>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                {...register('password', { required: 'Password is required' })}
                className="flex-1 bg-transparent outline-none"
                placeholder="Create a password"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.password && <p className="auth-error">{errors.password.message}</p>}
            </div>

        
            <div className="auth-input-wrapper">
              <label htmlFor="signup-confirm-password" className="auth-label">Confirm Password *</label>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) => value === password || 'Passwords do not match',
                })}
                className="flex-1 bg-transparent outline-none"
                placeholder="Confirm password"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
              {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading} className="auth-btn-primary">
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>
        )} */}
        {activeTab === 'signup' && (
  <form onSubmit={handleSubmit(onRegisterSubmit)} className="auth-input-group">
    
    {/* Username */}
    <div className="auth-input-wrapper">
      <label htmlFor="signup-username" className="auth-label">Username *</label>
      <div className={`pro-input flex items-center border rounded-lg px-3 py-2 bg-white ${errors.username ? 'border-red-400' : ''}`}>
        <FiUser className="text-gray-400 mr-2" />
        <input
          id="signup-username"
          type="text"
          {...register('username', { required: 'Username is required' })}
          className="flex-1 bg-transparent outline-none"
          placeholder="Choose a username"
        />
      </div>
      {errors.username && <p className="auth-error">{errors.username.message}</p>}
    </div>

    {/* Email */}
    <div className="auth-input-wrapper">
      <label htmlFor="signup-email" className="auth-label">Email *</label>
      <div className={`pro-input flex items-center border rounded-lg px-3 py-2 bg-white ${errors.email ? 'border-red-400' : ''}`}>
        <FiMail className="text-gray-400 mr-2" />
        <input
          id="signup-email"
          type="email"
          {...register('email', { required: 'Email is required' })}
          className="flex-1 bg-transparent outline-none"
          placeholder="Enter your email"
        />
      </div>
      {errors.email && <p className="auth-error">{errors.email.message}</p>}
    </div>

    {/* Password */}
    <div className="auth-input-wrapper">
      <label htmlFor="signup-password" className="auth-label">Password *</label>
      <div className={`pro-input flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.password ? 'border-red-400' : ''}`}>
        <FiLock className="text-gray-400 mr-2" />
        <input
          id="signup-password"
          type={showPassword ? 'text' : 'password'}
          {...register('password', { required: 'Password is required' })}
          className="flex-1 bg-transparent outline-none"
          placeholder="Create a password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {errors.password && <p className="auth-error">{errors.password.message}</p>}
    </div>

    {/* Confirm Password */}
    <div className="auth-input-wrapper">
      <label htmlFor="signup-confirm-password" className="auth-label">Confirm Password *</label>
      <div className={`pro-input flex items-center border rounded-lg px-3 py-2 bg-white relative ${errors.confirmPassword ? 'border-red-400' : ''}`}>
        <FiLock className="text-gray-400 mr-2" />
        <input
          id="signup-confirm-password"
          type={showConfirmPassword ? 'text' : 'password'}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
          className="flex-1 bg-transparent outline-none"
          placeholder="Confirm password"
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute right-3 text-gray-400 hover:text-gray-600"
        >
          {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {errors.confirmPassword && <p className="auth-error">{errors.confirmPassword.message}</p>}
    </div>

    <button type="submit" disabled={isLoading} className="auth-btn-primary mt-4">
      {isLoading ? "Creating account..." : "Create account"}
    </button>
  </form>
)}

      </div>
    </div>
  );
};

export default Auth;
