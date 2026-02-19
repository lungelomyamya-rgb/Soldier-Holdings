/**
 * Flex Component
 * 
 * A layout component that provides a flexible box layout with consistent spacing
 * and alignment utilities, built on top of CSS Flexbox
 * Extends the Box component to support all spacing utilities
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Box, { BoxProps } from './Box';

type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';
type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
type AlignItems = 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
type AlignContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';

export interface FlexProps extends Omit<BoxProps, 'as' | 'display'> {
  /** Flex direction */
  direction?: FlexDirection;
  /** Flex wrap behavior */
  wrap?: FlexWrap;
  /** Justify content alignment */
  justify?: JustifyContent;
  /** Align items alignment */
  align?: AlignItems;
  /** Align content alignment */
  alignContent?: AlignContent;
  /** Gap between items */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 'px';
  /** Make flex container full width */
  fullWidth?: boolean;
  /** Make flex container full height */
  fullHeight?: boolean;
  /** Use inline-flex instead of flex */
  inline?: boolean;
  /** Flex shorthand property */
  flex?: number | string;
  /** Flex wrap property */
  flexWrap?: FlexWrap;
  /** Flex direction property */
  flexDirection?: FlexDirection;
  /** Justify content property */
  justifyContent?: JustifyContent;
  /** Align items property */
  alignItems?: AlignItems;
  /** Align self property */
  alignSelf?: 'auto' | AlignItems;
  /** Flex grow property */
  flexGrow?: number;
  /** Flex shrink property */
  flexShrink?: number;
  /** Flex basis property */
  flexBasis?: string | number;
  /** Order property */
  order?: number;
  /** Additional class name */
  className?: string;
  /** Additional styles */
  style?: React.CSSProperties;
  /** Render as a different HTML element or component */
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
}

const Flex = forwardRef<HTMLElement, FlexProps>(
  (
    {
      direction = 'row',
      wrap = 'nowrap',
      justify = 'flex-start',
      align = 'stretch',
      alignContent = 'stretch',
      gap,
      fullWidth = false,
      fullHeight = false,
      inline = false,
      flex,
      flexWrap = wrap,
      flexDirection = direction,
      justifyContent = justify,
      alignItems = align,
      alignSelf,
      flexGrow,
      flexShrink,
      flexBasis,
      order,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      {
        'flex': !inline,
        'inline-flex': inline,
        'w-full': fullWidth,
        'h-full': fullHeight,
        'gap-0': gap === 0,
        'gap-1': gap === 1,
        'gap-2': gap === 2,
        'gap-3': gap === 3,
        'gap-4': gap === 4,
        'gap-5': gap === 5,
        'gap-6': gap === 6,
        'gap-8': gap === 8,
        'gap-10': gap === 10,
        'gap-12': gap === 12,
        'gap-16': gap === 16,
        'gap-20': gap === 20,
        'gap-24': gap === 24,
        'gap-32': gap === 32,
        'gap-40': gap === 40,
        'gap-48': gap === 48,
        'gap-56': gap === 56,
        'gap-64': gap === 64,
        'gap-px': gap === 'px',
        // Flex direction
        'flex-row': flexDirection === 'row',
        'flex-row-reverse': flexDirection === 'row-reverse',
        'flex-col': flexDirection === 'column',
        'flex-col-reverse': flexDirection === 'column-reverse',
        // Flex wrap
        'flex-nowrap': flexWrap === 'nowrap',
        'flex-wrap': flexWrap === 'wrap',
        'flex-wrap-reverse': flexWrap === 'wrap-reverse',
        // Justify content
        'justify-start': justifyContent === 'flex-start',
        'justify-end': justifyContent === 'flex-end',
        'justify-center': justifyContent === 'center',
        'justify-between': justifyContent === 'space-between',
        'justify-around': justifyContent === 'space-around',
        'justify-evenly': justifyContent === 'space-evenly',
        // Align items
        'items-start': alignItems === 'flex-start',
        'items-end': alignItems === 'flex-end',
        'items-center': alignItems === 'center',
        'items-baseline': alignItems === 'baseline',
        'items-stretch': alignItems === 'stretch',
        // Align content
        'content-start': alignContent === 'flex-start',
        'content-end': alignContent === 'flex-end',
        'content-center': alignContent === 'center',
        'content-between': alignContent === 'space-between',
        'content-around': alignContent === 'space-around',
        'content-stretch': alignContent === 'stretch',
        // Align self
        'self-auto': alignSelf === 'auto',
        'self-start': alignSelf === 'flex-start',
        'self-end': alignSelf === 'flex-end',
        'self-center': alignSelf === 'center',
        'self-baseline': alignSelf === 'baseline',
        'self-stretch': alignSelf === 'stretch',
      },
      className
    );

    return (
      <Box
        ref={ref}
        className={classes}
        display={inline ? 'inline-flex' : 'flex'}
        flex={flex}
        flexGrow={flexGrow}
        flexShrink={flexShrink}
        flexBasis={flexBasis}
        order={order}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Flex.displayName = 'Flex';

export default Flex;
