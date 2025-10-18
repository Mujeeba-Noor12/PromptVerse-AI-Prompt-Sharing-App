


import React from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from 'react-query';
import { toggleLike, usePrompt } from '../../api/prompts';
import { useAuth } from '../../contexts/AuthContext';
import { FiCopy, FiEye, FiTrendingUp, FiUser, FiClock, FiHeart, FiThumbsUp } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import VoteButtons from './VoteButtons';
import BookmarkButton from './BookmarkButton';
import toast from 'react-hot-toast';


const AI_URLS = {
  chatgpt: 'https://chat.openai.com',
  claude: 'https://claude.ai',
  dalle: 'https://openai.com/dall-e',
  midjourney: 'https://www.midjourney.com/app',
  bard: 'https://bard.google.com',
  gemini: 'https://gemini.google.com',
  other: 'https://www.perplexity.ai'
};

const PromptCard = ({ prompt, onBookmarkToggle, onRefresh }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Use prompt mutation
  const usePromptMutation = useMutation(usePrompt, {
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts']);
      queryClient.invalidateQueries(['bookmarkedPrompts']);
      if (onRefresh) onRefresh();
      // toast.success('Usage count updated');
    },
    onError: () => {
      toast.error('Failed to update usage count');
    }
  });

  // Like mutation
  const likeMutation = useMutation(() => toggleLike(prompt._id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts']);
      queryClient.invalidateQueries(['likedPrompts']);
      if (onRefresh) onRefresh();
    },
    onError: () => {
      toast.error('Failed to toggle like');
    }
  });

  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.content);
      toast.success('Prompt copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy prompt');
    }
  };

  
 const handleUse = async () => {
  try {
   
    await navigator.clipboard.writeText(prompt.content);
    toast.success('Prompt copied! Paste in the AI tool.');

   
    usePromptMutation.mutate(prompt._id);

   
    setTimeout(() => {
      const toolKey = prompt.category?.toLowerCase();
      const url = AI_URLS[toolKey] || AI_URLS.other;
      window.open(url, '_blank');
    }, 500); 

  } catch (err) {
    toast.error('Failed to use prompt');
  }
};





  const handleLike = () => {
    if (!isAuthenticated) {
      return toast.error('You must be logged in to like prompts');
    }
    likeMutation.mutate();
  };

  // const isLiked = prompt.likes?.includes(user?._id);
  const userId = user?._id || user?.id;  // id ya _id dono check kare
const isLiked = prompt.likes?.includes(userId);


// Step 1: IDs ko string me convert
// const userId = String(user?._id || user?.id);
const authorId = String(prompt.author?._id || prompt.author?.id);

// Step 2: Author check
const isAuthor = user && userId === authorId;

  
  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now - date; // milliseconds
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
};


  const getCategoryColor = (category) => {
    const colors = {
      chatgpt: 'bg-green-100 text-green-800',
      midjourney: 'bg-purple-100 text-purple-800',
      dalle: 'bg-blue-100 text-blue-800',
      bard: 'bg-yellow-100 text-yellow-800',
      claude: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  };

  return (
    <div className="pro-card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            to={`/prompts/${prompt._id}`}
            className="text-lg font-semibold pro-text-primary  transition-colors line-clamp-2"
          >
            {prompt.title}
          </Link>
          <div className="flex items-center space-x-2 mt-1">
          
<Link
  to={`/user/${prompt.author.username}`}
  className="flex items-center space-x-1 text-sm pro-text-secondary  transition-colors"
>
  <FiUser className="w-3 h-3" />
  
<span>
  {isAuthor ? 'You' : prompt.author?.username || 'Unknown'}
</span>


</Link>


            <span className="text-gray-400">•</span>
            <span className="flex items-center space-x-1 text-sm pro-text-muted">
              <FiClock className="w-3 h-3" />
              <span>{formatDate(prompt.createdAt)}</span>
            </span>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
            prompt.category
          )}`}
        >
          {prompt.category}
        </span>
      </div>

      <div className="mb-4">
        <p className="pro-text-secondary line-clamp-3 mb-3">
          {prompt.description || prompt.content}
        </p>
        {prompt.tags && prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {prompt.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
            {prompt.tags.length > 3 && (
              <span className="text-xs pro-text-muted">
                +{prompt.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      
      <div className="flex items-center justify-between text-sm pro-text-muted mb-4">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <FiEye className="w-4 h-4" />
            <span>{prompt.views}</span>
          </span>
          <span className="flex items-center space-x-1">
            <FiTrendingUp className="w-4 h-4" />
            <span>{prompt.usageCount}</span>
          </span>

          
<span className="flex items-center space-x-1 text-gray-600">
  <FiThumbsUp className="w-4 h-4 text-gray-600" />
  <span>{prompt.upvotes?.length || 0}</span>
</span>

  <span className="flex items-center space-x-1 text-gray-600">
    <FiHeart className="w-4 h-4 text-gray-600" />
    <span>{prompt.likes?.length || 0}</span>
  </span>
        </div>
      </div>

      
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm pro-text-secondary  dark:hover:bg-gray-700 dark:text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Copy prompt"
          >
            <FiCopy className="w-4 h-4" />
            <span>Copy</span>
          </button>
          <button
            onClick={handleUse}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm pro-text-secondary  dark:hover:bg-gray-700 hover:text-green-600 dark:text-gray-400 hover:bg-green-50  dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Use prompt in AI tool"
          >
            <FiTrendingUp className="w-4 h-4" />
            <span>Use</span>
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <VoteButtons prompt={prompt} size="sm" onRefresh={onRefresh} />
          <BookmarkButton
            prompt={prompt}
            size="sm"
            onBookmarkToggle={onBookmarkToggle}
          />
          <button
            onClick={handleLike}
            className={`flex items-center space-x-1 px-2 py-1 text-sm ${
              isLiked ? 'text-red-600' : 'text-gray-500'
            } hover:text-red-600 transition-colors`}
            title="Like this prompt"
          >
            {isLiked ? <FaHeart className="w-4 h-4" /> : <FiHeart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;
