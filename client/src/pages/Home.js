import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { getPrompts } from '../api/prompts';
import PromptCard from '../components/prompts/PromptCard';
import SearchBar from '../components/common/SearchBar';
import FilterBar from '../components/common/FilterBar';
import { FiTrendingUp, FiClock, FiHeart, FiEye } from 'react-icons/fi';

const Home = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    tags: '',
    sort: 'createdAt',
    order: 'desc',
    page: 1
  });

  const { data, isLoading, error, refetch } = useQuery(
    ['prompts', filters],
    () => getPrompts(filters),
    {
      keepPreviousData: true,
    }
  );

  const handleSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);


  const sortOptions = [
  { value: 'newest', label: 'Latest', icon: FiClock },          
  { value: 'mostViewed', label: 'Most Viewed', icon: FiEye },  
  { value: 'mostUsed', label: 'Most Used', icon: FiTrendingUp },
  { value: 'popular', label: 'Most voted', icon: FiHeart },     
];


  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">Error loading prompts</div>
        <button 
          onClick={() => refetch()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container">
    
      <div className="text-center section">
        <h1 className="section-title">
          Discover Amazing AI Prompts
        </h1>
        <p className="section-subtitle">
          Share, discover, and use high-quality prompts for ChatGPT, Midjourney, and other AI tools. 
          Join our community of AI enthusiasts and creators.
        </p>
        
        
        <div className="search-bar max-w-2xl mx-auto mb-8 ">
          <SearchBar onSearch={handleSearch} placeholder="Search prompts, tags, or authors..." />
        </div>

        <div className="flex justify-center space-x-8 text-sm pro-text-muted">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Live Search</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Real-time Updates</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Community Driven</span>
          </div>
        </div>
      </div>

  
      <div className="mb-8 filter-bar">
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          sortOptions={sortOptions}
        />
      </div>
     


    
      <div className="mb-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="pro-card animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-20 bg-gray-200 rounded mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data?.prompts?.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
              {data.prompts.map((prompt) => (
                <PromptCard key={prompt._id} prompt={prompt} />
              ))}
            </div>

         {data.pagination && data.pagination.total > 1 && (
  <div className="flex justify-center mt-10">
    <div className="flex items-center space-x-2 px-4 py-3 rounded-xl shadow-lg border border-gray-300 dark:border-gray-700 dark:bg-[#161b22] bg-white">
      
    
      <button
        onClick={() => handlePageChange(data.pagination.current - 1)}
        disabled={!data.pagination.hasPrev}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
          ${
            data.pagination.hasPrev
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
          }
        `}
      >
        ← Prev
      </button>

      
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

 
      <button
        onClick={() => handlePageChange(data.pagination.current + 1)}
        disabled={!data.pagination.hasNext}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
          ${
            data.pagination.hasNext
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
              : 'bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
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
            <div className="pro-text-muted text-lg mb-4">
              {filters.search || filters.category !== 'all' || filters.tags
                ? 'No prompts found matching your criteria'
                : 'No prompts available yet'
              }
            </div>
            {filters.search || filters.category !== 'all' || filters.tags ? (
              <button
                onClick={() => setFilters({
                  search: '',
                  category: 'all',
                  tags: '',
                  sort: 'createdAt',
                  order: 'desc',
                  page: 1
                })}
                className="pro-btn-secondary"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 