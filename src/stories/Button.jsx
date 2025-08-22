import React from 'react';

const Button = ({ primary, backgroundColor, size, label, className = '', ...props }) => {
  // Don't import CSS here - let the consuming project handle styles
  
  const baseStyles = 'font-medium rounded-lg transition-colors';
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base', 
    large: 'px-6 py-3 text-lg'
  };
  
  const variantStyles = primary 
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-900';
    
  const buttonClasses = `${baseStyles} ${variantStyles} ${sizeStyles[size]} ${className}`;
  
  return (
    <button
      type="button"
      className={buttonClasses}
      style={backgroundColor ? { backgroundColor } : undefined}
      {...props}
    >
      {label}
    </button>
  );
};

export default Button;