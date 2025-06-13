import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  animate = false,
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full';
  
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    high: 'bg-error/10 text-error',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success'
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const Component = animate ? motion.span : 'span';
  const motionProps = animate ? {
    whileHover: { scale: 1.05 },
    transition: { duration: 0.15 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Badge;