import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';
import { statsService } from '@/services';

const ProgressWidget = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await statsService.getOverallStats();
        setStats(result);
      } catch (error) {
        console.error('Failed to load stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface rounded-card p-4 shadow-sm">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-surface-200 rounded w-3/4"></div>
          <div className="h-8 bg-surface-200 rounded"></div>
          <div className="h-4 bg-surface-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const todayProgress = stats.todayTotal > 0 ? (stats.todayCompleted / stats.todayTotal) * 100 : 0;
  const weekProgress = stats.weekTotal > 0 ? (stats.weekCompleted / stats.weekTotal) * 100 : 0;

  return (
    <div className="bg-surface rounded-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-surface-900">
          Your Progress
        </h3>
        <ApperIcon name="TrendingUp" size={20} className="text-success" />
      </div>

      <div className="space-y-4">
        {/* Today's Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-surface-600">Today</span>
            <span className="font-medium text-surface-900">
              {stats.todayCompleted}/{stats.todayTotal}
            </span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todayProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
            />
          </div>
        </div>

        {/* Weekly Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-surface-600">This Week</span>
            <span className="font-medium text-surface-900">
              {stats.weekCompleted}/{stats.weekTotal}
            </span>
          </div>
          <div className="w-full bg-surface-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${weekProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="bg-gradient-to-r from-success to-info h-2 rounded-full"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-surface-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {stats.currentStreak}
            </div>
            <div className="text-xs text-surface-600">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">
              {stats.completedTasks}
            </div>
            <div className="text-xs text-surface-600">Completed</div>
          </div>
        </div>

        {/* Overdue Tasks Warning */}
        {stats.overdueTasks > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2 p-2 bg-error/10 rounded-default"
          >
            <ApperIcon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm text-error">
              {stats.overdueTasks} overdue task{stats.overdueTasks !== 1 ? 's' : ''}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProgressWidget;