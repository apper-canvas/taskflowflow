import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-surface-700 mb-1">
          {label}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        className={`
          w-full px-3 py-2 border rounded-default
          ${error 
            ? 'border-error focus:ring-error/50 focus:border-error' 
            : 'border-surface-300 focus:ring-primary/50 focus:border-primary'
          }
          focus:outline-none focus:ring-2 transition-all duration-150
          placeholder-surface-400 text-surface-900
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;