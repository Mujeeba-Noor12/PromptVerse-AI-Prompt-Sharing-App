


// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { getComments, addComment, updateComment, deleteComment, voteComment } from '../../api/prompts';
// import { useAuth } from '../../contexts/AuthContext';
// import { FiMessageSquare, FiEdit2, FiTrash2, FiThumbsUp, FiThumbsDown, FiCornerUpLeft } from 'react-icons/fi';
// import toast from 'react-hot-toast';


// const CommentForm = ({ promptId, parentId = null, onSuccess, onCancel }) => {
//   const [content, setContent] = useState('');
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const addCommentMutation = useMutation(
//     (commentData) => addComment(promptId, commentData),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['comments', promptId]);
//         setContent('');
//         onSuccess?.();
//         toast.success('Comment added successfully!');
//       },
//       onError: (error) => {
//         const message = error.response?.data?.message || 'Failed to add comment';
//         toast.error(message);
//       },
//     }
//   );

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!content.trim()) return;

//     addCommentMutation.mutate({
//       content: content.trim(),
//       parent: parentId
//     });
//   };

//   if (!user) {
//     return (
//       <div className="text-center py-4 text-gray-500">
//         Please login to add a comment
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="mb-4">
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write a comment..."
//         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//         rows="3"
//         disabled={addCommentMutation.isLoading}
//       />
//       <div className="flex justify-end space-x-2 mt-2">
//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             Cancel
//           </button>
//         )}
//         <button
//           type="submit"
//           disabled={!content.trim() || addCommentMutation.isLoading}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {addCommentMutation.isLoading ? 'Posting...' : 'Post Comment'}
//         </button>
//       </div>
//     </form>
//   );
// };

// // // Comment Vote Buttons
// // const CommentVoteButtons = ({ comment, size = 'sm' }) => {
// //   const { user } = useAuth();
// //   const queryClient = useQueryClient();

// //   const voteMutation = useMutation(
// //     ({ commentId, voteType }) => voteComment(commentId, voteType),
// //     {
// //       onSuccess: () => {
// //         queryClient.invalidateQueries(['comments']);
// //         toast.success('Vote recorded!');
// //       },
// //       onError: (error) => {
// //         const message = error.response?.data?.message || 'Failed to vote';
// //         toast.error(message);
// //       },
// //     }
// //   );

//   // const handleVote = (voteType) => {
//   //   if (!user) {
//   //     toast.error('Please login to vote');
//   //     return;
//   //   }

//   //   voteMutation.mutate({ commentId: comment._id, voteType });
//   // };

//   // const userVote = comment.getUserVote?.(user?._id) ||
//   //   (comment.upvotes?.includes(user?._id) ? 'upvote' :
//   //     comment.downvotes?.includes(user?._id) ? 'downvote' : null);

//   // const voteCount = comment.voteCount ||
//   //   (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0);

//   const iconSizes = {
//     sm: 'w-3 h-3',
//     md: 'w-4 h-4',
//     lg: 'w-5 h-5'
//   };

//   return (
//      <div className="flex items-center space-x-3">
     
      

       
    
//     </div>
//   );
// }; 
  


// const CommentItem = ({ comment, promptId, onReply, childComments = [], childCommentMap = {} }) => {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content);

//   const updateCommentMutation = useMutation(
//     (commentData) => updateComment(comment._id, commentData),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['comments']);
//         setIsEditing(false);
//         toast.success('Comment updated successfully!');
//       },
//       onError: (error) => {
//         const message = error.response?.data?.message || 'Failed to update comment';
//         toast.error(message);
//       },
//     }
//   );
  

//   const deleteCommentMutation = useMutation(
//     () => deleteComment(comment._id),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['comments']);
//         toast.success('Comment deleted successfully!');
//       },
//       onError: (error) => {
//         const message = error.response?.data?.message || 'Failed to delete comment';
//         toast.error(message);
//       },
//     }
//   );

//   const handleEdit = (e) => {
//     e.preventDefault();
//     if (!editContent.trim()) return;

//     updateCommentMutation.mutate({ content: editContent.trim() });
//   };

//   const handleDelete = () => {
//     if (window.confirm('Are you sure you want to delete this comment?')) {
//       deleteCommentMutation.mutate();
//     }
//   };

//   const canEdit = user && (comment.author._id === user._id || user.isAdmin);
//   const canDelete = user && (comment.author._id === user._id || user.isAdmin);

//   return (
//     <div className="border-b border-gray-200 dark:border-gray-700 py-4">
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0">
//           <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//             <span className="text-sm font-medium text-gray-600">
//               {comment.author.username?.charAt(0).toUpperCase()}
//             </span>
//           </div>
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center space-x-2 mb-1">
//             <span className="text-sm font-medium text-gray-900 dark:text-white">
//               {comment.author.username}
//             </span>
//             <span className="text-xs text-gray-500">
//               {new Date(comment.createdAt).toLocaleDateString()}
//             </span>
//             {comment.isEdited && (
//               <span className="text-xs text-gray-400">(edited)</span>
//             )}
//           </div>

