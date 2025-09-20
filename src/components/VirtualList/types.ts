import { ReactNode, CSSProperties } from 'react';

export interface VirtualListItem {
  [key: string]: any;
}

export interface VirtualListProps<T extends VirtualListItem> {
  /** 数据源 */
  items: T[];
  /** 单项高度（px），固定高度虚拟化的前提 */
  itemHeight: number;
  /** 容器高度（px），如果不传会尝试测量 */
  containerHeight?: number;
  /** 前后缓冲项数（缓冲区），默认为5 */
  buffer?: number;
  /** 渲染每一项的函数 */
  renderItem: (item: T, index: number) => ReactNode;
  /** 容器样式 */
  style?: CSSProperties;
  /** 容器类名 */
  className?: string;
}

export interface VirtualListState {
  /** 当前滚动位置 */
  scrollTop: number;
  /** 实际容器高度 */
  actualContainerHeight: number;
}

export interface VirtualListComputedValues {
  /** 总高度 */
  totalHeight: number;
  /** 可见项数量 */
  visibleCount: number;
  /** 开始索引 */
  startIndex: number;
  /** 结束索引 */
  endIndex: number;
  /** 可见项列表 */
  visibleItems: VirtualListItem[];
  /** Y轴偏移量 */
  offset: number;
}
