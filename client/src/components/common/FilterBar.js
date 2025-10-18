import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const FilterBar = ({ filters, onFilterChange, sortOptions }) => {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'chatgpt', label: 'ChatGPT' },
    { value: 'midjourney', label: 'Midjourney' },
    { value: 'dalle', label: 'DALL-E' },
    { value: 'bard', label: 'Bard' },
    { value: 'claude', label: 'Claude' },
    { value: 'other', label: 'Other' },
  ];

  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleSortChange = (e) => {
    const [sort, order] = e.target.value.split('-');
    onFilterChange({ sort, order });
  };

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 filter-bar">
      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 prompt-bar">Category:</label>
        <div className="relative">
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="filter-bar appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Sort Options */}
      <div className="flex items-center space-x-2">
        <label className="text-sm font-medium text-gray-700 prompt-bar">Sort by:</label>
        <div className="relative">
          <select
            value={`${filters.sort}-${filters.order}`}
            onChange={handleSortChange}
            className="filter-bar appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={`${option.value}-${filters.order}`}>
                {option.label}
              </option>
            ))}
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Order Toggle */}
      <button
        onClick={() => onFilterChange({ order: filters.order === 'desc' ? 'asc' : 'desc' })}
        className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-[#30363d] transition-colors"
      >
        {filters.order === 'desc' ? '↓' : '↑'}
      </button>

      {/* Active Filters Display */}
      {(filters.category !== 'all' || filters.search) && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 prompt-bar">Active filters:</span>
          {filters.category !== 'all' && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {categories.find(c => c.value === filters.category)?.label}
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Search: "{filters.search}"
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar; 