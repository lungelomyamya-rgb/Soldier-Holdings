/**
 * Typography Component
 * 
 * A flexible text component that enforces consistent typography
 * across the application with proper semantic HTML elements
 * Extends the Box component to support all spacing utilities
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Box, { BoxProps } from './Box';

type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

type TextWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
type TextColor = 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger' | 'info';

export interface TypographyProps extends Omit<BoxProps, 'as' | 'component'> {
  /** Typography variant */
  variant?: TextVariant;
  /** Override the HTML element */
  component?: React.ElementType;
  /** Font weight */
  weight?: TextWeight;
  /** Text color */
  color?: TextColor;
  /** Text alignment */
  align?: 'left' | 'center' | 'right' | 'justify';
  /** Add bottom margin */
  gutterBottom?: boolean;
  /** Prevent text from wrapping */
  noWrap?: boolean;
  /** Truncate text with an ellipsis */
  truncate?: boolean;
  /** Additional class name */
  className?: string;
}

const variantMapping: Record<TextVariant, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
  overline: 'span',
};

const Typography = forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'body1',
      component: Component,
      weight = 'normal',
      color = 'primary',
      align = 'left',
      gutterBottom = false,
      noWrap = false,
      truncate = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const elementType = Component || variantMapping[variant] || 'span';

    const classes = classNames(
      'typography',
      `typography-${variant}`,
      `text-${weight}`,
      `text-${color}`,
      `text-${align}`,
      {
        'mb-4': gutterBottom && !props.mb, // Only apply if mb is not explicitly set
        'whitespace-nowrap': noWrap,
        truncate,
      },
      className
    );

    return (
      <Box
        ref={ref}
        as={elementType as keyof JSX.IntrinsicElements}
        className={classes}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Typography.displayName = 'Typography';

export default Typography;
