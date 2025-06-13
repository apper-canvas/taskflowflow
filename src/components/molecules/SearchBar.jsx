import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';

const SearchBar = ({ onSearch, onFilterChange, categories = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery, onSearch]);

  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      status: selectedStatus
    });
  }, [selectedCategory, selectedStatus, onFilterChange]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedStatus('all');
    setShowFilters(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all';

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" size={18} className="text-surface-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={showFilters ? 'bg-surface-100' : ''}
        >
          <ApperIcon name="Filter" size={16} className="mr-2" />
          Filters
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-surface-500 hover:text-surface-700"
          >
            <ApperIcon name="X" size={16} />
          </Button>
        )}
      </div>

      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-surface-50 rounded-default border border-surface-200"
        >
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name} ({category.taskCount})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-surface-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;