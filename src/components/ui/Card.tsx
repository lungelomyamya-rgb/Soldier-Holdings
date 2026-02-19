/**
 * Card Component
 * 
 * A flexible container component for grouping related content
 * Supports multiple variants, hover effects, and custom content
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: 'elevate' | 'scale' | 'none';
  fullHeight?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className = '',
      variant = 'elevated',
      padding = 'md',
      hoverEffect = 'none',
      fullHeight = false,
      header,
      footer,
      children,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      'card',
      `card-${variant}`,
      `card-padding-${padding}`,
      {
        'card-hover-elevate': hoverEffect === 'elevate',
        'card-hover-scale': hoverEffect === 'scale',
        'card-full-height': fullHeight,
      },
      className
    );

    return (
      <div ref={ref} className={classes} {...props}>
        {header && <div className="card-header">{header}</div>}
        <div className="card-content">{children}</div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
