import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TabItem {
  key: string;
  label: string;
  path: string;
}

interface TabState {
  tabs: TabItem[];
  activeTab: string;
  addTab: (tab: TabItem) => void;
  removeTab: (key: string) => void;
  setActiveTab: (key: string) => void;
  clearTabs: () => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => {
      // tabs: [],
      // activeTab: '',
      
      const addTab = (tab: TabItem) => {
        const { tabs } = get();
        const existingTab = tabs.find(t => t.key === tab.key);
        
        if (!existingTab) {
          set({ 
            tabs: [...tabs, tab],
            activeTab: tab.key 
          });
        } else {
          set({ activeTab: tab.key });
        }
      };
      
      const removeTab = (key: string) => {
        const { tabs, activeTab } = get();
        const newTabs = tabs.filter(tab => tab.key !== key);
        
        let newActiveTab = activeTab;
        if (activeTab === key && newTabs.length > 0) {
          // 如果删除的是当前激活的标签，则激活前一个或后一个标签
          const currentIndex = tabs.findIndex(tab => tab.key === key);
          const nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          newActiveTab = newTabs[nextIndex]?.key || '';
        }
        
        set({ 
          tabs: newTabs,
          activeTab: newActiveTab 
        });
        
        return newActiveTab;
      };
      
      const setActiveTab = (key: string) => {
        set({ activeTab: key });
      };
      
      const clearTabs = () => {
        set({ tabs: [], activeTab: '' });
      };

      return {
        tabs: [],
        activeTab: '',
        addTab,
        removeTab,
        setActiveTab,
        clearTabs,
      }
    },
    {
      name: 'tab-store', // 存储到localStorage的key
      partialize: (state) => ({ tabs: state.tabs, activeTab: state.activeTab }), // 只持久化tabs和activeTab
    }
  )
);
