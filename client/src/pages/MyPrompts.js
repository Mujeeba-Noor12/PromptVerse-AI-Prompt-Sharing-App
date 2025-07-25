
// // import React, { useState } from 'react';
// // import { useQuery } from 'react-query';
// // import { getUserPrompts } from '../api/prompts';
// // import PromptCard from '../components/prompts/PromptCard';
// // import { FiFilter, FiEye, FiEyeOff } from 'react-icons/fi';

// // const MyPrompts = () => {
// //   const [filter, setFilter] = useState('all'); 

// //   const {
// //     data,
// //     isLoading,
// //     error,
// //     refetch: reloadMyPrompts, 
// //   } = useQuery(
// //     ['myPrompts', filter],
// //     () =>
// //       getUserPrompts({
// //         isPublic: filter === 'all' ? undefined : filter === 'public',
// //       }),
// //     {
// //       keepPreviousData: true,
// //     }
// //   );

// //   const getFilteredPrompts = () => {
// //     if (!data?.prompts) return [];
// //     if (filter === 'all') return data.prompts;
// //     return data.prompts.filter((prompt) =>
// //       filter === 'public' ? prompt.isPublic : !prompt.isPublic
// //     );
// //   };

// //   const filteredPrompts = getFilteredPrompts();

// //   return (
// //     <div className="max-w-7xl mx-auto">
// //       <div className="mb-8">
// //         <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prompts</h1>
// //         <p className="text-gray-600">Manage and view your created prompts</p>
// //       </div>

// //       {/* Filter Tabs */}
// //       <div className="mb-8">
// //         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
// //           <button
// //             onClick={() => setFilter('all')}
// //             className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
// //               filter === 'all'
// //                 ? 'bg-white text-gray-900 shadow-sm'
// //                 : 'text-gray-600 hover:text-gray-900'
// //             }`}
// //           >
// //             All Prompts
// //           </button>
// //           <button
// //             onClick={() => setFilter('public')}
// //             className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
// //               filter === 'public'
// //                 ? 'bg-white text-gray-900 shadow-sm'
// //                 : 'text-gray-600 hover:text-gray-900'
// //             }`}
// //           >
// //             <FiEye className="w-4 h-4 inline mr-1" />
// //             Public
// //           </button>
// //           <button
// //             onClick={() => setFilter('private')}
// //             className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
// //               filter === 'private'
// //                 ? 'bg-white text-gray-900 shadow-sm'
// //                 : 'text-gray-600 hover:text-gray-900'
// //             }`}
// //           >
// //             <FiEyeOff className="w-4 h-4 inline mr-1" />
// //             Private
// //           </button>
// //         </div>
// //       </div>

// //       {/* Results */}
// //       {isLoading ? (
// //         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
// //           {[...Array(6)].map((_, i) => (
// //             <div key={i} className="card animate-pulse">
// //               <div className="h-4 bg-gray-200 rounded mb-4"></div>
// //               <div className="h-20 bg-gray-200 rounded mb-4"></div>
// //               <div className="flex space-x-2">
// //                 <div className="h-6 bg-gray-200 rounded w-16"></div>
// //                 <div className="h-6 bg-gray-200 rounded w-20"></div>
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       ) : error ? (
// //         <div className="text-center py-12">
// //           <div className="text-red-600 text-lg mb-4">Error loading your prompts</div>
// //           <button onClick={() => window.location.reload()} className="btn-primary">
// //             Try Again
// //           </button>
// //         </div>
// //       ) : filteredPrompts.length > 0 ? (
// //         <>
// //           <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
// //             {filteredPrompts.map((prompt) => (
// //              <PromptCard
// //   key={prompt._id}
// //   prompt={prompt}
// //   onBookmarkToggle={reloadMyPrompts}
// //   onLikeToggle={reloadMyPrompts}
// //   onUseToggle={reloadMyPrompts}
// //   onUpvoteToggle={reloadMyPrompts}
// //   onRefresh={reloadMyPrompts}
// // />

// //             ))}
// //           </div>

// //           {/* Pagination (optional if you implement it) */}
// //           {data?.pagination && (data.pagination.hasNext || data.pagination.hasPrev) && (
// //             <div className="flex justify-center mt-8">
// //               <div className="flex space-x-2">
// //                 {data.pagination.hasPrev && (
// //                   <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
// //                     Previous
// //                   </button>
// //                 )}
// //                 <span className="px-4 py-2 text-gray-600">
// //                   Page {data.pagination.current} of {data.pagination.total}
// //                 </span>
// //                 {data.pagination.hasNext && (
// //                   <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
// //                     Next
// //                   </button>
// //                 )}
// //               </div>
// //             </div>
// //           )}
// //         </>
// //       ) : (
// //         <div className="text-center py-12">
// //           <div className="text-gray-500 text-lg mb-4">
// //             {filter === 'all'
// //               ? "You haven't created any prompts yet"
// //               : filter === 'public'
// //               ? "You haven't created any public prompts yet"
// //               : "You haven't created any private prompts yet"}
// //           </div>
// //           <p className="text-gray-600 mb-6">
// //             {filter === 'all'
// //               ? 'Start sharing your AI prompts with the community!'
// //               : 'Create some prompts to see them here.'}
// //           </p>
// //           <button
// //             onClick={() => (window.location.href = '/create')}
// //             className="btn-primary"
// //           >
// //             Create Your First Prompt
// //           </button>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default MyPrompts;
// import React, { useState, useReducer } from 'react';
// import { useQuery } from 'react-query';
// import { getUserPrompts } from '../api/prompts';
// import PromptCard from '../components/prompts/PromptCard';
// import { FiFilter, FiEye, FiEyeOff } from 'react-icons/fi';

// const MyPrompts = () => {
//   const [filter, setFilter] = useState('all');
//   const [, forceUpdate] = useReducer((x) => x + 1, 0); // ✅ force re-render

//   const {
//     data,
//     isLoading,
//     error,
//     refetch: reloadMyPrompts,
//   } = useQuery(
//     ['myPrompts', filter],
//     () =>
//       getUserPrompts({
//         isPublic: filter === 'all' ? undefined : filter === 'public',
//       }),
//     {
//       keepPreviousData: true,
//     }
//   );

//   const getFilteredPrompts = () => {
//     if (!data?.prompts) return [];
//     if (filter === 'all') return data.prompts;
//     return data.prompts.filter((prompt) =>
//       filter === 'public' ? prompt.isPublic : !prompt.isPublic
//     );
//   };

//   const filteredPrompts = getFilteredPrompts();

//   return (
//     <div className="max-w-7xl mx-auto">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prompts</h1>
//         <p className="text-gray-600">Manage and view your created prompts</p>
//       </div>

//       {/* Filter Tabs */}
//       <div className="mb-8">
//         <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
//           <button
//             onClick={() => setFilter('all')}
//             className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//               filter === 'all'
//                 ? 'bg-white text-gray-900 shadow-sm'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             All Prompts
//           </button>
//           <button
//             onClick={() => setFilter('public')}
//             className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//               filter === 'public'
//                 ? 'bg-white text-gray-900 shadow-sm'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             <FiEye className="w-4 h-4 inline mr-1" />
//             Public
//           </button>
//           <button
//             onClick={() => setFilter('private')}
//             className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
//               filter === 'private'
//                 ? 'bg-white text-gray-900 shadow-sm'
//                 : 'text-gray-600 hover:text-gray-900'
//             }`}
//           >
//             <FiEyeOff className="w-4 h-4 inline mr-1" />
//             Private
//           </button>
//         </div>
//       </div>

//       {/* Results */}
//       {isLoading ? (
//         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//           {[...Array(6)].map((_, i) => (
//             <div key={i} className="card animate-pulse">
//               <div className="h-4 bg-gray-200 rounded mb-4"></div>
//               <div className="h-20 bg-gray-200 rounded mb-4"></div>
//               <div className="flex space-x-2">
//                 <div className="h-6 bg-gray-200 rounded w-16"></div>
//                 <div className="h-6 bg-gray-200 rounded w-20"></div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : error ? (
//         <div className="text-center py-12">
//           <div className="text-red-600 text-lg mb-4">Error loading your prompts</div>
//           <button onClick={() => window.location.reload()} className="btn-primary">
//             Try Again
//           </button>
//         </div>
//       ) : filteredPrompts.length > 0 ? (
//         <>
//           <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
//             {filteredPrompts.map((prompt) => (
//               <PromptCard
//                 key={prompt._id}
//                 prompt={prompt}
//                 onBookmarkToggle={() => {
//                   reloadMyPrompts();  // ✅ refetch data
//                   forceUpdate();      // ✅ force re-render
//                 }}
//                 onLikeToggle={reloadMyPrompts}
//                 onUseToggle={reloadMyPrompts}
//                 onUpvoteToggle={reloadMyPrompts}
//                 onRefresh={reloadMyPrompts}
//               />
//             ))}
//           </div>

//           {/* Pagination (optional) */}
//           {data?.pagination && (data.pagination.hasNext || data.pagination.hasPrev) && (
//             <div className="flex justify-center mt-8">
//               <div className="flex space-x-2">
//                 {data.pagination.hasPrev && (
//                   <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                     Previous
//                   </button>
//                 )}
//                 <span className="px-4 py-2 text-gray-600">
//                   Page {data.pagination.current} of {data.pagination.total}
//                 </span>
//                 {data.pagination.hasNext && (
//                   <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
//                     Next
//                   </button>
//                 )}
//               </div>
//             </div>
//           )}
//         </>
//       ) : (
//         <div className="text-center py-12">
//           <div className="text-gray-500 text-lg mb-4">
//             {filter === 'all'
//               ? "You haven't created any prompts yet"
//               : filter === 'public'
//               ? "You haven't created any public prompts yet"
//               : "You haven't created any private prompts yet"}
//           </div>
//           <p className="text-gray-600 mb-6">
//             {filter === 'all'
//               ? 'Start sharing your AI prompts with the community!'
//               : 'Create some prompts to see them here.'}
//           </p>
//           <button
//             onClick={() => (window.location.href = '/create')}
//             className="btn-primary"
//           >
//             Create Your First Prompt
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyPrompts;
import React, { useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { getUserPrompts } from '../api/prompts';
import PromptCard from '../components/prompts/PromptCard';
import { FiFilter, FiEye, FiEyeOff } from 'react-icons/fi';

const MyPrompts = () => {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch: reloadMyPrompts,
  } = useQuery(
    ['myPrompts', filter],
    () =>
      getUserPrompts({
        isPublic: filter === 'all' ? undefined : filter === 'public',
      }),
    {
      keepPreviousData: true,
    }
  );

  const getFilteredPrompts = () => {
    if (!data?.prompts) return [];
    if (filter === 'all') return data.prompts;
    return data.prompts.filter((prompt) =>
      filter === 'public' ? prompt.isPublic : !prompt.isPublic
    );
  };

  const handleBookmarkToggle = async () => {
    await reloadMyPrompts(); // 1. Refetch from API
    const newData = queryClient.getQueryData(['myPrompts', filter]); // 2. Get latest cache
    queryClient.setQueryData(['myPrompts', filter], { ...newData }); // 3. Force re-render
  };

  const filteredPrompts = getFilteredPrompts();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Prompts</h1>
        <p className="text-gray-600">Manage and view your created prompts</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Prompts
          </button>
          <button
            onClick={() => setFilter('public')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'public'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiEye className="w-4 h-4 inline mr-1" />
            Public
          </button>
          <button
            onClick={() => setFilter('private')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'private'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FiEyeOff className="w-4 h-4 inline mr-1" />
            Private
          </button>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4">Error loading your prompts</div>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      ) : filteredPrompts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                onBookmarkToggle={handleBookmarkToggle}
                onLikeToggle={reloadMyPrompts}
                onUseToggle={reloadMyPrompts}
                onUpvoteToggle={reloadMyPrompts}
                onRefresh={reloadMyPrompts}
              />
            ))}
          </div>

          {data?.pagination && (data.pagination.hasNext || data.pagination.hasPrev) && (
            <div className="flex justify-center mt-8">
              <div className="flex space-x-2">
                {data.pagination.hasPrev && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                )}
                <span className="px-4 py-2 text-gray-600">
                  Page {data.pagination.current} of {data.pagination.total}
                </span>
                {data.pagination.hasNext && (
                  <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            {filter === 'all'
              ? "You haven't created any prompts yet"
              : filter === 'public'
              ? "You haven't created any public prompts yet"
              : "You haven't created any private prompts yet"}
          </div>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? 'Start sharing your AI prompts with the community!'
              : 'Create some prompts to see them here.'}
          </p>
          <button
            onClick={() => (window.location.href = '/create')}
            className="btn-primary"
          >
            Create Your First Prompt
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPrompts;
