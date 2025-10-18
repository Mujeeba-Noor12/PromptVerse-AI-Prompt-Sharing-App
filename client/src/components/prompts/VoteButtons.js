

// // // import React from 'react';
// // // import { useMutation, useQueryClient } from 'react-query';
// // // import { votePrompt } from '../../api/prompts';
// // // import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
// // // import { useAuth } from '../../contexts/AuthContext';
// // // import toast from 'react-hot-toast';

// // // const VoteButtons = ({ prompt, size = 'md', onRefresh }) => {
// // //   const { user } = useAuth();
// // //   const queryClient = useQueryClient();

// // //   const voteMutation = useMutation(
// // //     ({ promptId, voteType }) => votePrompt(promptId, voteType),
// // //     {
// // //       onSuccess: (updatedPrompt) => {
// // //         queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
// // //         queryClient.invalidateQueries(['prompts']);
// // //         queryClient.invalidateQueries(['bookmarkedPrompts']);

// // //         toast.success('Vote recorded!');
// // //         onRefresh?.(); 
// // //       },
// // //       onError: (error) => {
// // //         const message = error.response?.data?.message || 'Failed to vote';
// // //         toast.error(message);
// // //       },
// // //     }
// // //   );

// // //   const handleVote = (voteType) => {
// // //     if (!user) {
// // //       toast.error('Please login to vote');
// // //       return;
// // //     }

// // //     voteMutation.mutate({ promptId: prompt._id, voteType });
// // //   };

// // //   const userVote = prompt.getUserVote?.(user?._id) || 
// // //     (prompt.upvotes?.includes(user?._id) ? 'upvote' :
// // //      prompt.downvotes?.includes(user?._id) ? 'downvote' : null);

// // //   const iconSizes = {
// // //     sm: 'w-4 h-4',
// // //     md: 'w-5 h-5',
// // //     lg: 'w-6 h-6'
// // //   };

// // //   return (
// // //     <div className="flex items-center space-x-2">
// // //       <button
// // //         onClick={() => handleVote('upvote')}
// // //         disabled={voteMutation.isLoading}
// // //         className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
// // //           userVote === 'upvote'
// // //             ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
// // //             : 'text-gray-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20'
// // //         } ${voteMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
// // //       >
// // //         <FiThumbsUp className={iconSizes[size]} />
// // //       </button>

// // //       <button
// // //         onClick={() => handleVote('downvote')}
// // //         disabled={voteMutation.isLoading}
// // //         className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
// // //           userVote === 'downvote'
// // //             ? 'text-red-600 bg-red-100 dark:bg-red-900/30'
// // //             : 'text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
// // //         } ${voteMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
// // //       >
// // //         <FiThumbsDown className={iconSizes[size]} />
// // //       </button>
// // //     </div>
// // //   );
// // // };

// // // export default VoteButtons;
// // //
// // import React, { useState } from 'react';
// // import { useMutation, useQueryClient } from 'react-query';
// // import { votePrompt } from '../../api/prompts';
// // import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
// // import { useAuth } from '../../contexts/AuthContext';
// // import toast from 'react-hot-toast';

// // const VoteButtons = ({ prompt, size = 'md', onRefresh }) => {
// //   const { user } = useAuth();
// //   const queryClient = useQueryClient();

// //   const [localVote, setLocalVote] = useState(
// //     user ? (prompt.upvotes?.includes(user._id) ? 'upvote' : prompt.downvotes?.includes(user._id) ? 'downvote' : null) : null
// //   );

// //   const voteMutation = useMutation(
// //     ({ promptId, voteType }) => votePrompt(promptId, voteType),
// //     {
// //       onSuccess: (updatedPrompt) => {
// //         queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
// //         queryClient.invalidateQueries(['prompts']);
// //         queryClient.invalidateQueries(['bookmarkedPrompts']);
// //         toast.success('Vote recorded!');
// //         onRefresh?.();
// //       },
// //       onError: () => {
// //         toast.error('Failed to vote');
// //         // Revert local vote on error
// //         setLocalVote(prev => prev);
// //       },
// //     }
// //   );

// //   const handleVote = (voteType) => {
// //     if (!user) return toast.error('Please login to vote');

// //     // Toggle vote locally
// //     setLocalVote(prev => (prev === voteType ? null : voteType));
// //     voteMutation.mutate({ promptId: prompt._id, voteType });
// //   };

// //   const iconSizes = {
// //     sm: 'w-4 h-4',
// //     md: 'w-5 h-5',
// //     lg: 'w-6 h-6'
// //   };

// //   return (
// //     <div className="flex items-center space-x-2">
// //       <button
// //         onClick={() => handleVote('upvote')}
// //         className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
// //           localVote === 'upvote'
// //             ? 'text-green-600 '
// //             : 'text-gray-500 '
// //         }`}
// //       >
// //         <FiThumbsUp className={iconSizes[size]} />
// //       </button>

// //       <button
// //         onClick={() => handleVote('downvote')}
// //         className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
// //           localVote === 'downvote'
// //             ? 'text-red-600 '
// //             : 'text-gray-500'
// //         }`}
// //       >
// //         <FiThumbsDown className={iconSizes[size]} />
// //       </button>
// //     </div>
// //   );
// // };

// // export default VoteButtons;

// import React, { useState, useEffect } from 'react';
// import { useMutation, useQueryClient } from 'react-query';
// import { votePrompt } from '../../api/prompts';
// import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi';
// import { useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';

// const VoteButtons = ({ prompt, size = 'md', onRefresh }) => {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   // Local vote state (like/dislike/null)
//   const [localVote, setLocalVote] = useState(null);
//   const [upvoteCount, setUpvoteCount] = useState(prompt.upvotes?.length || 0);
//   const [downvoteCount, setDownvoteCount] = useState(prompt.downvotes?.length || 0);

