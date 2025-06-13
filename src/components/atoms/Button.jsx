import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-default transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm hover:shadow-card',
    secondary: 'bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-sm hover:shadow-card',
    accent: 'bg-accent text-white hover:bg-accent/90 focus:ring-accent/50 shadow-sm hover:shadow-card',
    outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-primary/50',
    ghost: 'text-surface-700 hover:bg-surface-100 focus:ring-primary/50',
    danger: 'bg-error text-white hover:bg-error/90 focus:ring-error/50 shadow-sm hover:shadow-card'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className}`}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;