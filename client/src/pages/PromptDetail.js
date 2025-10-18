import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {  getPrompt,usePrompt, deletePrompt } from '../api/prompts';
import { useAuth } from '../contexts/AuthContext';
import { FiCopy, FiEye, FiTrendingUp, FiUser, FiClock, FiEdit, FiTrash2, FiArrowLeft } from 'react-icons/fi';

import CommentsSection from '../components/comments/CommentsSection';
import toast from 'react-hot-toast';

const PromptDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();


  const AI_URLS = {
  chatgpt: 'https://chat.openai.com',
  claude: 'https://claude.ai',
  dalle: 'https://openai.com/dall-e',
  midjourney: 'https://www.midjourney.com/app',
  bard: 'https://bard.google.com',
  gemini: 'https://gemini.google.com',
  other: 'https://www.perplexity.ai'
};

  const { data: prompt, isLoading, error } = useQuery(
    ['prompt', id],
    () => getPrompt(id)
  );

  const usePromptMutation = useMutation(usePrompt, {
    onSuccess: () => {
      queryClient.invalidateQueries(['prompt', id]);
      toast.success('Usage count updated');
    },
    onError: () => {
      toast.error('Failed to update usage count');
    },
  });

  const deleteMutation = useMutation(deletePrompt, {
    onSuccess: () => {
      queryClient.invalidateQueries(['prompts']);
      toast.success('Prompt deleted successfully');
      navigate('/');
    },
    onError: () => {
      toast.error('Failed to delete prompt');
    },
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

 
    usePromptMutation.mutate(id);

 
    setTimeout(() => {
      const toolKey = prompt.category?.toLowerCase();
      const url = AI_URLS[toolKey] || AI_URLS.other;
      window.open(url, '_blank');
    }, 500);

  } catch (err) {
    toast.error('Failed to use prompt');
  }
};

  const handleEdit = () => {
    navigate(`/prompts/${id}/edit`);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      deleteMutation.mutate(id);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      chatgpt: 'bg-green-100 text-green-800',
      midjourney: 'bg-purple-100 text-purple-800',
      dalle: 'bg-blue-100 text-blue-800',
      bard: 'bg-yellow-100 text-yellow-800',
      claude: 'bg-orange-100 text-orange-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-red-600 text-lg mb-4">Error loading prompt</div>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12 prompt-bar">
        <div className="text-gray-600 text-lg mb-4">Prompt not found</div>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Back
        </button>
      </div>
    );
  }
 
  console.log("User:", user);
console.log("Prompt Author:", prompt.author);
const isAuthor =
  (user?.id && prompt.author && (user.id === prompt.author._id || user.id === prompt.author));

  
  // const isAuthor = user?._id && prompt.author && user._id === prompt.author._id;

  return (
    <div className="max-w-4xl mx-auto">
      
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FiArrowLeft className="w-4 h-4 prompt-bar" />
          <span className='prompt-bar'>Back</span>
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 prompt-bar">{prompt.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 prompt-bar">
              {user && prompt.author && (
                <Link
                  to={`/user/${prompt.author.username}`}
                  className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
                >
                  <FiUser className="w-4 h-4" />
                  <span>
  {prompt.author.username}
  {user?.id === prompt.author._id || user?.id === prompt.author ? " (You)" : ""}
</span>

                 
                </Link>
              )}
              <span className="flex items-center space-x-1">
                <FiClock className="w-4 h-4" />
                <span>{formatDate(prompt.createdAt)}</span>
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(prompt.category)}`}>
                {prompt.category}
              </span>
            </div>
          </div>

          {isAuthor && (
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                <FiEdit className="w-4 h-4 prompt-bar" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-1.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

     
      <div className="pro-card mb-6">
        {prompt.description && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 dark:text-gray-300">{prompt.description}</p>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Prompt</h3>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200 font-mono text-sm">
              {prompt.content}
            </pre>
          </div>
        </div>

        {prompt.tags && prompt.tags.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {prompt.tags.map((tag, index) => (
                <span key={index} className="tag">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-1">
              <FiEye className="w-4 h-4" />
              <span>{prompt.views} views</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiTrendingUp className="w-4 h-4" />
              <span>{prompt.usageCount} uses</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="font-medium">
                {prompt.voteCount > 0 ? '+' : ''}{prompt.voteCount}
              </span> 
               <span>votes</span>
            </span>
          

            
          </div>
        </div>

   
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiCopy className="w-4 h-4" />
              <span>Copy Prompt</span>
            </button>
            <button
             onClick={handleUse}
              className="flex items-center space-x-1 px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiTrendingUp className="w-4 h-4" />
              <span>Mark as Used</span>
            </button>
          </div>
        
        </div>
      </div>

   
      <CommentsSection promptId={id} />
    </div>
  );
};

export default PromptDetail; 