//   // Sync local vote from prompt when component mounts or prompt/user changes
//   useEffect(() => {
//     if (user) {
//       if (prompt.upvotes?.includes(user._id)) {
//         setLocalVote('upvote');
//       } else if (prompt.downvotes?.includes(user._id)) {
//         setLocalVote('downvote');
//       } else {
//         setLocalVote(null);
//       }
//     } else {
//       setLocalVote(null);
//     }

//     setUpvoteCount(prompt.upvotes?.length || 0);
//     setDownvoteCount(prompt.downvotes?.length || 0);
//   }, [prompt, user]);

//   const voteMutation = useMutation(
//     ({ promptId, voteType }) => votePrompt(promptId, voteType),
//     {
//       onMutate: async ({ voteType }) => {
//         // Optimistic update
//         setUpvoteCount(prev => {
//           if (localVote === 'upvote') return prev - 1;
//           if (voteType === 'upvote') return prev + 1;
//           return prev;
//         });
//         setDownvoteCount(prev => {
//           if (localVote === 'downvote') return prev - 1;
//           if (voteType === 'downvote') return prev + 1;
//           return prev;
//         });
//       },
//       onSuccess: (updatedPrompt) => {
//         queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
//         queryClient.invalidateQueries(['prompts']);
//         queryClient.invalidateQueries(['bookmarkedPrompts']);
//         toast.success('Vote recorded!');
//         onRefresh?.();
//       },
//       onError: () => {
//         toast.error('Failed to vote');
//       },
//     }
//   );

//   const handleVote = (voteType) => {
//     if (!user) return toast.error('Please login to vote');

//     const newVote = localVote === voteType ? null : voteType;
//     setLocalVote(newVote);
//     voteMutation.mutate({ promptId: prompt._id, voteType: newVote });
//   };

//   const iconSizes = {
//     sm: 'w-4 h-4',
//     md: 'w-5 h-5',
//     lg: 'w-6 h-6'
//   };

//   return (
//     <div className="flex items-center space-x-4">
//       <button
//         onClick={() => handleVote('upvote')}
//         className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
//           localVote === 'upvote' ? 'text-green-600' : 'text-gray-500'
//         }`}
//       >
//         <FiThumbsUp className={iconSizes[size]} />
//         <span className="text-sm">{upvoteCount}</span>
//       </button>

//       <button
//         onClick={() => handleVote('downvote')}
//         className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-colors ${
//           localVote === 'downvote' ? 'text-red-600' : 'text-gray-500'
//         }`}
//       >
//         <FiThumbsDown className={iconSizes[size]} />
//         <span className="text-sm">{downvoteCount}</span>
//       </button>
//     </div>
//   );
// };

// export default VoteButtons;
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { votePrompt } from '../../api/prompts';
import { FiThumbsUp, FiThumbsDown } from 'react-icons/fi'; // outline
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa'; // filled
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const VoteButtons = ({ prompt, size = 'md', onRefresh }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [localVote, setLocalVote] = useState(null);
  const [upvoteCount, setUpvoteCount] = useState(prompt.upvotes?.length || 0);
  const [downvoteCount, setDownvoteCount] = useState(prompt.downvotes?.length || 0);

  useEffect(() => {
    if (user) {
      if (prompt.upvotes?.includes(user._id)) {
        setLocalVote('upvote');
      } else if (prompt.downvotes?.includes(user._id)) {
        setLocalVote('downvote');
      } else {
        setLocalVote(null);
      }
    } else {
      setLocalVote(null);
    }

    setUpvoteCount(prompt.upvotes?.length || 0);
    setDownvoteCount(prompt.downvotes?.length || 0);
  }, [prompt, user]);

  const voteMutation = useMutation(
    ({ promptId, voteType }) => votePrompt(promptId, voteType),
    {
      onMutate: async ({ voteType }) => {
        setUpvoteCount(prev => {
          if (localVote === 'upvote') return prev - 1;
          if (voteType === 'upvote') return prev + 1;
          return prev;
        });
        setDownvoteCount(prev => {
          if (localVote === 'downvote') return prev - 1;
          if (voteType === 'downvote') return prev + 1;
          return prev;
        });
      },
      onSuccess: (updatedPrompt) => {
        queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
        queryClient.invalidateQueries(['prompts']);
        queryClient.invalidateQueries(['bookmarkedPrompts']);
        toast.success('Vote recorded!');
        onRefresh?.();
      },
      onError: () => {
        toast.error('Failed to vote');
      },
    }
  );

  const handleVote = (voteType) => {
    if (!user) return toast.error('Please login to vote');

    const newVote = localVote === voteType ? null : voteType;
    setLocalVote(newVote);
    voteMutation.mutate({ promptId: prompt._id, voteType: newVote });
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={() => handleVote('upvote')}
        className="flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-gray-700"
      >
        {localVote === 'upvote' ? (
          <FaThumbsUp className={`text-gray-600 ${iconSizes[size]}`} />
        ) : (
          <FiThumbsUp className={`text-gray-500 ${iconSizes[size]}`} />
        )}
      </button>

      <button
        onClick={() => handleVote('downvote')}
        className="flex items-center space-x-1 px-2 py-1 rounded-md transition-colors text-gray-700"
      >
        {localVote === 'downvote' ? (
          <FaThumbsDown className={`text-gray-600 ${iconSizes[size]}`} />
        ) : (
          <FiThumbsDown className={`text-gray-500 ${iconSizes[size]}`} />
        )}
      </button>
    </div>
  );
};

export default VoteButtons;
