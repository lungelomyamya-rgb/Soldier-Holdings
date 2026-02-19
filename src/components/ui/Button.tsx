/**
 * Base Button Component
 *
 * Consistent button styling and behavior across the application
 * Supports multiple variants, sizes, and accessibility features
 */

import React, { forwardRef } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'btn';
    const variantClasses = `btn-${variant}`;
    const sizeClasses = `btn-${size}`;
    const widthClasses = fullWidth ? 'btn-full-width' : '';
    const loadingClasses = loading ? 'btn-loading' : '';
    
    const classes = [
      baseClasses,
      variantClasses,
      sizeClasses,
      widthClasses,
      loadingClasses,
      className
    ].filter(Boolean).join(' ');

    const renderIcon = () => {
      if (!icon && !loading) return null;
      
      if (loading) {
        return <i className="fas fa-spinner fa-spin" aria-hidden="true" />;
      }
      
      return <i className={`fas ${icon}`} aria-hidden="true" />;
    };

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? 'loading-description' : undefined}
        {...props}
      >
        {iconPosition === 'left' && renderIcon()}
        <span className="btn-text">{children}</span>
        {iconPosition === 'right' && renderIcon()}
        {loading && (
          <span id="loading-description" className="sr-only">
            Loading, please wait
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
