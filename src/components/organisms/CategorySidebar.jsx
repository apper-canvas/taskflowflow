import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import Badge from '../atoms/Badge';
import { categoryService } from '@/services';

const CategorySidebar = ({ onCategorySelect, selectedCategory = 'all' }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await categoryService.getAll();
        setCategories(result);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const totalTasks = categories.reduce((sum, cat) => sum + cat.taskCount, 0);

  if (loading) {
    return (
      <div className="w-full space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-10 bg-surface-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="font-heading font-semibold text-surface-900 mb-3">
          Categories
        </h2>
        
        {/* All Tasks */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onCategorySelect('all')}
          className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-150 ${
            selectedCategory === 'all'
              ? 'bg-primary text-white shadow-sm'
              : 'hover:bg-surface-100 text-surface-700'
          }`}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              selectedCategory === 'all' ? 'bg-white' : 'bg-surface-400'
            }`} />
            <span className="font-medium">All Tasks</span>
          </div>
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'default'}
            className={selectedCategory === 'all' ? 'bg-white/20 text-white' : ''}
          >
            {totalTasks}
          </Badge>
        </motion.button>
      </div>

      <div className="space-y-1">
        {categories.map((category, index) => (
          <motion.button
            key={category.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategorySelect(category.name)}
            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-150 ${
              selectedCategory === category.name
                ? 'bg-primary text-white shadow-sm'
                : 'hover:bg-surface-100 text-surface-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className="w-3 h-3 rounded-full"
                style={{ 
                  backgroundColor: selectedCategory === category.name 
                    ? 'white' 
                    : category.color 
                }}
              />
              <span className="font-medium">{category.name}</span>
            </div>
            <Badge
              variant={selectedCategory === category.name ? 'default' : 'default'}
              className={selectedCategory === category.name ? 'bg-white/20 text-white' : ''}
            >
              {category.taskCount}
            </Badge>
          </motion.button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-6 p-4 bg-surface-50 rounded-lg">
        <h3 className="font-medium text-surface-900 mb-2">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-center">
            <div className="font-bold text-primary">{totalTasks}</div>
            <div className="text-surface-600">Total</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-success">{categories.length}</div>
            <div className="text-surface-600">Categories</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySidebar;