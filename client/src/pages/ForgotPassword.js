import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { forgotPassword } from '../api/auth';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const forgotPasswordMutation = useMutation(forgotPassword, {
    onSuccess: () => {
      setIsEmailSent(true);
      toast.success('Password reset email sent!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await forgotPasswordMutation.mutateAsync(data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6">
              <FiCheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Check Your Email
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              We've sent you a password reset link. Please check your email and click the link to reset your password.
            </p>
            <div className="space-y-4">
              <Link
                to="/login"
                className="btn-primary w-full flex items-center justify-center"
              >
                <FiArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='auth-centered'>
  {/* // <div className="min-h-screen flex   py-12 px-4 sm:px-6 lg:px-8"> */}
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-800">
      <div className="max-w-md w-full space-y-8">
        <div>
          <Link
            to="/login"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-6"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <FiMail className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              Forgot Password?
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Email address
            </label>
             <div className="relative">
  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
    <FiMail className="h-5 w-5 text-gray-400" />
  </div>
  <input
  id="email"
  type="email"
  autoComplete="email"
  {...register("email", {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Invalid email address",
    },
  })}
  className={`block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm pl-12 py-2 ${
    errors.email ? "border-red-300" : ""
  }`}
  placeholder="Enter your email"
/>

</div>


            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                to="/login"
                className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
);

};

export default ForgotPassword; 