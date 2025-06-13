import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import TaskCard from '../molecules/TaskCard';
import ApperIcon from '../ApperIcon';
import { taskService } from '@/services';

const Archive = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupBy, setGroupBy] = useState('date'); // 'date' or 'category'

  useEffect(() => {
    const loadCompletedTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await taskService.getByStatus(true);
        setCompletedTasks(result);
      } catch (err) {
        setError(err.message || 'Failed to load completed tasks');
      } finally {
        setLoading(false);
      }
    };

    loadCompletedTasks();
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    if (updatedTask.completed) {
      setCompletedTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ));
    } else {
      // Remove from archive if uncompleted
      setCompletedTasks(prev => prev.filter(task => task.id !== updatedTask.id));
    }
  };

  const handleTaskDelete = (taskId) => {
    setCompletedTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const groupTasksByDate = (tasks) => {
    const groups = {};
    tasks.forEach(task => {
      const date = format(new Date(task.createdAt), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(task);
    });
    return groups;
  };

  const groupTasksByCategory = (tasks) => {
    const groups = {};
    tasks.forEach(task => {
      if (!groups[task.category]) {
        groups[task.category] = [];
      }
      groups[task.category].push(task);
    });
    return groups;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="space-y-6">
            <div className="animate-pulse">
              <div className="h-8 bg-surface-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-20 bg-surface-200 rounded-card"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-surface-900 mb-2">
            Failed to load archive
          </h2>
          <p className="text-surface-600">{error}</p>
        </div>
      </div>
    );
  }

  const groupedTasks = groupBy === 'date' 
    ? groupTasksByDate(completedTasks)
    : groupTasksByCategory(completedTasks);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-heading font-bold text-surface-900"
              >
                Archive
              </motion.h1>
              <p className="text-surface-600 mt-1">
                {completedTasks.length} completed task{completedTasks.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setGroupBy('date')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  groupBy === 'date'
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                By Date
              </button>
              <button
                onClick={() => setGroupBy('category')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  groupBy === 'category'
                    ? 'bg-primary text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                By Category
              </button>
            </div>
          </div>

          {/* Content */}
          {completedTasks.length === 0 ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <ApperIcon name="Archive" className="w-16 h-16 text-surface-300 mx-auto" />
              </motion.div>
              <h3 className="mt-4 text-lg font-medium text-surface-900">
                No completed tasks yet
              </h3>
              <p className="mt-2 text-surface-500">
                Tasks you complete will appear here for future reference
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTasks).map(([groupKey, tasks], groupIndex) => (
                <motion.div
                  key={groupKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: groupIndex * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-surface-900">
                      {groupBy === 'date' 
                        ? format(new Date(groupKey), 'MMMM d, yyyy')
                        : groupKey
                      }
                    </h2>
                    <div className="flex-1 h-px bg-surface-200"></div>
                    <span className="text-sm text-surface-500">
                      {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {tasks.map((task, taskIndex) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (groupIndex * 0.1) + (taskIndex * 0.05) }}
                      >
                        <TaskCard
                          task={task}
                          onUpdate={handleTaskUpdate}
                          onDelete={handleTaskDelete}
                          showActions={true}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Archive;