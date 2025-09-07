import { Tabs } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string>('/index/home');

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    navigate(key);
  };

  const tabItems = [
    {
      key: '/index/home',
      label: 'Home',
    },
    {
      key: '/index/about',
      label: 'About',
    },
    {
      key: '/index/goods',
      label: 'Goods',
    },
    {
      key: '/index/userList',
      label: 'UserList',
    }
  ];

  return (
    <Tabs 
      activeKey={activeKey}
      onChange={handleTabChange}
      items={tabItems}
      size="small"
      style={{ marginBottom: 0 }}
    />
  );
}