/**
 * Box Component
 * 
 * A foundational layout component that handles spacing, borders, and other
 * common styling needs. Serves as a base for other components.
 */

import React, { forwardRef } from 'react';
import classNames from 'classnames';

type SpacingScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 56 | 64 | 'px' | 'auto';
type BorderRadius = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface BoxProps extends Omit<React.HTMLAttributes<HTMLElement>, 'as'> {
  // Spacing
  p?: SpacingScale;
  px?: SpacingScale;
  py?: SpacingScale;
  pt?: SpacingScale;
  pr?: SpacingScale;
  pb?: SpacingScale;
  pl?: SpacingScale;
  m?: SpacingScale;
  mx?: SpacingScale;
  my?: SpacingScale;
  mt?: SpacingScale;
  mr?: SpacingScale;
  mb?: SpacingScale;
  ml?: SpacingScale;
  
  // Sizing
  width?: 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit' | string | number;
  height?: 'auto' | 'full' | 'screen' | 'min' | 'max' | 'fit' | string | number;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  
  // Layout
  display?: 'block' | 'inline-block' | 'inline' | 'flex' | 'inline-flex' | 'grid' | 'inline-grid' | 'none';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto' | 'clip';
  position?: 'static' | 'fixed' | 'absolute' | 'relative' | 'sticky';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number | 'auto';
  
  // Borders
  border?: boolean | 't' | 'r' | 'b' | 'l' | 'x' | 'y';
  borderColor?: string;
  borderTop?: boolean | string;
  borderRight?: boolean | string;
  borderBottom?: boolean | string;
  borderLeft?: boolean | string;
  borderRadius?: BorderRadius;
  
  // Background
  backgroundColor?: string;
  
  // Shadow
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';
  
  // Flex
  flex?: number | string;
  flexGrow?: number;
  flexShrink?: number;
  flexBasis?: string | number;
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  alignContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'stretch';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
  order?: number;
  
  // Grid
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  gridAutoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  gridGap?: SpacingScale;
  gridColumnGap?: SpacingScale;
  gridRowGap?: SpacingScale;
  
  // Typography
  fontSize?: string | number;
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black' | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textColor?: string;
  
  // Other
  opacity?: number;
  cursor?: string;
  pointerEvents?: 'auto' | 'none';
  userSelect?: 'none' | 'text' | 'all' | 'auto';
  visibility?: 'visible' | 'hidden' | 'collapse';
  
  // Custom class and style
  className?: string;
  style?: React.CSSProperties;
  
  // Element type
  as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
  
  children?: React.ReactNode;
}

