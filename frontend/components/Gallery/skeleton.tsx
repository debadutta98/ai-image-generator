'use client';

import React, { useEffect, useRef, useState } from 'react';

const GallerySkeleton: React.FC<React.HTMLProps<HTMLDivElement> & { maxWidth: number }> = function (
  props
) {
  const ref = useRef(null);
  const [cols, setCols] = useState<number>(4);

  useEffect(() => {
    if (ref.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const width: number = Math.floor(entries[0].contentBoxSize[0].inlineSize);
        setCols(Math.max(Math.floor(width / (props.maxWidth + 40)), 1));
      });
      resizeObserver.observe(ref.current);
      return () => {
        if (ref.current) {
          resizeObserver.unobserve(ref.current);
          resizeObserver.disconnect();
        }
      };
    }
  }, []);
  const gridItems: Array<Array<React.ReactNode>> = [];
  React.Children.forEach(props.children, (child, i) => {
    if (Array.isArray(gridItems[i % cols])) {
      gridItems[i % cols].push(child);
    } else {
      gridItems[i % cols] = [child];
    }
  });
  return (
    <div
      className={`w-full h-fit grid grid-cols-${cols} gap-x-10 justify-start ${props.className}`}
      ref={ref}
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(${props.maxWidth}px, 1fr))`
      }}
    >
      {gridItems.map((children, index) => (
        <div
          key={'grid-col-' + index}
          className={'grid grid-cols-1 gap-y-10 h-fit'}
          style={{ gridTemplateColumns: `repeat(1, minmax(${props.maxWidth}px, 1fr))` }}
        >
          {children.map((child, i) => (
            <React.Fragment key={'grid-item-' + i}>{child}</React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GallerySkeleton;
