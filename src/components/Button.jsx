import React from 'react'

const Button = ({ 
  children, 
  variant = 'primary',
  outline = false,
  size = 'md',
  disabled = false,
  className = '', 
  ...props 
}) => {
  // Base styles that apply to all buttons
  const baseStyles = 'font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  // Solid variant styles
  const variants = {
    primary: 'bg-primary hover:bg-primary/90 text-white focus:ring-primary',
    secondary: 'bg-secondary hover:bg-secondary/90 text-black focus:ring-secondary',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
  }
  
  // Outline variant styles
  const outlineVariants = {
    primary: 'border-2 border-primary text-primary hover:bg-primary-50 focus:ring-primary-500 bg-transparent',
    secondary: 'border-2 border-secondary text-secondary hover:bg-secondary focus:ring-secondary bg-transparent',
    danger: 'border-2 border-red-600 text-red-600 hover:bg-red-50 focus:ring-red-500 bg-transparent'
  }
  
  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  }
  
  // Choose the correct variant based on outline prop
  const variantStyles = outline ? outlineVariants[variant] : variants[variant]
  
  // Combine all classes
  const buttonClasses = `${baseStyles} ${variantStyles} ${sizes[size]} ${className}`
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button