const Box = forwardRef<HTMLElement, BoxProps>(
  (
    {
      // Spacing
      p, px, py, pt, pr, pb, pl,
      m, mx, my, mt, mr, mb, ml,
      
      // Sizing
      width, height,
      minWidth, maxWidth,
      minHeight, maxHeight,
      
      // Layout
      display = 'block',
      overflow,
      position,
      top, right, bottom, left,
      zIndex,
      
      // Borders
      border,
      borderColor,
      borderTop,
      borderRight,
      borderBottom,
      borderLeft,
      borderRadius,
      
      // Background
      backgroundColor,
      
      // Shadow
      shadow,
      
      // Flex
      flex,
      flexGrow,
      flexShrink,
      flexBasis,
      flexDirection,
      flexWrap,
      justifyContent,
      alignItems,
      alignContent,
      alignSelf,
      order,
      
      // Grid
      gridTemplateColumns,
      gridTemplateRows,
      gridColumn,
      gridRow,
      gridAutoFlow,
      gridGap,
      gridColumnGap,
      gridRowGap,
      
      // Typography
      fontSize,
      fontWeight,
      textAlign,
      lineHeight,
      letterSpacing,
      textColor,
      
      // Other
      opacity,
      cursor,
      pointerEvents,
      userSelect,
      visibility,
      
      // Custom class and style
      className,
      style,
      
      // Element type
      as: Element = 'div',
      
      children,
      ...props
    },
    ref
  ) => {
    const classes = classNames(
      {
        // Spacing
        [`p-${p}`]: p !== undefined,
        [`px-${px}`]: px !== undefined,
        [`py-${py}`]: py !== undefined,
        [`pt-${pt}`]: pt !== undefined,
        [`pr-${pr}`]: pr !== undefined,
        [`pb-${pb}`]: pb !== undefined,
        [`pl-${pl}`]: pl !== undefined,
        
        // Margin
        [`m-${m}`]: m !== undefined,
        [`mx-${mx}`]: mx !== undefined,
        [`my-${my}`]: my !== undefined,
        [`mt-${mt}`]: mt !== undefined,
        [`mr-${mr}`]: mr !== undefined,
        [`mb-${mb}`]: mb !== undefined,
        [`ml-${ml}`]: ml !== undefined,
        
        // Sizing
        [`w-${width}`]: width && typeof width === 'string' && !width.includes('%') && !width.includes('px'),
        [`h-${height}`]: height && typeof height === 'string' && !height.includes('%') && !height.includes('px'),
        
        // Layout
        [`d-${display}`]: display,
        [`overflow-${overflow}`]: overflow,
        [`position-${position}`]: position,
        [`z-${zIndex}`]: zIndex !== undefined,
        
        // Borders
        'border': border === true,
        'border-t': border === 't' || borderTop === true,
        'border-r': border === 'r' || borderRight === true,
        'border-b': border === 'b' || borderBottom === true,
        'border-l': border === 'l' || borderLeft === true,
        'border-x': border === 'x',
        'border-y': border === 'y',
        [`border-${borderColor}`]: borderColor,
        
        // Border Radius
        [`rounded-${borderRadius}`]: borderRadius,
        
        // Background
        [`bg-${backgroundColor}`]: backgroundColor,
        
        // Shadow
        [`shadow-${shadow}`]: shadow,
        
        // Flex
        [`flex-${flex}`]: flex !== undefined,
        [`flex-grow-${flexGrow}`]: flexGrow !== undefined,
        [`flex-shrink-${flexShrink}`]: flexShrink !== undefined,
        [`flex-basis-${flexBasis}`]: flexBasis !== undefined,
        [`flex-${flexDirection}`]: flexDirection,
        [`flex-${flexWrap}`]: flexWrap,
        [`justify-${justifyContent?.replace('flex-', '')}`]: justifyContent,
        [`items-${alignItems?.replace('flex-', '')}`]: alignItems,
        [`content-${alignContent?.replace('flex-', '')}`]: alignContent,
        [`self-${alignSelf?.replace('flex-', '')}`]: alignSelf,
        [`order-${order}`]: order !== undefined,
        
        // Grid
        [`grid-cols-${gridTemplateColumns}`]: gridTemplateColumns,
        [`grid-rows-${gridTemplateRows}`]: gridTemplateRows,
        [`col-${gridColumn}`]: gridColumn,
        [`row-${gridRow}`]: gridRow,
        [`grid-flow-${gridAutoFlow?.replace(' ', '-')}`]: gridAutoFlow,
        [`gap-${gridGap}`]: gridGap !== undefined,
        [`gap-x-${gridColumnGap}`]: gridColumnGap !== undefined,
        [`gap-y-${gridRowGap}`]: gridRowGap !== undefined,
        
        // Typography
        [`text-${fontSize}`]: fontSize && typeof fontSize === 'string',
        [`font-${fontWeight}`]: fontWeight && typeof fontWeight === 'string',
        [`text-${textAlign}`]: textAlign,
        [`leading-${lineHeight}`]: lineHeight && typeof lineHeight === 'string',
        [`tracking-${letterSpacing}`]: letterSpacing && typeof letterSpacing === 'string',
        [`text-${textColor}`]: textColor,
        
        // Other
        [`opacity-${opacity}`]: opacity !== undefined,
        [`cursor-${cursor}`]: cursor,
        [`pointer-events-${pointerEvents}`]: pointerEvents,
        [`select-${userSelect}`]: userSelect,
        [`visibility-${visibility}`]: visibility,
      },
      className
    );

    const styles = {
      // Sizing
      ...(width && (typeof width === 'number' || width.includes('px') || width.includes('%') || width.includes('vw') || width.includes('vh')) && { width }),
      ...(height && (typeof height === 'number' || height.includes('px') || height.includes('%') || height.includes('vh') || height.includes('vw')) && { height }),
      ...(minWidth && { minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }),
      ...(maxWidth && { maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth }),
      ...(minHeight && { minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight }),
      ...(maxHeight && { maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }),
      
      // Position
      ...(top !== undefined && { top: typeof top === 'number' ? `${top}px` : top }),
      ...(right !== undefined && { right: typeof right === 'number' ? `${right}px` : right }),
      ...(bottom !== undefined && { bottom: typeof bottom === 'number' ? `${bottom}px` : bottom }),
      ...(left !== undefined && { left: typeof left === 'number' ? `${left}px` : left }),
      
      // Borders
      ...(borderTop && typeof borderTop === 'string' && { borderTop }),
      ...(borderRight && typeof borderRight === 'string' && { borderRight }),
      ...(borderBottom && typeof borderBottom === 'string' && { borderBottom }),
      ...(borderLeft && typeof borderLeft === 'string' && { borderLeft }),
      
      // Flex
      ...(flex !== undefined && { flex }),
      ...(flexGrow !== undefined && { flexGrow }),
      ...(flexShrink !== undefined && { flexShrink }),
      ...(flexBasis !== undefined && { flexBasis }),
      ...(flexDirection && { flexDirection }),
      ...(flexWrap && { flexWrap }),
      ...(justifyContent && { justifyContent }),
      ...(alignItems && { alignItems }),
      ...(alignContent && { alignContent }),
      ...(alignSelf && { alignSelf }),
      ...(order !== undefined && { order }),
      
      // Grid
      ...(gridTemplateColumns && { gridTemplateColumns }),
      ...(gridTemplateRows && { gridTemplateRows }),
      ...(gridColumn && { gridColumn }),
      ...(gridRow && { gridRow }),
      ...(gridAutoFlow && { gridAutoFlow }),
      ...(gridGap !== undefined && { gap: gridGap }),
      ...(gridColumnGap !== undefined && { columnGap: gridColumnGap }),
      ...(gridRowGap !== undefined && { rowGap: gridRowGap }),
      
      // Typography
      ...(fontSize && typeof fontSize === 'number' && { fontSize: `${fontSize}px` }),
      ...(fontWeight && typeof fontWeight === 'number' && { fontWeight }),
      ...(textAlign && { textAlign }),
      ...(lineHeight && typeof lineHeight === 'number' && { lineHeight: `${lineHeight}px` }),
      ...(letterSpacing && typeof letterSpacing === 'number' && { letterSpacing: `${letterSpacing}px` }),
      ...(textColor && { color: textColor }),
      
      // Other
      ...(opacity !== undefined && { opacity }),
      ...(cursor && { cursor }),
      ...(pointerEvents && { pointerEvents }),
      ...(userSelect && { userSelect }),
      ...(visibility && { visibility }),
      
      // Custom style
      ...style,
    };

    return (
      <Element ref={ref} className={classes} style={Object.keys(styles).length > 0 ? styles : undefined} {...props}>
        {children}
      </Element>
    );
  }
);

Box.displayName = 'Box';

export default Box;
