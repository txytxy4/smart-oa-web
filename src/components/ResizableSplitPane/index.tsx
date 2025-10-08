import React, { useCallback, useEffect, useRef, useState } from 'react';

interface ResizableSplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialLeftWidth?: number;
  minLeft?: number;
  minRight?: number;
  storageKey?: string;
  className?: string;
  style?: React.CSSProperties;
  onResize?: (leftWidth: number) => void;
}

export default function ResizableSplitPane(props: ResizableSplitPaneProps) {
  const {
    left,
    right,
    initialLeftWidth = 300,
    minLeft = 160,
    minRight = 200,
    storageKey = null,
    className = '',
    style = {},
    onResize,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startLeftWidthRef = useRef(initialLeftWidth);

  const [leftWidth, setLeftWidth] = useState(() => {
    try {
      if (storageKey && typeof window !== 'undefined') {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return initialLeftWidth;
        const v = parseInt(raw, 10);
        if (!Number.isNaN(v)) return v;
      }
    } catch {
      // ignore
    }
    return initialLeftWidth;
  });

  const doResize = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    let next = startLeftWidthRef.current + (clientX - startXRef.current);
    const maxLeft = rect.width - minRight;
    next = Math.max(minLeft, Math.min(maxLeft, next));
    setLeftWidth(next);
    onResize?.(next); // 触发回调
    try {
      if (storageKey) localStorage.setItem(storageKey, String(next));
    } catch (e) {
        console.log('e', e)
    }
  }, [minRight, minLeft, onResize, storageKey]);

  useEffect(() => {
    const onResize = () => {
      const c = containerRef.current;
      if (!c) return;
      const maxLeft = c.clientWidth - minRight;
      setLeftWidth(w => Math.max(minLeft, Math.min(maxLeft, w)));
    };
    window.addEventListener('resize', onResize);
    onResize();
    return () => window.removeEventListener('resize', onResize);
  }, [minLeft, minRight]);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!draggingRef.current) return;
      // support touch & mouse
      const clientX = (e as TouchEvent).touches && (e as TouchEvent).touches[0] 
        ? (e as TouchEvent).touches[0].clientX 
        : (e as MouseEvent).clientX;
      doResize(clientX);
      if ((e as TouchEvent).touches) e.preventDefault();
    }

    function onUp() {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, [doResize]);

  function handleDown(e: React.MouseEvent | React.TouchEvent) {
    draggingRef.current = true;
    const clientX = (e as React.TouchEvent).touches && (e as React.TouchEvent).touches[0] 
      ? (e as React.TouchEvent).touches[0].clientX 
      : (e as React.MouseEvent).clientX;
    startXRef.current = clientX;
    startLeftWidthRef.current = leftWidth;
    document.body.style.userSelect = 'none'; // 防止拖拽时选中文本
    document.body.style.cursor = 'col-resize';
  }

  function handleDoubleClick() {
    setLeftWidth(initialLeftWidth);
    onResize?.(initialLeftWidth); // 触发回调
    try {
      if (storageKey) localStorage.setItem(storageKey, String(initialLeftWidth));
    } catch (e) {
      console.log('err', e)
    }
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ 
        display: 'flex', 
        width: '100%', 
        height: '100%', 
        minHeight: 200, 
        alignItems: 'stretch',
        ...style 
      }}
    >
      <div
        style={{
          width: leftWidth,
          flex: '0 0 auto',
          overflow: 'auto',
          borderRight: '1px solid rgba(0,0,0,0.06)',
          background: 'white',
        }}
      >
        {left}
      </div>

      {/* Divider */}
      <div
        role="separator"
        aria-orientation="vertical"
        onMouseDown={handleDown}
        onTouchStart={handleDown}
        onDoubleClick={handleDoubleClick}
        style={{
          width: 8,
          cursor: 'col-resize',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(90deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))',
          userSelect: 'none',
        }}
      >
        <div style={{ width: 2, height: '48%', borderRadius: 2, background: 'rgba(0,0,0,0.18)' }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', background: '#fafafa' }}>{right}</div>
    </div>
  );
}