//           {isEditing ? (
//             <form onSubmit={handleEdit} className="mb-2">
//               <textarea
//                 value={editContent}
//                 onChange={(e) => setEditContent(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows="3"
//                 disabled={updateCommentMutation.isLoading}
//               />
//               <div className="flex justify-end space-x-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                   className="text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!editContent.trim() || updateCommentMutation.isLoading}
//                   className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <p className="text-gray-700 dark:text-gray-300 mb-2">
//               {comment.content}
//             </p>
//           )}

//           <div className="flex items-center space-x-4">
//             <CommentVoteButtons comment={comment} />

//             <button
//               onClick={() => onReply(comment._id)}
//               className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <FiCornerUpLeft className="w-3 h-3" />
//               <span>Reply</span>
//             </button>

//             {canEdit && (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <FiEdit2 className="w-3 h-3" />
//                 <span>Edit</span>
//               </button>
//             )}

//             {canDelete && (
//               <button
//                 onClick={handleDelete}
//                 disabled={deleteCommentMutation.isLoading}
//                 className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-700 transition-colors"
//               >
//                 <FiTrash2 className="w-3 h-3" />
//                 <span>Delete</span>
//               </button>
//             )}
//           </div>

//           {/* Render nested replies */}
//           {childComments.length > 0 && (
//             <div className="pl-6 mt-4 border-l border-gray-200">
//               {childComments.map(child => (
//                 <CommentItem
//                   key={child._id}
//                   comment={child}
//                   promptId={promptId}
//                   onReply={onReply}
//                   childComments={childCommentMap[child._id] || []}
//                   childCommentMap={childCommentMap}
//                 />
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main Comments Section
// const CommentsSection = ({ promptId }) => {
//   const [showCommentForm, setShowCommentForm] = useState(false);
//   const [replyingTo, setReplyingTo] = useState(null);

//   const { data: commentsData, isLoading, error } = useQuery(
//     ['comments', promptId],
//     () => getComments(promptId),
//     {
//       refetchOnWindowFocus: false,
//     }
//   );

//   const handleReply = (commentId) => {
//     setReplyingTo(commentId);
//     setShowCommentForm(true);
//   };

//   const handleCommentSuccess = () => {
//     setShowCommentForm(false);
//     setReplyingTo(null);
//   };

//   if (isLoading) {
//     return (
//       <div className="mt-6">Loading comments...</div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="mt-6 text-red-500">Failed to load comments</div>
//     );
//   }

//   const comments = commentsData?.comments || [];

//   const topLevelComments = comments.filter(c => !c.parent);
//   const childCommentMap = {};
//   comments.forEach(c => {
//     if (c.parent) {
//       if (!childCommentMap[c.parent]) childCommentMap[c.parent] = [];
//       childCommentMap[c.parent].push(c);
//     }
//   });

//   return (
//     <div className="mt-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold flex items-center space-x-2">
//           <FiMessageSquare className="w-5 h-5" />
//           <span>Comments ({comments.length})</span>
//         </h3>
//         {!showCommentForm && (
//           <button
//             onClick={() => setShowCommentForm(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Add Comment
//           </button>
//         )}
//       </div>

//       {showCommentForm && (
//         <div className="mb-6">
//           <CommentForm
//             promptId={promptId}
//             parentId={replyingTo}
//             onSuccess={handleCommentSuccess}
//             onCancel={() => {
//               setShowCommentForm(false);
//               setReplyingTo(null);
//             }}
//           />
//         </div>
//       )}

//       <div className="space-y-4">
//         {topLevelComments.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">
//             No comments yet. Be the first to comment!
//           </div>
//         ) : (
//           topLevelComments.map(comment => (
//             <CommentItem
//               key={comment._id}
//               comment={comment}
//               promptId={promptId}
//               onReply={handleReply}
//               childComments={childCommentMap[comment._id] || []}
//               childCommentMap={childCommentMap}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentsSection;
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getComments, addComment, updateComment, deleteComment } from '../../api/prompts';
import { useAuth } from '../../contexts/AuthContext';
import { FiMessageSquare, FiEdit2, FiTrash2, FiCornerUpLeft, FiChevronDown, FiChevronRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CommentForm = ({ promptId, parentId = null, onSuccess, onCancel }) => {
  const [content, setContent] = useState('');
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const addCommentMutation = useMutation(
    (commentData) => addComment(promptId, commentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', promptId]);
        setContent('');
        onSuccess?.();
        toast.success('Comment added successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to add comment';
        toast.error(message);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    addCommentMutation.mutate({
      content: content.trim(),
      parent: parentId
    });
  };

  if (!user) {
    return (
      <div className="text-center py-4 text-gray-500">
        Please login to add a comment
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="filter-bar w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows="3"
        disabled={addCommentMutation.isLoading}
      />
      <div className="flex justify-end space-x-2 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!content.trim() || addCommentMutation.isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {addCommentMutation.isLoading ? 'Posting...' : 'Post Comment'}
        </button>
      </div>
    </form>
  );
};

const CommentItem = ({ comment, promptId, onReply, childComments = [], childCommentMap = {} }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(true);

  const updateCommentMutation = useMutation(
    (commentData) => updateComment(comment._id, commentData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments']);
        setIsEditing(false);
        toast.success('Comment updated successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to update comment';
        toast.error(message);
      },
    }
  );

  const deleteCommentMutation = useMutation(
    () => deleteComment(comment._id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['comments', promptId]);
        toast.success('Comment deleted successfully!');
      },
      onError: (error) => {
        const message = error.response?.data?.message || 'Failed to delete comment';
        toast.error(message);
      },
    }
  );

  const handleEdit = (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    updateCommentMutation.mutate({ content: editContent.trim() });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate();
    }
  };

  // ✅ safe comparison for author id vs user id
  const authorId = comment.author?._id || comment.author?.id;
  const userId = user?._id || user?.id;
  const canEdit = user && (authorId === userId || user.isAdmin);
  const canDelete = canEdit;

  return (
    <div className="border-b border-gray-200 dark:border-gray-700 py-4">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {comment.author.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {comment.author.username}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString()}
            </span>
            {comment.isEdited && (
              <span className="text-xs text-gray-400">(edited)</span>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleEdit} className="mb-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="filter-bar w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                disabled={updateCommentMutation.isLoading}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editContent.trim() || updateCommentMutation.isLoading}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              {comment.content}
            </p>
          )}

          <div className="flex items-center space-x-4">
            <button
              onClick={() => onReply(comment._id)}
              className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiCornerUpLeft className="w-3 h-3" />
              <span>Reply</span>
            </button>

            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FiEdit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={deleteCommentMutation.isLoading}
                className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-700 transition-colors"
              >
                <FiTrash2 className="w-3 h-3" />
                <span>Delete</span>
              </button>
            )}
          </div>

          {childComments.length > 0 && (
            <div className="mt-2">
              <button
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center text-xs text-gray-600 hover:text-gray-800"
              >
                {showReplies ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
                {showReplies ? `Hide Replies` : `View ${childComments.length} Replies`}
              </button>

              {showReplies && (
                <div className="pl-6 mt-4 border-l border-gray-200">
                  {childComments.map((child) => (
                    <CommentItem
                      key={child._id}
                      comment={child}
                      promptId={promptId}
                      onReply={onReply}
                      childComments={childCommentMap[child._id] || []}
                      childCommentMap={childCommentMap}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CommentsSection = ({ promptId }) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  const { data: commentsData, isLoading, error } = useQuery(
    ['comments', promptId],
    () => getComments(promptId),
    {
      refetchOnWindowFocus: false,
      // staleTime: 0,
      // cacheTime: 0,
      // keepPreviousData: false,

    }
  );

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
    setShowCommentForm(true);
  };

  const handleCommentSuccess = () => {
    setShowCommentForm(false);
    setReplyingTo(null);
  };

  if (isLoading) {
    return <div className="mt-6">Loading comments...</div>;
  }

  if (error) {
    return <div className="mt-6 text-red-500">Failed to load comments</div>;
  }

  const comments = commentsData?.comments || [];
  // const topLevelComments = comments.filter(c => !c.parent);
  // const childCommentMap = {};
  // comments.forEach(c => {
  //   if (c.parent) {
  //     if (!childCommentMap[c.parent]) childCommentMap[c.parent] = [];
  //     childCommentMap[c.parent].push(c);
  //   }
  // });
  // ✅ orphan filter
// ✅ orphan filter
// const validParents = new Set(comments.filter((c) => !c.parent).map((c) => c._id));
// const filteredComments = comments.filter((c) => {
//   if (!c.parent) return true;
//   return validParents.has(c.parent);
// });

// const topLevelComments = filteredComments.filter((c) => !c.parent);
// const childCommentMap = {};
// filteredComments.forEach((c) => {
//   if (c.parent) {
//     if (!childCommentMap[c.parent]) childCommentMap[c.parent] = [];
//     childCommentMap[c.parent].push(c);
//   }
// });
// const topLevelComments = comments.filter((c) => !c.parent);
// const childCommentMap = {};
// comments.forEach((c) => {
//   if (c.parent) {
//     if (!childCommentMap[c.parent]) childCommentMap[c.parent] = [];
//     childCommentMap[c.parent].push(c);
//   }
// });
// const totalComments = comments.length;

// const totalComments = filteredComments.length;

// Filter top-level comments
const topLevelComments = comments.filter(c => !c.parent);


const childCommentMap = {};
topLevelComments.forEach(parent => {
  childCommentMap[parent._id] = comments.filter(c => c.parent === parent._id);
});


const totalComments = topLevelComments.length + Object.values(childCommentMap).reduce((sum, arr) => sum + arr.length, 0);


  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <FiMessageSquare className="w-5 h-5 prompt-bar" />
          <span className='prompt-bar'>Comments ({totalComments})</span>
        </h3>
        {!showCommentForm && (
          <button
            onClick={() => setShowCommentForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Comment
          </button>
        )}
      </div>

      {showCommentForm && (
        <div className="mb-6 ">
          <CommentForm
            promptId={promptId}
            parentId={replyingTo}
            onSuccess={handleCommentSuccess}
            onCancel={() => {
              setShowCommentForm(false);
              setReplyingTo(null);
            }}
          />
        </div>
      )}

      <div className="space-y-4">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No comments yet. Be the first to comment!
          </div>
        ) : (
          topLevelComments.map(comment => (
            <CommentItem
              key={comment._id}
              comment={comment}
              promptId={promptId}
              onReply={handleReply}
              childComments={childCommentMap[comment._id] || []}
              childCommentMap={childCommentMap}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsSection;


// // // import React, { useState } from 'react';
// // // import { useQuery, useMutation, useQueryClient } from 'react-query';
// // // import {  getComments,addComment, updateComment, deleteComment } from '../../api/prompts';
// // // import { useAuth } from '../../contexts/AuthContext';
// // // import { FiMessageSquare, FiEdit2, FiTrash2, FiCornerUpLeft } from 'react-icons/fi';
// // // import { FiChevronDown, FiChevronRight } from "react-icons/fi";

// // // import toast from 'react-hot-toast';

// // // const CommentForm = ({ promptId, parentId = null, onSuccess, onCancel }) => {
// // //   const [content, setContent] = useState('');
// // //   const { user } = useAuth();
// // //   const queryClient = useQueryClient();

// // //   const addCommentMutation = useMutation(
// // //     (commentData) => addComment(promptId, commentData),
// // //     {
// // //       onSuccess: () => {
// // //         queryClient.invalidateQueries(['comments', promptId]);
// // //         setContent('');
// // //         onSuccess?.();
// // //         toast.success('Comment added successfully!');
// // //       },
// // //       onError: (error) => {
// // //         const message = error.response?.data?.message || 'Failed to add comment';
// // //         toast.error(message);
// // //       },
// // //     }
// // //   );

// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
// // //     if (!content.trim()) return;

// // //     addCommentMutation.mutate({
// // //       content: content.trim(),
// // //       parent: parentId
// // //     });
// // //   };

// // //   if (!user) {
// // //     return (
// // //       <div className="text-center py-4 text-gray-500">
// // //         Please login to add a comment
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <form onSubmit={handleSubmit} className="mb-4">
// // //       <textarea
// // //         value={content}
// // //         onChange={(e) => setContent(e.target.value)}
// // //         placeholder="Write a comment..."
// // //         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
// // //         rows="3"
// // //         disabled={addCommentMutation.isLoading}
// // //       />
// // //       <div className="flex justify-end space-x-2 mt-2">
// // //         {onCancel && (
// // //           <button
// // //             type="button"
// // //             onClick={onCancel}
// // //             className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
// // //           >
// // //             Cancel
// // //           </button>
// // //         )}
// // //         <button
// // //           type="submit"
// // //           disabled={!content.trim() || addCommentMutation.isLoading}
// // //           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
// // //         >
// // //           {addCommentMutation.isLoading ? 'Posting...' : 'Post Comment'}
// // //         </button>
// // //       </div>
// // //     </form>
// // //   );
// // // };


// // // const CommentItem = ({ comment, promptId, onReply, childComments = [], childCommentMap = {} }) => {
// // //   const { user } = useAuth();
// // //   const queryClient = useQueryClient();
// // //   const [isEditing, setIsEditing] = useState(false);
// // //   const [editContent, setEditContent] = useState(comment.content);
// // //   const [showReplies, setShowReplies] = useState(true);


// // //   const updateCommentMutation = useMutation(
// // //     (commentData) => updateComment(comment._id, commentData),
// // //     {
// // //       onSuccess: () => {
// // //         queryClient.invalidateQueries(['comments']);
// // //         setIsEditing(false);
// // //         toast.success('Comment updated successfully!');
// // //       },
// // //       onError: (error) => {
// // //         const message = error.response?.data?.message || 'Failed to update comment';
// // //         toast.error(message);
// // //       },
// // //     }
// // //   );

// // //   const deleteCommentMutation = useMutation(
// // //     () => deleteComment(comment._id),
// // //     {
// // //       onSuccess: () => {
// // //         queryClient.invalidateQueries(['comments',promptId]);
// // //         toast.success('Comment deleted successfully!');
// // //       },
// // //       onError: (error) => {
// // //         const message = error.response?.data?.message || 'Failed to delete comment';
// // //         toast.error(message);
// // //       },
// // //     }
// // //   );

// // //   const handleEdit = (e) => {
// // //     e.preventDefault();
// // //     if (!editContent.trim()) return;

// // //     updateCommentMutation.mutate({ content: editContent.trim() });
// // //   };

// // //   const handleDelete = () => {
// // //     if (window.confirm('Are you sure you want to delete this comment?')) {
// // //       deleteCommentMutation.mutate();
// // //     }
// // //   };

// // //   const canEdit = user && (comment.author._id === user._id || user.isAdmin);
// // //   const canDelete = user && (comment.author._id === user._id || user.isAdmin);

// // //   return (
// // //     <div className="border-b border-gray-200 dark:border-gray-700 py-4">
// // //       <div className="flex items-start space-x-3">
// // //         <div className="flex-shrink-0">
// // //           <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
// // //             <span className="text-sm font-medium text-gray-600">
// // //               {comment.author.username?.charAt(0).toUpperCase()}
// // //             </span>
// // //           </div>
// // //         </div>

// // //         <div className="flex-1 min-w-0">
// // //           <div className="flex items-center space-x-2 mb-1">
// // //             <span className="text-sm font-medium text-gray-900 dark:text-white">
// // //               {comment.author.username}
// // //             </span>
// // //             <span className="text-xs text-gray-500">
// // //               {new Date(comment.createdAt).toLocaleDateString()}
// // //             </span>
// // //             {comment.isEdited && (
// // //               <span className="text-xs text-gray-400">(edited)</span>
// // //             )}
// // //           </div>

// // //           {isEditing ? (
// // //             <form onSubmit={handleEdit} className="mb-2">
// // //               <textarea
// // //                 value={editContent}
// // //                 onChange={(e) => setEditContent(e.target.value)}
// // //                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// // //                 rows="3"
// // //                 disabled={updateCommentMutation.isLoading}
// // //               />
// // //               <div className="flex justify-end space-x-2 mt-2">
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setIsEditing(false)}
// // //                   className="text-sm text-gray-600 hover:text-gray-800"
// // //                 >
// // //                   Cancel
// // //                 </button>
// // //                 <button
// // //                   type="submit"
// // //                   disabled={!editContent.trim() || updateCommentMutation.isLoading}
// // //                   className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
// // //                 >
// // //                   Save
// // //                 </button>
// // //               </div>
// // //             </form>
// // //           ) : (
// // //             <p className="text-gray-700 dark:text-gray-300 mb-2">
// // //               {comment.content}
// // //             </p>
// // //           )}

// // //           <div className="flex items-center space-x-4">
// // //             <button
// // //               onClick={() => onReply(comment._id)}
// // //               className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
// // //             >
// // //               <FiCornerUpLeft className="w-3 h-3" />
// // //               <span>Reply</span>
// // //             </button>

// // //             {canEdit && (
// // //               <button
// // //                 onClick={() => setIsEditing(true)}
// // //                 className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
// // //               >
// // //                 <FiEdit2 className="w-3 h-3" />
// // //                 <span>Edit</span>
// // //               </button>
// // //             )}

// // //             {canDelete && (
// // //               <button
// // //                 onClick={handleDelete}
// // //                 disabled={deleteCommentMutation.isLoading}
// // //                 className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-700 transition-colors"
// // //               >
// // //                 <FiTrash2 className="w-3 h-3" />
// // //                 <span>Delete</span>
// // //               </button>
// // //             )}
// // //           </div>

// // //            {/* nestedreplies
// // //           {childComments.length > 0 && (
// // //             <div className="pl-6 mt-4 border-l border-gray-200">
// // //               {childComments.map(child => (
// // //                 <CommentItem
// // //                   key={child._id}
// // //                   comment={child}
// // //                   promptId={promptId}
// // //                   onReply={onReply}
// // //                   childComments={childCommentMap[child._id] || []}
// // //                   childCommentMap={childCommentMap}
// // //                 />
// // //               ))}
// // //             </div>
// // //           )}  */}
// // //           {/* agar replies hain to toggle button dikhayein */}
// // // {/* {childComments.length > 0 && (
// // //   <div className="mt-2">
// // //     <button
// // //       onClick={() => setShowReplies(!showReplies)}
// // //       className="text-xs text-blue-600 hover:underline"
// // //     >
// // //       {showReplies ? "Hide Replies" : `View ${childComments.length} Replies`}
// // //     </button>

// // //     {showReplies && (
// // //       <div className="pl-6 mt-4 border-l border-gray-200">
// // //         {childComments.map(child => (
// // //           <CommentItem
// // //             key={child._id}
// // //             comment={child}
// // //             promptId={promptId}
// // //             onReply={onReply}
// // //             childComments={childCommentMap[child._id] || []}
// // //             childCommentMap={childCommentMap}
// // //           />
// // //         ))}
// // //       </div>
// // //     )}
// // //   </div>
// // // )} */}
// // // {childComments.length > 0 && (
// // //   <div className="mt-2">
// // //     <button
// // //       onClick={() => setShowReplies(!showReplies)}
// // //       className="flex items-center text-xs text-gray-600 hover:text-gray-800"
// // //     >
// // //       {showReplies ? (
// // //         <FiChevronDown className="mr-1" />
// // //       ) : (
// // //         <FiChevronRight className="mr-1" />
// // //       )}
// // //       {showReplies ? `Hide Replies` : `View ${childComments.length} Replies`}
// // //     </button>

// // //     {showReplies && (
// // //       <div className="pl-6 mt-4 border-l border-gray-200">
// // //         {childComments.map((child) => (
// // //           <CommentItem
// // //             key={child._id}
// // //             comment={child}
// // //             promptId={promptId}
// // //             onReply={onReply}
// // //             childComments={childCommentMap[child._id] || []}
// // //             childCommentMap={childCommentMap}
// // //           />
// // //         ))}
// // //       </div>
// // //     )}
// // //   </div>
// // // )}

// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };


// // // const CommentsSection = ({ promptId }) => {
// // //   const [showCommentForm, setShowCommentForm] = useState(false);
// // //   const [replyingTo, setReplyingTo] = useState(null);

// // //   const { data: commentsData, isLoading, error } = useQuery(
// // //     ['comments', promptId],
// // //     () => getComments(promptId),
// // //     {
// // //       refetchOnWindowFocus: false,
// // //     }
// // //   );

// // //   const handleReply = (commentId) => {
// // //     setReplyingTo(commentId);
// // //     setShowCommentForm(true);
// // //   };

// // //   const handleCommentSuccess = () => {
// // //     setShowCommentForm(false);
// // //     setReplyingTo(null);
// // //   };

// // //   if (isLoading) {
// // //     return (
// // //       <div className="mt-6">Loading comments...</div>
// // //     );
// // //   }

// // //   if (error) {
// // //     return (
// // //       <div className="mt-6 text-red-500">Failed to load comments</div>
// // //     );
// // //   }

// // //   const comments = commentsData?.comments || [];

// // //   const topLevelComments = comments.filter(c => !c.parent);
// // //   const childCommentMap = {};
// // //   comments.forEach(c => {
// // //     if (c.parent) {
// // //       if (!childCommentMap[c.parent]) childCommentMap[c.parent] = [];
// // //       childCommentMap[c.parent].push(c);
// // //     }
// // //   });
// // // //  const comments = commentsData?.comments || [];

// // // // // ✅ filter orphan children (jin parents ko delete kar diya gaya)
// // // // const validParents = new Set(comments.filter(c => !c.parent).map(c => c._id));
// // // // const filteredComments = comments.filter(c => {
// // // //   if (!c.parent) return true;             // parent comment rakhna
// // // //   return validParents.has(c.parent);      // child tabhi rakho jab parent exist hai
// // // // });

// // // // // ✅ parent-child alag karna
// // // // const topLevelComments = filteredComments.filter(c => !c.parent);
// // // // const childCommentMap = {};
// // // // filteredComments.forEach(c => {
// // // //   if (c.parent) {
// // // //     if (!childCommentMap[c.parent]) childCommentMap[c.parent] = [];
// // // //     childCommentMap[c.parent].push(c);
// // // //   }
// // // // });

// // // // // ✅ final count
// // // // const totalComments = filteredComments.length;

  


// // //   return (
// // //     <div className="mt-6">
// // //       <div className="flex items-center justify-between mb-4">
// // //         <h3 className="text-lg font-semibold flex items-center space-x-2">
// // //           <FiMessageSquare className="w-5 h-5" />
// // //           <span>Comments ({comments.length})</span>
// // //         </h3>
// // //         {!showCommentForm && (
// // //           <button
// // //             onClick={() => setShowCommentForm(true)}
// // //             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// // //           >
// // //             Add Comment
// // //           </button>
// // //         )}
// // //       </div>

// // //       {showCommentForm && (
// // //         <div className="mb-6">
// // //           <CommentForm
// // //             promptId={promptId}
// // //             parentId={replyingTo}
// // //             onSuccess={handleCommentSuccess}
// // //             onCancel={() => {
// // //               setShowCommentForm(false);
// // //               setReplyingTo(null);
// // //             }}
// // //           />
// // //         </div>
// // //       )}

// // //       <div className="space-y-4">
// // //         {topLevelComments.length === 0 ? (
// // //           <div className="text-center py-8 text-gray-500">
// // //             No comments yet. Be the first to comment!
// // //           </div>
// // //         ) : (
// // //           topLevelComments.map(comment => (
// // //             <CommentItem
// // //               key={comment._id}
// // //               comment={comment}
// // //               promptId={promptId}
// // //               onReply={handleReply}
// // //               childComments={childCommentMap[comment._id] || []}
// // //               childCommentMap={childCommentMap}
// // //             />
// // //           ))
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default CommentsSection;

// import React, { useState } from 'react';
// import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { getComments, addComment, updateComment, deleteComment } from '../../api/prompts';
// import { useAuth } from '../../contexts/AuthContext';
// import { FiMessageSquare, FiEdit2, FiTrash2, FiCornerUpLeft, FiChevronDown, FiChevronRight } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const CommentForm = ({ promptId, parentId = null, onSuccess, onCancel }) => {
//   const [content, setContent] = useState('');
//   const { user } = useAuth();
//   const queryClient = useQueryClient();

//   const addCommentMutation = useMutation(
//     (commentData) => addComment(promptId, commentData),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['comments', promptId]);
//         setContent('');
//         onSuccess?.();
//         toast.success('Comment added successfully!');
//       },
//       onError: (error) => {
//         const message = error.response?.data?.message || 'Failed to add comment';
//         toast.error(message);
//       },
//     }
//   );

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!content.trim()) return;

//     addCommentMutation.mutate({
//       content: content.trim(),
//       parent: parentId,
//     });
//   };

//   if (!user) {
//     return <div className="text-center py-4 text-gray-500">Please login to add a comment</div>;
//   }

//   return (
//     <form onSubmit={handleSubmit} className="mb-4">
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         placeholder="Write a comment..."
//         className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//         rows="3"
//         disabled={addCommentMutation.isLoading}
//       />
//       <div className="flex justify-end space-x-2 mt-2">
//         {onCancel && (
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
//           >
//             Cancel
//           </button>
//         )}
//         <button
//           type="submit"
//           disabled={!content.trim() || addCommentMutation.isLoading}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {addCommentMutation.isLoading ? 'Posting...' : 'Post Comment'}
//         </button>
//       </div>
//     </form>
//   );
// };

// const CommentItem = ({ comment, promptId, onReply, childComments = [], childCommentMap = {} }) => {
//   const { user } = useAuth();
//   const queryClient = useQueryClient();
//   const [isEditing, setIsEditing] = useState(false);
//   const [editContent, setEditContent] = useState(comment.content);
//   const [showReplies, setShowReplies] = useState(true);

//   const updateCommentMutation = useMutation(
//     (commentData) => updateComment(comment._id, commentData),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['comments',promptId]);
//         setIsEditing(false);
//         toast.success('Comment updated successfully!');
//       },
//       onError: (error) => {
//         const message = error.response?.data?.message || 'Failed to update comment';
//         toast.error(message);
//       },
//     }
//   );

//   const deleteCommentMutation = useMutation(
//     () => deleteComment(comment._id),
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries(['comments', promptId]);
//         toast.success('Comment deleted successfully!');
//       },
//       onError: (error) => {
//         const message = error.response?.data?.message || 'Failed to delete comment';
//         toast.error(message);
//       },
//     }
//   );

//   const handleEdit = (e) => {
//     e.preventDefault();
//     if (!editContent.trim()) return;
//     updateCommentMutation.mutate({ content: editContent.trim() });
//   };

//   const handleDelete = () => {
//     if (window.confirm('Are you sure you want to delete this comment?')) {
//       deleteCommentMutation.mutate();
//     }
//   };
//   // ✅ Author ID safe check (string ya object dono handle hoga)
//   // ✅ Safe comparison (convert both to string)
// const authorId =
//   typeof comment.author === "object"
//     ? comment.author._id?.toString()
//     : comment.author?.toString();

// const canEdit =
//   user && (authorId === user._id?.toString() || user.isAdmin);

// const canDelete =
//   user && (authorId === user._id?.toString() || user.isAdmin);

// // const authorId = typeof comment.author === "object" ? comment.author._id : comment.author;

// // const canEdit = user && (authorId === user._id || user.isAdmin);
// // const canDelete = user && (authorId === user._id || user.isAdmin);
// // const authorId = typeof comment.author === "object" ? comment.author._id : comment.author;
// // const canEdit = user && (String(authorId) === String(user._id) || user.isAdmin);
// // const canDelete = user && (String(authorId) === String(user._id) || user.isAdmin);
//   // const canEdit = user && (comment.author._id === user._id || user.isAdmin);
//   // const canDelete = user && (comment.author._id === user._id || user.isAdmin);


//   // const canEdit = user && (comment.author._id === user._id || user.isAdmin);
//   // const canDelete = user && (comment.author._id === user._id || user.isAdmin);

//   return (
//     <div className="border-b border-gray-200 dark:border-gray-700 py-4">
//       <div className="flex items-start space-x-3">
//         <div className="flex-shrink-0">
//           <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//             {/* <span className="text-sm font-medium text-gray-600">
//               {comment.author.username?.charAt(0).toUpperCase()}
//             </span> */}
//             <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
//   <span className="text-sm font-medium text-gray-600">
//     {typeof comment.author === "object"
//       ? comment.author.username?.charAt(0).toUpperCase()
//       : "U"}
//   </span>
// </div>

//           </div>
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex items-center space-x-2 mb-1">
//              <span className="text-sm font-medium text-gray-900 dark:text-white">
//   {typeof comment.author === "object" ? comment.author.username : "Unknown"}
// </span>

//             {/* <span className="text-sm font-medium text-gray-900 dark:text-white">
//   {typeof comment.author === "object" ? comment.author.username : "Unknown"}
// </span> */}

//             {/* <span className="text-sm font-medium text-gray-900 dark:text-white">
//               {comment.author.username}
//             </span> */}
//             <span className="text-xs text-gray-500">
//               {new Date(comment.createdAt).toLocaleDateString()}
//             </span>
//             {comment.isEdited && <span className="text-xs text-gray-400">(edited)</span>}
//           </div>

//           {isEditing ? (
//             <form onSubmit={handleEdit} className="mb-2">
//               <textarea
//                 value={editContent}
//                 onChange={(e) => setEditContent(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows="3"
//                 disabled={updateCommentMutation.isLoading}
//               />
//               <div className="flex justify-end space-x-2 mt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsEditing(false)}
//                   className="text-sm text-gray-600 hover:text-gray-800"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={!editContent.trim() || updateCommentMutation.isLoading}
//                   className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//                 >
//                   Save
//                 </button>
//               </div>
//             </form>
//           ) : (
//             <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.content}</p>
//           )}

//           <div className="flex items-center space-x-4">
//             <button
//               onClick={() => onReply(comment._id)}
//               className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
//             >
//               <FiCornerUpLeft className="w-3 h-3" />
//               <span>Reply</span>
//             </button>

//             {canEdit && (
//               <button
//                 onClick={() => setIsEditing(true)}
//                 className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <FiEdit2 className="w-3 h-3" />
//                 <span>Edit</span>
//               </button>
//             )}

//             {canDelete && (
//               <button
//                 onClick={handleDelete}
//                 disabled={deleteCommentMutation.isLoading}
//                 className="flex items-center space-x-1 text-xs text-red-500 hover:text-red-700 transition-colors"
//               >
//                 <FiTrash2 className="w-3 h-3" />
//                 <span>Delete</span>
//               </button>
//             )}
//           </div>

//           {/* Replies toggle */}
//           {childComments.length > 0 && (
//             <div className="mt-2">
//               <button
//                 onClick={() => setShowReplies(!showReplies)}
//                 className="flex items-center text-xs text-gray-600 hover:text-gray-800"
//               >
//                 {showReplies ? <FiChevronDown className="mr-1" /> : <FiChevronRight className="mr-1" />}
//                 {showReplies ? `Hide Replies` : `View ${childComments.length} Replies`}
//               </button>

//               {showReplies && (
//                 <div className="pl-6 mt-4 border-l border-gray-200">
//                   {childComments.map((child) => (
//                     <CommentItem
//                       key={child._id}
//                       comment={child}
//                       promptId={promptId}
//                       onReply={onReply}
//                       childComments={childCommentMap[child._id] || []}
//                       childCommentMap={childCommentMap}
//                     />
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const CommentsSection = ({ promptId }) => {
//   const [showCommentForm, setShowCommentForm] = useState(false);
//   const [replyingTo, setReplyingTo] = useState(null);

//   const { data: commentsData, isLoading, error } = useQuery(['comments', promptId], () => getComments(promptId), {
//     refetchOnWindowFocus: false,
//   });

//   const handleReply = (commentId) => {
//     setReplyingTo(commentId);
//     setShowCommentForm(true);
//   };

//   const handleCommentSuccess = () => {
//     setShowCommentForm(false);
//     setReplyingTo(null);
//   };

//   if (isLoading) return <div className="mt-6">Loading comments...</div>;
//   if (error) return <div className="mt-6 text-red-500">Failed to load comments</div>;

//   const comments = commentsData?.comments || [];

//   // ✅ orphan filter
//   const validParents = new Set(comments.filter((c) => !c.parent).map((c) => c._id));
//   const filteredComments = comments.filter((c) => {
//     if (!c.parent) return true;
//     return validParents.has(c.parent);
//   });

//   const topLevelComments = filteredComments.filter((c) => !c.parent);
//   const childCommentMap = {};
//   filteredComments.forEach((c) => {
//     if (c.parent) {
//       if (!childCommentMap[c.parent]) childCommentMap[c.parent] = [];
//       childCommentMap[c.parent].push(c);
//     }
//   });

//   const totalComments = filteredComments.length;

//   return (
//     <div className="mt-6">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-lg font-semibold flex items-center space-x-2">
//           <FiMessageSquare className="w-5 h-5" />
//           <span>Comments ({totalComments})</span>
//         </h3>
//         {!showCommentForm && (
//           <button
//             onClick={() => setShowCommentForm(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Add Comment
//           </button>
//         )}
//       </div>

//       {showCommentForm && (
//         <div className="mb-6">
//           <CommentForm
//             promptId={promptId}
//             parentId={replyingTo}
//             onSuccess={handleCommentSuccess}
//             onCancel={() => {
//               setShowCommentForm(false);
//               setReplyingTo(null);
//             }}
//           />
//         </div>
//       )}

//       <div className="space-y-4">
//         {topLevelComments.length === 0 ? (
//           <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
//         ) : (
//           topLevelComments.map((comment) => (
//             <CommentItem
//               key={comment._id}
//               comment={comment}
//               promptId={promptId}
//               onReply={handleReply}
//               childComments={childCommentMap[comment._id] || []}
//               childCommentMap={childCommentMap}
//             />
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentsSection;

