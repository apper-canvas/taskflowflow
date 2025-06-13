import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Button from '../atoms/Button';
import { taskService, categoryService } from '@/services';

const TaskInput = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const result = await categoryService.getAll();
      setCategories(result);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isCreating) return;

    setIsCreating(true);
    try {
      const taskData = {
        title: title.trim(),
        category,
        priority,
        dueDate: dueDate || null,
        notes: notes.trim()
      };

      const newTask = await taskService.create(taskData);
      onTaskCreated(newTask);
      
      // Reset form
      setTitle('');
      setNotes('');
      setDueDate('');
      setIsExpanded(false);
      
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setIsCreating(false);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    if (categories.length === 0) {
      loadCategories();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setNotes('');
    setDueDate('');
    setIsExpanded(false);
  };

  return (
    <motion.div
      layout
      className="bg-surface rounded-card p-4 shadow-sm border border-surface-200"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <ApperIcon name="Plus" size={12} className="text-primary" />
            </div>
          </div>
          
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={handleFocus}
            placeholder="Add a new task..."
            className="flex-1 text-surface-900 placeholder-surface-400 bg-transparent border-none outline-none text-base"
            disabled={isCreating}
          />
        </div>

        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  disabled={isCreating}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  disabled={isCreating}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-surface-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  disabled={isCreating}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional details..."
                rows="2"
                className="w-full px-3 py-2 border border-surface-300 rounded-default focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                disabled={isCreating}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancel}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!title.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Add Task
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default TaskInput;