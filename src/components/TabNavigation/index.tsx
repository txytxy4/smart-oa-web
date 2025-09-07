import React from 'react';
import { Tabs, Button } from 'antd';
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTabStore } from '@/store/tabs';
import styles from './index.module.scss';

const TabNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, activeTab, removeTab, setActiveTab } = useTabStore();

  // 处理标签切换
  const handleTabChange = (key: string) => {
    setActiveTab(key);
    navigate(key);
  };

  // 处理标签关闭
  const handleTabClose = (targetKey: string) => {
    const newActiveTab = removeTab(targetKey);
    
    // 如果删除的是当前标签，需要导航到新的激活标签
    if (targetKey === activeTab && newActiveTab) {
      navigate(newActiveTab);
    }
  };

  // 处理Antd Tabs的编辑操作
  const handleEdit = (targetKey: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
    if (action === 'remove') {
      handleTabClose(targetKey as string);
    }
  };

  // 关闭所有标签
  const handleCloseAll = () => {
    useTabStore.getState().clearTabs();
    navigate('/index/home'); // 导航到默认页面
  };

  // 刷新当前标签
  const handleRefresh = () => {
    window.location.reload();
  };

  if (tabs.length === 0) {
    return null;
  }

  const tabItems = tabs.map(tab => ({
    key: tab.key,
    label: tab.label,
    closable: tabs.length > 1, // 只有当标签数量大于1时才显示关闭按钮
  }));

  return (
    <div className={styles.tabNavigation}>
      <Tabs
        type="editable-card"
        activeKey={activeTab}
        onChange={handleTabChange}
        onEdit={handleEdit}
        hideAdd
        items={tabItems}
        className={styles.tabs}
      />
      <div className={styles.tabActions}>
        <Button
          type="text"
          size="small"
          icon={<ReloadOutlined />}
          onClick={handleRefresh}
          title="刷新"
        />
        <Button
          type="text"
          size="small"
          icon={<CloseOutlined />}
          onClick={handleCloseAll}
          title="关闭所有"
        />
      </div>
    </div>
  );
};

export default TabNavigation;
