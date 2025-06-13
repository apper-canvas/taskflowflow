import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import TaskCard from '../molecules/TaskCard';
import Button from '../atoms/Button';
import ApperIcon from '../ApperIcon';
import { taskService } from '@/services';

const TaskList = ({ 
  tasks = [], 
  onTaskUpdate, 
  onTaskDelete, 
  loading = false,
  allowBulkActions = true 
}) => {
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const handleSelectTask = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(t => t.id)));
    }
  };

  const handleBulkComplete = async () => {
    if (selectedTasks.size === 0 || bulkActionLoading) return;

    setBulkActionLoading(true);
    try {
      const taskIds = Array.from(selectedTasks);
      const updatedTasks = await taskService.bulkUpdate(taskIds, { completed: true });
      
      updatedTasks.forEach(task => onTaskUpdate(task));
      setSelectedTasks(new Set());
      toast.success(`${updatedTasks.length} tasks completed!`);
    } catch (error) {
      toast.error('Failed to complete tasks');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTasks.size === 0 || bulkActionLoading) return;
    
    if (!window.confirm(`Delete ${selectedTasks.size} selected tasks?`)) {
      return;
    }

    setBulkActionLoading(true);
    try {
      const taskIds = Array.from(selectedTasks);
      await taskService.bulkDelete(taskIds);
      
      taskIds.forEach(id => onTaskDelete(id));
      setSelectedTasks(new Set());
      toast.success(`${taskIds.length} tasks deleted`);
    } catch (error) {
      toast.error('Failed to delete tasks');
    } finally {
      setBulkActionLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedTasks(new Set());
  };

  // Clear selection when tasks change
  useEffect(() => {
    setSelectedTasks(prev => {
      const newSelected = new Set();
      prev.forEach(id => {
        if (tasks.some(t => t.id === id)) {
          newSelected.add(id);
        }
      });
      return newSelected;
    });
  }, [tasks]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-surface rounded-card p-4 shadow-sm"
          >
            <div className="animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 bg-surface-200 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="CheckCircle2" className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>
        <h3 className="mt-4 text-lg font-medium text-surface-900">No tasks found</h3>
        <p className="mt-2 text-surface-500">
          Create your first task to get started with your productivity journey
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {allowBulkActions && selectedTasks.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border border-primary/20"
        >
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-primary">
              {selectedTasks.size} task{selectedTasks.size !== 1 ? 's' : ''} selected
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSelection}
              className="text-surface-500"
            >
              Clear
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              onClick={handleBulkComplete}
              disabled={bulkActionLoading}
            >
              <ApperIcon name="Check" size={14} className="mr-2" />
              Complete
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleBulkDelete}
              disabled={bulkActionLoading}
              className="text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={14} className="mr-2" />
              Delete
            </Button>
          </div>
        </motion.div>
      )}

      {/* Select All */}
      {allowBulkActions && tasks.length > 1 && (
        <div className="flex items-center justify-between text-sm text-surface-600">
          <button
            onClick={handleSelectAll}
            className="flex items-center space-x-2 hover:text-primary transition-colors"
          >
            <span>
              {selectedTasks.size === tasks.length ? 'Deselect All' : 'Select All'}
            </span>
          </button>
          <span>{tasks.length} task{tasks.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {/* Task Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
              className="group"
            >
              <TaskCard
                task={task}
                onUpdate={onTaskUpdate}
                onDelete={onTaskDelete}
                isSelected={selectedTasks.has(task.id)}
                onSelect={allowBulkActions ? () => handleSelectTask(task.id) : undefined}
                showActions={true}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskList;