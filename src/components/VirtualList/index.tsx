import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { VirtualListProps, VirtualListItem } from './types';
import './index.css';

const VirtualList = <T extends VirtualListItem>({
  items,
  itemHeight,
  containerHeight = 400,
  buffer = 5,
  renderItem,
  style,
  className = ''
}: VirtualListProps<T>) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [actualContainerHeight, setActualContainerHeight] = useState(containerHeight);
  const rootRef = useRef<HTMLDivElement>(null);
  const tickingRef = useRef(false);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  // 设置容器高度和监听尺寸变化
  useEffect(() => {
    if (!containerHeight && rootRef.current) {
      setActualContainerHeight(rootRef.current.clientHeight || 400);
      
      // 使用 ResizeObserver 监听容器尺寸变化
      if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(entries => {
          const height = entries[0]?.contentRect?.height;
          if (height) {
            setActualContainerHeight(height);
          }
        });
        ro.observe(rootRef.current);
        resizeObserverRef.current = ro;
        
        return () => {
          ro.disconnect();
        };
      }
    } else {
      setActualContainerHeight(containerHeight);
    }
  }, [containerHeight]);

  // 计算总高度
  const totalHeight = useMemo(() => items.length * itemHeight, [items.length, itemHeight]);

  // 计算可见数量（一次渲染的项数 = 可见行数 + 两倍 buffer）
  const visibleCount = useMemo(() => {
    const base = Math.floor(actualContainerHeight / itemHeight);
    return base + buffer * 2;
  }, [actualContainerHeight, itemHeight, buffer]);

  // 计算开始索引（startIndex）、结束索引（endIndex）
  const { startIndex, endIndex } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const end = Math.min(items.length, start + visibleCount);
    return { startIndex: start, endIndex: end };
  }, [scrollTop, itemHeight, buffer, items.length, visibleCount]);

  // 计算可见项
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex);
  }, [items, startIndex, endIndex]);

  // 计算偏移
  const offset = useMemo(() => {
    return startIndex * itemHeight;
  }, [startIndex, itemHeight]);

  // 处理滚动事件
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (!rootRef.current) return;
    
    if (!tickingRef.current) {
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setScrollTop(rootRef.current?.scrollTop || 0);
        tickingRef.current = false;
      });
    }
  }, []);

  // 监听items变化，调整scrollTop
  useEffect(() => {
    if (!rootRef.current) return;
    
    const maxScroll = Math.max(0, totalHeight - actualContainerHeight);
    if (rootRef.current.scrollTop > maxScroll) {
      rootRef.current.scrollTop = maxScroll;
      setScrollTop(rootRef.current.scrollTop);
    }
  }, [items.length, totalHeight, actualContainerHeight]);

  return (
    <div
      ref={rootRef}
      className={`virtual-list ${className}`}
      style={{
        height: `${actualContainerHeight}px`,
        ...style
      }}
      onScroll={handleScroll}
    >
      {/* 内容区域 */}
      <div
        className="virtual-list-content"
        style={{ height: `${totalHeight}px` }}
      >
        <div
          className="virtual-list-inner"
          style={{ transform: `translateY(${offset}px)` }}
        >
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              className="virtual-list-item"
              style={{
                height: `${itemHeight}px`,
                boxSizing: 'border-box'
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualList;
