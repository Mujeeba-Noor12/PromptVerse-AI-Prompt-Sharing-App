
import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { updateProfile } from '../api/auth';

import { getUserPrompts } from '../api/prompts';
import { useAuth } from '../contexts/AuthContext';


import { FiUser, FiMail, FiEdit2, FiSave, FiX,FiEye, FiHeart, FiBarChart2,FiFileText } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      bio: user?.bio || '',
    },
  });

  // Fetch prompts created by user
  const { data: prompts = [], isLoading: isPromptsLoading } = useQuery(
    ['myPrompts'],
    getUserPrompts
  );
const safePrompts = Array.isArray(prompts?.prompts) ? prompts.prompts : [];


const totalViews = safePrompts.reduce((sum, p) => sum + (p?.views || 0), 0);
const totalLikes = safePrompts.reduce((sum, p) => sum + ((p?.likes?.length) || 0), 0);
const totalUsage = safePrompts.reduce((sum, p) => sum + (p?.usageCount || 0), 0);

  

  const updateMutation = useMutation(updateProfile, {
    onSuccess: (data) => {
      updateUser(data.user);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });

  const onSubmit = async (data) => {
    await updateMutation.mutateAsync(data);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 prompt-bar">Profile Settings</h1>
        <p className="text-gray-600 prompt-bar">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="lg:col-span-2 ">
          <div className="pro-card">
            <div className="flex items-center justify-between mb-6 ">
              <h2 className="text-xl font-semibold text-gray-900 prompt-bar">Profile Information</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2 prompt-bar">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="h-5 w-5 text-gray-400 prompt-bar" />
                    </div>
                    <input
                      type="text"
                      id="username"
                      {...register('username', {
                        required: 'Username is required',
                        minLength: { value: 3, message: 'Username must be at least 3 characters' },
                        maxLength: { value: 30, message: 'Username must be less than 30 characters' },
                        pattern: {
                          value: /^[a-zA-Z0-9_]+$/,
                          message: 'Username can only contain letters, numbers, and underscores',
                        },
                      })}
                      className={`pl-10 input-field ${errors.username ? 'border-red-300' : ''}`}
                    />
                  </div>
                  {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 prompt-bar">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="pl-10 input-field bg-gray-50"
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 prompt-bar">Email cannot be changed</p>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2 prompt-bar">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    {...register('bio', {
                      maxLength: {
                        value: 500,
                        message: 'Bio must be less than 500 characters',
                      },
                    })}
                    className={`input-field resize-none ${errors.bio ? 'border-red-300' : ''}`}
                    placeholder="Tell us about yourself..."
                  />
                  {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>}
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={updateMutation.isLoading}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {updateMutation.isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <FiSave className="w-4 h-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FiX className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 prompt-bar ">Username</label>
                  <div className="flex items-center space-x-2">
                    <FiUser className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 prompt-bar">{user?.username}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 prompt-bar">Email</label>
                  <div className="flex items-center space-x-2">
                    <FiMail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 prompt-bar">{user?.email}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 prompt-bar">Bio</label>
                  <p className="text-gray-900 prompt-bar">{user?.bio || 'No bio added yet.'}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Stats */}
        <div className="space-y-6">
          <div className="pro-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 prompt-bar">Account Information</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="prompt-bar text-white font-medium text-lg">
                  {user?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="prompt-bar font-medium text-gray-900">{user?.username}</p>
                <p className="text-sm text-gray-600">
                  Member since {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>


          <div className="pro-card">
  <h3 className="text-lg font-semibold text-gray-900 mb-4 prompt-bar">Prompt Stats</h3>
  <div className="space-y-2 text-sm text-gray-700">
    {isPromptsLoading ? (
      <p>Loading prompt stats...</p>
    ) : (
      <>
        <p className="flex items-center gap-2 prompt-bar">
          <FiFileText /> Total Prompts: {safePrompts.length}

  
</p>
        <p className="flex items-center gap-2 prompt-bar">
          <FiEye /> Total Views: {totalViews}
        </p>
        <p className="flex items-center gap-2 prompt-bar">
          <FiHeart /> Total Likes: {totalLikes}
        </p>
        <p className="flex items-center gap-2 prompt-bar">
          <FiBarChart2 /> Total Uses: {totalUsage}
        </p>
      </>
    )}
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
