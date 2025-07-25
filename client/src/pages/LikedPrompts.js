 
import React, { useCallback } from 'react';
import { useQuery } from 'react-query';
import { getLikedPrompts } from '../api/prompts';
import PromptCard from '../components/prompts/PromptCard';
import { FiHeart } from 'react-icons/fi';

const LikedPrompts = () => {
  const { data, isLoading, error, refetch } = useQuery(
    ['likedPrompts'],
    getLikedPrompts
  );

  const loadLikedPrompts = useCallback(() => {
    refetch(); // Triggers refresh from server
  }, [refetch]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Liked Prompts</h1>
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
          <div className="text-red-600 text-lg mb-4">Error loading liked prompts</div>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
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
                onBookmarkToggle={loadLikedPrompts}  // ✅ passes the refetch function

                onRefresh={loadLikedPrompts} // ✅ for like/use/vote refresh
              />
            ))}
          </div>

          {/* Pagination */}
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
          <div className="text-gray-500 text-lg mb-4">No liked prompts yet</div>
          <p className="text-gray-600 mb-6">
            Start exploring and liking prompts to see them here!
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="btn-primary"
          >
            Explore Prompts
          </button>
        </div>
      )}
    </div>
  );
};

export default LikedPrompts;

