import Menu from "./Menu";
import Content from "./Content";
import Header from "./Header";
import TabNavigation from "@/components/TabNavigation";
import { Layout as AntdLayout } from "antd";
import { useLocation } from "react-router-dom";
import { useTabStore } from "@/store/tabs";
import { useEffect, useState } from "react";
import { getTitleByPath } from "@/config/breadcrumb";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { addTab } = useTabStore();

  // 监听路由变化，添加新标签
  useEffect(() => {
    const title = getTitleByPath(location.pathname);
    addTab({
      key: location.pathname,
      label: title,
      path: location.pathname,
    });
  }, [location.pathname, addTab]);

  return (
    <AntdLayout style={{ height: "100vh" }}>
      <AntdLayout.Sider 
        collapsed={collapsed}
        style={{ 
          position: 'fixed', 
          height: '100vh', // 菜单占据整个页面高度
          left: 0, 
          top: 0, 
          overflowY: 'auto',
          zIndex: 999
        }}
      >
        <Menu />
      </AntdLayout.Sider>
      <AntdLayout style={{ marginLeft: collapsed ? 80 : 200, transition: 'margin-left 0.2s' }}>
        <AntdLayout.Header style={{ 
          height: 60, 
          lineHeight: '60px', 
          position: 'fixed', 
          width: `calc(100% - ${collapsed ? 80 : 200}px)`, // Header宽度为剩余部分
          right: 0,
          zIndex: 1000, 
          padding: 0,
          transition: 'width 0.2s'
        }}>
          <Header collapsed={collapsed} onCollapse={setCollapsed} />
        </AntdLayout.Header>
        <AntdLayout style={{ marginTop: 60, height: 'calc(100vh - 60px)' }}>
          {/* 标签导航区域 */}
          <div style={{ 
            background: '#fff', 
            borderBottom: '1px solid #f0f0f0',
            padding: 0
          }}>
            <TabNavigation />
          </div>
          
          <AntdLayout.Content style={{ 
            padding: "24px", 
            boxSizing: 'border-box',
            height: 'calc(100vh - 60px - 48px)', // 减去标签导航高度
            overflowY: 'auto',
            background: '#fff',
            margin: '16px 24px'
          }}>
            <Content />
          </AntdLayout.Content>
        </AntdLayout>
      </AntdLayout>
    </AntdLayout>
  );
}
