
// import React from 'react';
// import { useMutation, useQueryClient } from 'react-query';
// import { toggleBookmark } from '../../api/prompts';
// import { FiBookmark } from 'react-icons/fi';
// import { FaBookmark } from 'react-icons/fa';

// import { useAuth } from '../../contexts/AuthContext';
// import toast from 'react-hot-toast';

// const BookmarkButton = ({ prompt, size = 'md', onBookmarkToggle }) => {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const bookmarkMutation = useMutation(
//     (promptId) => toggleBookmark(promptId),
//     {
//       onSuccess: (updatedPrompt) => {
//         queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
//         queryClient.invalidateQueries(['prompts']);
//         queryClient.invalidateQueries(['bookmarkedPrompts']);
//         queryClient.invalidateQueries(['likedPrompts']);       // ✅ liked page


//         const isBookmarked = updatedPrompt.bookmarks?.some(id => id === user?._id);

//         if (!isBookmarked) {
//           onBookmarkToggle(prompt._id);
//         }

        
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
//     lg: 'w-6 h-6',
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
//       {/* <FiBookmark
//         className={`${iconSizes[size]} ${isBookmarked ? 'fill-current' : ''}`}
//       />
//       <span className="text-sm font-medium">
      
//       </span> */}
//       {isBookmarked ? (
//         <FaBookmark className={`${iconSizes[size]} text-blue-600`} />
//       ) : (
//         <FiBookmark className={`${iconSizes[size]} text-gray-500`} />
//       )}

//     </button>
//   );
// };

// export default BookmarkButton;
////
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { toggleBookmark } from '../../api/prompts';
import { FiBookmark } from 'react-icons/fi';
import { FaBookmark } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BookmarkButton = ({ prompt, size = 'md', onBookmarkToggle }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (user && prompt?.bookmarks) {
      setIsBookmarked(
        prompt.bookmarks.some(
          (id) =>
            id.toString?.() === user?._id?.toString() ||
            id?._id?.toString?.() === user?._id?.toString()
        )
      );
    }
  }, [prompt, user]);

  const bookmarkMutation = useMutation((promptId) => toggleBookmark(promptId), {
    onSuccess: (updatedPrompt) => {
      queryClient.setQueryData(['prompt', prompt._id], updatedPrompt);
      queryClient.invalidateQueries(['prompts']);
      queryClient.invalidateQueries(['bookmarkedPrompts']);

      const nowBookmarked = updatedPrompt.bookmarks?.some(
        (id) =>
          id.toString?.() === user?._id?.toString() ||
          id?._id?.toString?.() === user?._id?.toString()
      );

      setIsBookmarked(nowBookmarked);

      if (!nowBookmarked && onBookmarkToggle) {
        onBookmarkToggle(prompt._id);
      }
    },
  });

  const handleBookmark = () => {
    if (!user) {
      toast.error('Please login to bookmark prompts');
      return;
    }
    setIsBookmarked((prev) => !prev); // instant UI feedback
    bookmarkMutation.mutate(prompt._id);
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleBookmark}
      disabled={bookmarkMutation.isLoading}
      className={`flex items-center px-2 py-1  ${
        isBookmarked
          ? 'text-blue-600'
          : 'text-gray-500  '
      } ${bookmarkMutation.isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
    >
      {isBookmarked ? (
        <FaBookmark
          className={`${iconSizes[size]} `}
        />
      ) : (
        <FiBookmark className={`${iconSizes[size]}`} />
      )}
    </button>
  );
};

export default BookmarkButton;

