'use client';

import { Feed, GalleryProps } from '@/types';
import React, { useEffect, useRef, useState } from 'react';
import ImageCard from '../ImageCard';

const Gallery: React.FC<React.HTMLProps<HTMLDivElement> & GalleryProps> = function (props) {
  const ref = useRef(null);
  const [cols, setCols] = useState<number>(4);
  const [feeds, setFeeds] = useState<Array<Feed>>(props.feeds);
  const onSaveHandler = (id: string, action: 'add' | 'remove') => {
    setFeeds((prevFeeds) =>
      prevFeeds.map((prevFeed) => {
        const value = { ...prevFeed };
        if (value._id === id) {
          if (action === 'add') {
            value.isSaved = true;
          } else {
            value.isSaved = false;
          }
        }
        return value;
      })
    );
  };
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
  const gridItems: Array<Array<Feed>> = [];
  feeds.forEach((feed, i) => {
    if (Array.isArray(gridItems[i % cols])) {
      gridItems[i % cols].push(feed);
    } else {
      gridItems[i % cols] = [feed];
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
      {gridItems.map((feeds, index) => (
        <div
          key={'grid-col-' + index}
          className={'grid grid-cols-1 gap-y-10 h-fit'}
          style={{ gridTemplateColumns: `repeat(1, minmax(${props.maxWidth}px, 1fr))` }}
        >
          {feeds.map((feed) => (
            <ImageCard
              key={feed._id}
              feed={feed}
              onSave={onSaveHandler}
              isDisabled={props.isUserCollection}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Gallery;
