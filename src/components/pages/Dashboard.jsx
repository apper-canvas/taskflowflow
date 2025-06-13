import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import TaskInput from '../molecules/TaskInput';
import TaskList from '../organisms/TaskList';
import CategorySidebar from '../organisms/CategorySidebar';
import SearchBar from '../molecules/SearchBar';
import ProgressWidget from '../molecules/ProgressWidget';
import { taskService, categoryService } from '@/services';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all'
  });

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksResult, categoriesResult] = await Promise.all([
        taskService.getAll(),
        categoryService.getAll()
      ]);
      setTasks(tasksResult);
      setCategories(categoriesResult);
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  // Filter tasks based on search and filters
  useEffect(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(query) ||
        task.notes.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    const categoryFilter = filters.category !== 'all' ? filters.category : selectedCategory;
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(task => 
        filters.status === 'completed' ? task.completed : !task.completed
      );
    }

    // Sort tasks: incomplete first, then by due date, then by priority
    filtered.sort((a, b) => {
      // Completed tasks go to bottom
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }

      // Sort by due date if both have one
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;

      // Sort by priority
      const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    setFilteredTasks(filtered);
  }, [tasks, searchQuery, filters, selectedCategory]);

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [newTask, ...prev]);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setFilters(prev => ({ ...prev, category: 'all' }));
  };

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    if (newFilters.category !== 'all') {
      setSelectedCategory('all');
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-surface-900 mb-2">
            Something went wrong
          </h2>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadTasks}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <CategorySidebar
              onCategorySelect={handleCategorySelect}
              selectedCategory={selectedCategory}
            />
            <div className="hidden lg:block">
              <ProgressWidget />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-heading font-bold text-surface-900 mb-2"
              >
                {selectedCategory === 'all' ? 'All Tasks' : `${selectedCategory} Tasks`}
              </motion.h1>
              <p className="text-surface-600">
                Stay organized and get things done efficiently
              </p>
            </div>

            {/* Quick Add */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <TaskInput onTaskCreated={handleTaskCreated} />
            </motion.div>

            {/* Mobile Progress Widget */}
            <div className="lg:hidden">
              <ProgressWidget />
            </div>

            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <SearchBar
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                categories={categories}
              />
            </motion.div>

            {/* Task List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <TaskList
                tasks={filteredTasks}
                onTaskUpdate={handleTaskUpdate}
                onTaskDelete={handleTaskDelete}
                loading={loading}
                allowBulkActions={true}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;