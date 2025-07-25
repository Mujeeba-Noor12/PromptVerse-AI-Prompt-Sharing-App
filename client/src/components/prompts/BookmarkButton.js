// import React from 'react';
// import { useMutation, useQueryClient } from 'react-query';
// import { toggleBookmark } from '../../api/prompts';
// import { FiBookmark } from 'react-icons/fi';
// import { useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';

// const BookmarkButton = ({ prompt, size = 'md' }) => {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const bookmarkMutation = useMutation(
//     (promptId) => toggleBookmark(promptId),
//     {
//       onSuccess: (updatedPrompt) => {
//         // Update the prompt in the cache
//         queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
//         queryClient.invalidateQueries(['prompts']);
        
//         const isBookmarked = updatedPrompt.bookmarks?.some(id => id === user?._id);
//         toast.success(isBookmarked ? 'Added to bookmarks!' : 'Removed from bookmarks!');
//       },
//       onError: (error) => {
//         const message = error.response?.data?.message || 'Failed to bookmark';
//         toast.error(message);
//       },
//     }
//   );

//   const handleBookmark = () => {
//     if (!user) {
//       toast.error('Please login to bookmark prompts');
//       return;
//     }

//     bookmarkMutation.mutate(prompt._id);
//   };

//   const isBookmarked = prompt.isBookmarkedBy?.(user?._id) || 
//     prompt.bookmarks?.some(id => id === user?._id);

//   const iconSizes = {
//     sm: 'w-4 h-4',
//     md: 'w-5 h-5',
//     lg: 'w-6 h-6'
//   };

//   return (
//     <button
//       onClick={handleBookmark}
//       disabled={bookmarkMutation.isLoading}
//       className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 ${
//         isBookmarked
//           ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
//           : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
//       } ${bookmarkMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
//       title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
//     >
//       <FiBookmark 
//         className={`${iconSizes[size]} ${isBookmarked ? 'fill-current' : ''}`} 
//       />
//       <span className="text-sm font-medium">
//         {prompt.bookmarks?.length || 0}
//       </span>
//     </button>
//   );
// };

// export default BookmarkButton; 
import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toggleBookmark } from '../../api/prompts';
import { FiBookmark } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BookmarkButton = ({ prompt, size = 'md', onBookmarkToggle }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation(
    (promptId) => toggleBookmark(promptId),
    {
      onSuccess: (updatedPrompt) => {
        queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
        queryClient.invalidateQueries(['prompts']);
        queryClient.invalidateQueries(['bookmarkedPrompts']);
        queryClient.invalidateQueries(['likedPrompts']);       // ✅ liked page


        const isBookmarked = updatedPrompt.bookmarks?.some(id => id === user?._id);

        if (!isBookmarked) {
          onBookmarkToggle(prompt._id);
        }

        toast.success(isBookmarked ? 'Added to bookmarks!' : 'Removed from bookmarks!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to bookmark';
        toast.error(message);
      },
    }
  );

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark prompts');
      return;
    }

    bookmarkMutation.mutate(prompt._id);
  };

  const isBookmarked = prompt.isBookmarkedBy?.(user?._id) ||
    prompt.bookmarks?.some(id => id === user?._id);

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={bookmarkMutation.isLoading}
      className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all duration-200 ${
        isBookmarked
          ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
          : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
      } ${bookmarkMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      <FiBookmark
        className={`${iconSizes[size]} ${isBookmarked ? 'fill-current' : ''}`}
      />
      <span className="text-sm font-medium">
        {prompt.bookmarks?.length || 0}
      </span>
    </button>
  );
};

export default BookmarkButton;
