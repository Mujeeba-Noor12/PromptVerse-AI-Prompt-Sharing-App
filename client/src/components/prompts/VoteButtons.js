

import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { votePrompt } from '../../api/prompts';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const VoteButtons = ({ prompt, size = 'md', onRefresh }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const voteMutation = useMutation(
    ({ promptId, voteType }) => votePrompt(promptId, voteType),
    {
      onSuccess: (updatedPrompt) => {
        queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
        queryClient.invalidateQueries(['prompts']);
        queryClient.invalidateQueries(['bookmarkedPrompts']);

        toast.success('Vote recorded!');
        onRefresh?.(); // ✅ call refresh to update UI
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to vote';
        toast.error(message);
      },
    }
  );

  const handleVote = (voteType) => {
    if (!user) {
      toast.error('Please login to vote');
      return;
    }

    voteMutation.mutate({ promptId: prompt._id, voteType });
  };

  const userVote = prompt.getUserVote?.(user?._id) || 
    (prompt.upvotes?.includes(user?._id) ? 'upvote' :
     prompt.downvotes?.includes(user?._id) ? 'downvote' : null);

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => handleVote('upvote')}
        disabled={voteMutation.isLoading}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
          userVote === 'upvote'
            ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
            : 'text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
        } ${voteMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <FiThumbsUp className={iconSizes[size]} />
      </button>

      <button
        onClick={() => handleVote('downvote')}
        disabled={voteMutation.isLoading}
        className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
          userVote === 'downvote'
            ? 'text-red-600 bg-red-100 dark:bg-red-900/30'
            : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
        } ${voteMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <FiThumbsDown className={iconSizes[size]} />
      </button>
    </div>
  );
};

export default VoteButtons;
