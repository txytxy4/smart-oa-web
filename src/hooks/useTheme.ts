import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme';

export const useTheme = () => {
  const { config, updateConfig } = useThemeStore();

  useEffect(() => {
    // 监听主题变化事件
    const handleThemeChange = (event: CustomEvent) => {
      console.log('Theme changed:', event.detail);
      // 可以在这里添加额外的主题变化处理逻辑
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('themeChange', handleThemeChange as EventListener);
    };
  }, []);

  return {
    config,
    updateConfig,
    // 便捷方法
    setPrimaryColor: (color: string) => updateConfig({ primaryColor: color }),
    setTheme: (theme: 'light' | 'dark') => updateConfig({ theme }),
    toggleTheme: () => updateConfig({ theme: config.theme === 'light' ? 'dark' : 'light' }),
    // 获取当前主题色相关信息
    getCurrentColors: () => {
      const root = document.documentElement;
      return {
        primary: getComputedStyle(root).getPropertyValue('--primary-color').trim(),
        hover: getComputedStyle(root).getPropertyValue('--primary-color-hover').trim(),
        active: getComputedStyle(root).getPropertyValue('--primary-color-active').trim(),
        light: getComputedStyle(root).getPropertyValue('--primary-color-light').trim(),
      };
    },
  };
};
