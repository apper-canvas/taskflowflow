import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import { statsService, taskService } from '@/services';

const Settings = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [overallStats, categoryStats, priorityStats] = await Promise.all([
          statsService.getOverallStats(),
          statsService.getCategoryStats(),
          statsService.getPriorityStats()
        ]);
        
        setStats({
          overall: overallStats,
          categories: categoryStats,
          priorities: priorityStats
        });
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleClearCompleted = async () => {
    if (!window.confirm('This will permanently delete all completed tasks. Are you sure?')) {
      return;
    }

    setClearing(true);
    try {
      const completedTasks = await taskService.getByStatus(true);
      const completedIds = completedTasks.map(t => t.id);
      
      if (completedIds.length > 0) {
        await taskService.bulkDelete(completedIds);
        toast.success(`Cleared ${completedIds.length} completed tasks`);
        
        // Reload stats
        const newStats = await statsService.getOverallStats();
        setStats(prev => ({ ...prev, overall: newStats }));
      } else {
        toast.info('No completed tasks to clear');
      }
    } catch (error) {
      toast.error('Failed to clear completed tasks');
    } finally {
      setClearing(false);
    }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-32 bg-surface-200 rounded-card"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-heading font-bold text-surface-900"
            >
              Settings & Statistics
            </motion.h1>
            <p className="text-surface-600 mt-1">
              Manage your TaskFlow preferences and view detailed statistics
            </p>
          </div>

          {/* Overall Statistics */}
          {stats?.overall && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface rounded-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center">
                <ApperIcon name="BarChart3" className="mr-2" />
                Overall Statistics
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-surface-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">
                    {stats.overall.totalTasks}
                  </div>
                  <div className="text-sm text-surface-600">Total Tasks</div>
                </div>
                
                <div className="text-center p-4 bg-surface-50 rounded-lg">
                  <div className="text-2xl font-bold text-success">
                    {stats.overall.completedTasks}
                  </div>
                  <div className="text-sm text-surface-600">Completed</div>
                </div>
                
                <div className="text-center p-4 bg-surface-50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">
                    {stats.overall.overdueTasks}
                  </div>
                  <div className="text-sm text-surface-600">Overdue</div>
                </div>
                
                <div className="text-center p-4 bg-surface-50 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">
                    {stats.overall.currentStreak}
                  </div>
                  <div className="text-sm text-surface-600">Day Streak</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Category Statistics */}
          {stats?.categories && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface rounded-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center">
                <ApperIcon name="FolderOpen" className="mr-2" />
                Category Breakdown
              </h2>
              
              <div className="space-y-3">
                {Object.entries(stats.categories).map(([category, data]) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                    <div className="font-medium text-surface-900">{category}</div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-surface-600">
                        {data.completed}/{data.total} completed
                      </span>
                      <div className="w-20 bg-surface-200 rounded-full h-2">
                        <div
                          className="bg-success h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${data.total > 0 ? (data.completed / data.total) * 100 : 0}%` 
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Priority Statistics */}
          {stats?.priorities && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface rounded-card p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center">
                <ApperIcon name="Flag" className="mr-2" />
                Priority Distribution
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(stats.priorities).map(([priority, data]) => {
                  const completionRate = data.total > 0 ? (data.completed / data.total) * 100 : 0;
                  const priorityColors = {
                    high: 'text-error',
                    medium: 'text-warning',
                    low: 'text-success'
                  };
                  
                  return (
                    <div key={priority} className="p-4 bg-surface-50 rounded-lg">
                      <div className={`text-lg font-semibold capitalize ${priorityColors[priority]}`}>
                        {priority} Priority
                      </div>
                      <div className="text-2xl font-bold text-surface-900 mt-1">
                        {data.total}
                      </div>
                      <div className="text-sm text-surface-600">
                        {data.completed} completed ({Math.round(completionRate)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Data Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface rounded-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center">
              <ApperIcon name="Database" className="mr-2" />
              Data Management
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-surface-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-surface-900">Clear Completed Tasks</h3>
                  <p className="text-sm text-surface-600 mt-1">
                    Permanently delete all completed tasks to free up space
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleClearCompleted}
                  disabled={clearing}
                  className="text-error hover:bg-error/10"
                >
                  {clearing ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                      Clearing...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Trash2" size={16} className="mr-2" />
                      Clear Completed
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface rounded-card p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-surface-900 mb-4 flex items-center">
              <ApperIcon name="Info" className="mr-2" />
              About TaskFlow
            </h2>
            
            <div className="text-surface-600 space-y-2">
              <p>
                TaskFlow is designed to help busy professionals manage their daily tasks
                with minimal friction and maximum efficiency.
              </p>
              <p>
                Features include smart categorization, priority management, due date tracking,
                and comprehensive progress statistics to keep you motivated and organized.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;