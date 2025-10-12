import Menu from "./Menu";
import Content from "./Content";
import Header from "./Header";
import TabNavigation from "@/components/TabNavigation";
import WebSocketProvider from "@/components/WebSocketProvider";
import ThemeSettings from "@/components/ThemeSettings";
import { useThemeStore } from "@/store/theme";
import { Layout as AntdLayout } from "antd";
import { useLocation } from "react-router-dom";
import { useTabStore } from "@/store/tabs";
import { useEffect, useState } from "react";
import { getTitleByPath } from "@/config/breadcrumb";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { addTab } = useTabStore();
  const { config } = useThemeStore(); // 添加主题配置

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
    <WebSocketProvider>
      <AntdLayout style={{ height: "100vh" }}>
        {config.showLogo && (
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
        )}
        <AntdLayout style={{ 
          marginLeft: config.showLogo ? (collapsed ? 80 : 200) : 0, 
          transition: 'margin-left 0.2s' 
        }}>
          {config.showHeader && (
            <AntdLayout.Header style={{ 
              height: 60, 
              lineHeight: '60px', 
              position: 'fixed', 
              width: config.showLogo ? `calc(100% - ${collapsed ? 80 : 200}px)` : '100%', // Header宽度为剩余部分
              right: 0,
              zIndex: 1000, 
              padding: 0,
              transition: 'width 0.2s'
            }}>
              <Header collapsed={collapsed} onCollapse={setCollapsed} />
            </AntdLayout.Header>
          )}
          <AntdLayout style={{ 
            marginTop: config.showHeader ? 60 : 0, 
            height: config.showHeader ? 'calc(100vh - 60px)' : '100vh' 
          }}>
            {/* 标签导航区域 */}
            {config.showTagsView && (
              <div style={{ 
                background: '#fff', 
                borderBottom: '1px solid #f0f0f0',
                padding: 0
              }}>
                <TabNavigation />
              </div>
            )}
            
            <AntdLayout.Content style={{ 
              padding: "24px", 
              boxSizing: 'border-box',
              height: `calc(100vh - ${config.showHeader ? 60 : 0}px - ${config.showTagsView ? 48 : 0}px)`, // 减去标签导航高度
              overflowY: 'auto',
              background: '#fff',
              margin: '16px 24px'
            }}>
              <Content />
            </AntdLayout.Content>
          </AntdLayout>
        </AntdLayout>
      </AntdLayout>
      
      {/* 添加主题设置组件 */}
      <ThemeSettings />
    </WebSocketProvider>
  );
}
