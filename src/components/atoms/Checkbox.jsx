import { motion } from 'framer-motion';
import ApperIcon from '../ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  size = 'md',
  className = '',
  disabled = false,
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20
  };

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onChange?.(!checked)}
      className={`
        ${sizes[size]} relative flex items-center justify-center
        border-2 rounded transition-all duration-150
        ${checked 
          ? 'bg-primary border-primary text-white' 
          : 'border-surface-300 hover:border-surface-400 bg-white'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-primary/50
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      disabled={disabled}
      {...props}
    >
      {checked && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ApperIcon name="Check" size={iconSizes[size]} />
        </motion.div>
      )}
    </motion.button>
  );
};

export default Checkbox;