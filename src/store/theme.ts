import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeConfig {
  primaryColor: string;
  theme: 'light' | 'dark';
  showLogo: boolean;
  dynamicTitle: boolean;
  showTagsView: boolean;
  showHeader: boolean;
  showFooter: boolean;
}

interface ThemeState {
  config: ThemeConfig;
  updateConfig: (updates: Partial<ThemeConfig>) => void;
  resetConfig: () => void;
}

const defaultConfig: ThemeConfig = {
  primaryColor: '#1890ff',
  theme: 'light',
  showLogo: true,
  dynamicTitle: true,
  showTagsView: true,
  showHeader: true,
  showFooter: true,
};

// 颜色处理工具函数
function hexToHsl(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 1/3) {
    r = x; g = c; b = 0;
  } else if (1/3 <= h && h < 1/2) {
    r = 0; g = c; b = x;
  } else if (1/2 <= h && h < 2/3) {
    r = 0; g = x; b = c;
  } else if (2/3 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h < 1) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 生成衍生颜色
function generateDerivedColors(primaryColor: string) {
  const [h, s, l] = hexToHsl(primaryColor);
  
  return {
    primary: primaryColor,
    hover: hslToHex(h, s, Math.min(l + 10, 90)), // 更亮
    active: hslToHex(h, s, Math.max(l - 10, 10)), // 更暗
    disabled: '#d9d9d9',
    light: hslToHex(h, Math.max(s - 20, 20), Math.min(l + 30, 95)), // 浅色版本
    border: hslToHex(h, Math.max(s - 10, 30), Math.min(l + 20, 85)), // 边框色
  };
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      config: defaultConfig,
      updateConfig: (updates) => {
        const newConfig = { ...get().config, ...updates };
        set({ config: newConfig });
        applyThemeChanges(newConfig);
      },
      resetConfig: () => {
        set({ config: defaultConfig });
        applyThemeChanges(defaultConfig);
      },
    }),
    {
      name: 'theme-config',
    }
  )
);

// 应用主题变化到DOM
function applyThemeChanges(config: ThemeConfig) {
  const root = document.documentElement;
  const colors = generateDerivedColors(config.primaryColor);
  
  // 设置所有相关的CSS变量
  root.style.setProperty('--primary-color', colors.primary);
  root.style.setProperty('--primary-color-hover', colors.hover);
  root.style.setProperty('--primary-color-active', colors.active);
  root.style.setProperty('--primary-color-disabled', colors.disabled);
  root.style.setProperty('--primary-color-light', colors.light);
  root.style.setProperty('--primary-color-border', colors.border);
  root.style.setProperty('--theme-mode', config.theme);
  
  // 设置主题类
  if (config.theme === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }

  // 强制重新渲染Antd组件（如果需要）
  const event = new CustomEvent('themeChange', { 
    detail: { config, colors } 
  });
  window.dispatchEvent(event);
}

// 初始化主题
export const initTheme = () => {
  const store = useThemeStore.getState();
  applyThemeChanges(store.config);
};
