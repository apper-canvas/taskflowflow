import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import ApperIcon from '../ApperIcon';
import Checkbox from '../atoms/Checkbox';
import Badge from '../atoms/Badge';
import Button from '../atoms/Button';
import { taskService } from '@/services';

const TaskCard = ({ 
  task, 
  onUpdate, 
  onDelete, 
  isSelected = false, 
  onSelect,
  showActions = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleComplete = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const updatedTask = await taskService.update(task.id, {
        completed: !task.completed
      });
      onUpdate(updatedTask);
      toast.success(task.completed ? 'Task marked as pending' : 'Task completed!');
    } catch (error) {
      toast.error('Failed to update task');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || isUpdating) return;
    
    setIsUpdating(true);
    try {
      const updatedTask = await taskService.update(task.id, {
        title: editTitle.trim()
      });
      onUpdate(updatedTask);
      setIsEditing(false);
      toast.success('Task updated');
    } catch (error) {
      toast.error('Failed to update task');
      setEditTitle(task.title);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      await taskService.delete(task.id);
      onDelete(task.id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setIsUpdating(false);
    }
  };

  const isOverdue = task.dueDate && !task.completed && isPast(new Date(task.dueDate));
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      className={`
        bg-surface rounded-card p-4 shadow-sm border-l-4 transition-all duration-200
        ${isSelected ? 'ring-2 ring-primary/50 bg-primary/5' : 'hover:shadow-card'}
        ${task.completed ? 'opacity-75' : ''}
        ${isOverdue ? 'border-l-error' : ''}
        ${isDueToday && !task.completed ? 'border-l-warning' : ''}
        ${!task.dueDate || (!isOverdue && !isDueToday) ? 'border-l-primary' : ''}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-0.5">
          <Checkbox
            checked={task.completed}
            onChange={handleToggleComplete}
            disabled={isUpdating}
          />
        </div>

        {onSelect && (
          <div className="flex-shrink-0 mt-0.5">
            <Checkbox
              checked={isSelected}
              onChange={onSelect}
              size="sm"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                className="flex-1 px-2 py-1 border border-surface-300 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
                disabled={isUpdating}
              />
              <Button
                size="sm"
                onClick={handleSaveEdit}
                disabled={!editTitle.trim() || isUpdating}
              >
                <ApperIcon name="Check" size={14} />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                disabled={isUpdating}
              >
                <ApperIcon name="X" size={14} />
              </Button>
            </div>
          ) : (
            <h3
              className={`font-medium text-surface-900 cursor-pointer hover:text-primary transition-colors ${
                task.completed ? 'line-through text-surface-500' : ''
              }`}
              onClick={() => showActions && setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}

          {task.notes && (
            <p className="mt-1 text-sm text-surface-600 break-words">
              {task.notes}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-2">
              <Badge variant={task.priority.toLowerCase()}>
                {task.priority}
              </Badge>
              
              <Badge variant="default">
                {task.category}
              </Badge>
            </div>

            {task.dueDate && (
              <div className={`text-xs flex items-center space-x-1 ${
                isOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-surface-500'
              }`}>
                <ApperIcon 
                  name={isOverdue ? 'AlertCircle' : 'Calendar'} 
                  size={12} 
                />
                <span>
                  {isToday(new Date(task.dueDate)) 
                    ? 'Today'
                    : format(new Date(task.dueDate), 'MMM d')
                  }
                </span>
              </div>
            )}
          </div>
        </div>

        {showActions && !isEditing && (
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditing(true)}
              disabled={isUpdating}
            >
              <ApperIcon name="Edit2" size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              disabled={isUpdating}
              className="text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={14} />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TaskCard;