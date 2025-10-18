 
import React, { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { getLikedPrompts } from '../api/prompts';
import PromptCard from '../components/prompts/PromptCard';
import { FiHeart } from 'react-icons/fi';

const LikedPrompts = () => {
  // const { data, isLoading, error, refetch } = useQuery(
  //   ['likedPrompts',filters],
  //   getLikedPrompts
  // );
   const [filters, setFilters] = useState({
      
      page: 1
    });
  const { data, isLoading, error ,refetch} = useQuery(
  ['likedPrompts', filters],
  () => getLikedPrompts(filters),
  { keepPreviousData: true }
);
  

  const loadLikedPrompts = useCallback(() => {
    refetch(); 
  }, [refetch]);
 const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 prompt-bar">Liked Prompts</h1>
        <p className="text-gray-600">Your collection of favorite AI prompts</p>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <div className="text-red-600 text-lg mb-4 prompt-bar">Error loading liked prompts</div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary prompt-bar"
          >
            Try Again
          </button>
        </div>
      ) : data?.prompts?.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {data.prompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                onBookmarkToggle={loadLikedPrompts}  

                onRefresh={loadLikedPrompts} 
              />
            ))}
          </div>

      {data.pagination && (
  <div className="flex justify-center mt-10">
    <div className="flex items-center space-x-2 bg-white dark:bg-[#161b22] px-4 py-3 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 transition-all duration-300">
      
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(data.pagination.current - 1)}
        disabled={!data.pagination.hasPrev}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
          ${
            data.pagination.hasPrev
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
          }
        `}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      <div className="flex items-center space-x-2">
        {Array.from({ length: data.pagination.total }).map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`w-9 h-9 rounded-md text-sm font-semibold transition-all duration-200 border
              ${
                data.pagination.current === index + 1
                  ? 'bg-blue-600 text-white shadow-md border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-black dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }
            `}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(data.pagination.current + 1)}
        disabled={!data.pagination.hasNext}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
          ${
            data.pagination.hasNext
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
          }
        `}
      >
        Next →
      </button>
    </div>
  </div>
)}

        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4 prompt-bar">No liked prompts yet</div>
          <p className="text-gray-600 mb-6">
            Start exploring and liking prompts to see them here!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary prompt-bar"
          >
            Explore Prompts
          </button>
        </div>
      )}
    </div>
  );
};

export default LikedPrompts;

