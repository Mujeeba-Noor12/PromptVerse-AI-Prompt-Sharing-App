
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { getUserProfile } from '../api/prompts';
import PromptCard from '../components/prompts/PromptCard';
import { FiFileText, FiEye, FiHeart } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();

  const { data, isLoading, error } = useQuery(
    ['userProfile', username],
    () => getUserProfile(username)
  );

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-red-600 text-lg mb-4">Error loading user profile</div>
        <div className="text-gray-600">User not found or profile is private</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-gray-600 text-lg mb-4">User not found</div>
      </div>
    );
  }

  const { user, prompts, stats } = data;

  return (
    <div className="max-w-4xl mx-auto">
    
      <div className="pro-card mb-8">
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl prompt-bar">
              {user.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 prompt-bar">{user.username}</h1>
            {user.bio && (
              <p className="text-gray-600 mb-4 prompt-bar ">{user.bio}</p>
            )}
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <FiFileText className="w-4 h-4" />
                <span>{stats.totalPrompts} prompts</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiEye className="w-4 h-4" />
                <span>{stats.totalViews} views</span>
              </div>
              <div className="flex items-center space-x-1">
                <FiHeart className="w-4 h-4" />
                <span>{stats.totalLikes} likes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

  
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 prompt-bar">
  Prompts by{' '}
  <span className="text-blue-600">
    {currentUser && (currentUser._id === user._id || currentUser.id === user._id)
      ? 'You'
      : user.username}
  </span>
</h2>


        {prompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {prompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4 prompt-bar">No prompts yet</div>
            <p className="text-gray-600 prompt-bar">This user hasn't shared any prompts yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
