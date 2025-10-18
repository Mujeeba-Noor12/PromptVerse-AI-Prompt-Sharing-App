
import React, { useEffect, useState, useCallback } from 'react';
import { fetchBookmarkedPrompts } from '../api/prompts';
import PromptCard from '../components/prompts/PromptCard';

const BookMarked = () => {
  const [bookmarkedPrompts, setBookmarkedPrompts] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  
  const loadBookmarks = useCallback(async (page = 1) => {
    try {
      console.log('Fetching bookmarks page', page);
      setError(false);
      setLoading(true);

      const data = await fetchBookmarkedPrompts({ page, limit: 10 });
      console.log('API result for page', page, data);

      const prompts = Array.isArray(data) ? data : data.prompts || [];
      const pag = data.pagination || null;

      setBookmarkedPrompts(prompts);
      if (pag) {
        setPagination({
          current: Number(pag.current) || Number(page),
          total: Number(pag.total) || 1,
          hasNext: !!pag.hasNext,
          hasPrev: !!pag.hasPrev,
        });
      } else {
        setPagination({
          current: Number(page),
          total: 1,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (err) {
      console.error('Failed to fetch bookmarks:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    loadBookmarks(1);
  }, [loadBookmarks]);

  const handlePageChange = (page) => {
    if (!page || page < 1 || page === pagination.current || page > pagination.total) return;
    
    setPagination((prev) => ({ ...prev, current: page }));
   
    loadBookmarks(page);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemovePrompt = (promptId) => {
    setBookmarkedPrompts((prev) => prev.filter((p) => p._id !== promptId));
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 prompt-bar">Bookmarked Prompts</h2>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : error ? (
        <div className="text-center py-12">
          <div className="text-red-600 text-lg mb-4 prompt-bar">Error loading bookmarked prompts</div>
          <button onClick={() => loadBookmarks(pagination.current || 1)} className="btn-primary prompt-bar">Try Again</button>
        </div>
      ) : !bookmarkedPrompts || bookmarkedPrompts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4 prompt-bar">No bookmarked prompts yet</div>
          <p className="text-gray-600 mb-6 prompt-bar">Start exploring and bookmarking prompts to see them here!</p>
          <button onClick={() => (window.location.href = '/')} className="btn-primary">Explore Prompts</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedPrompts.map((prompt) => (
              <PromptCard
                key={prompt._id}
                prompt={prompt}
                onBookmarkToggle={() => {
                  handleRemovePrompt(prompt._id);
                  loadBookmarks(pagination.current);
                }}
                onRefresh={() => loadBookmarks(pagination.current)}
              />
            ))}
          </div>

          {/* Pagination */}
       {pagination && pagination.total > 1 && (
  <div className="flex justify-center mt-10">
    <div className="flex items-center space-x-2 bg-white dark:bg-[#161b22] px-4 py-3 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 transition-all duration-300">
      
  
      <button
        onClick={() => handlePageChange(pagination.current - 1)}
        disabled={!pagination.hasPrev}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            pagination.hasPrev
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed'
          }
        `}
      >
        ← Prev
      </button>

      <div className="flex items-center space-x-2">
        {Array.from({ length: pagination.total }).map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`w-9 h-9 rounded-md text-sm font-semibold transition-all duration-200 border
              ${
                pagination.current === i + 1
                  ? 'bg-blue-600 text-white shadow-md border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-black dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
              }
            `}
          >
            {i + 1}
          </button>
        ))}
      </div>

    
      <button
        onClick={() => handlePageChange(pagination.current + 1)}
        disabled={!pagination.hasNext}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
          ${
            pagination.hasNext
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
      )}
    </div>
  );
};

export default BookMarked;
