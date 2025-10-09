import styles from './index.module.scss';
import {Image, Avatar, Modal, Popover, Button, Breadcrumb, Input, List} from "antd";
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined, SearchOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import reactIcon from '@/assets/react.svg'
import { useEffect, useState} from 'react';
import { getUserInfo } from '@/api/user/user';
import type { UserInfo } from '@/api/user/user.type';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBreadcrumbByPath, routeConfig } from '@/config/breadcrumb';
import { useTabStore } from '@/store/tabs';
import NotificationCenter from '@/components/NotificationCenter';


interface HeaderProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Header = ({ collapsed, onCollapse }: HeaderProps) => {
    const [user, setUser] = useState<UserInfo | null>(null); //用户信息
    const [dialog, setDialog] = useState<boolean>(false);
    const [searchVisible, setSearchVisible] = useState<boolean>(false); // 搜索弹窗状态
    const [searchValue, setSearchValue] = useState<string>(''); // 搜索值
    const [isFullscreen, setIsFullscreen] = useState<boolean>(false); // 全屏状态
    const navigate = useNavigate();
    const location = useLocation();
    const { clearTabs } = useTabStore();
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const userId = localStorage.getItem('userId');
          const res = await getUserInfo(userId as number | string);
          console.log('res', res);
          
          if (res.code === 200) {
            const data = {...res.data.profile, ...res.data};
            setUser(data);
            console.log('user', data);
          }
        } catch (error) {
          console.error('获取用户信息失败', error);
        }
      };
      
      fetchUserInfo();
    }, []); // 空依赖数组

    // 监听全屏状态变化
    useEffect(() => {
      const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
      };

      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => {
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      };
    }, []);

    const toUser = () => {
      navigate("/index/user");
    }

    // 退出登录
    const handleLogout = () => {
      // 清除登录信息
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      // 清除标签
      clearTabs();
      // 跳转到登录页
      navigate('/login');
    }

    // 全屏切换
    const toggleFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      } catch (error) {
        console.error('全屏切换失败:', error);
      }
    };

    // 打开搜索弹窗
    const openSearch = () => {
      setSearchVisible(true);
      setSearchValue('');
    };

    // 关闭搜索弹窗
    const closeSearch = () => {
      setSearchVisible(false);
      setSearchValue('');
    };

    // 获取所有可搜索的页面
    const getAllPages = () => {
      return Object.values(routeConfig).filter(route => 
        route.path !== '/index/home' && // 排除首页
        !route.path.includes('404') // 排除404页面
      );
    };

    // 过滤搜索结果
    const getFilteredPages = () => {
      const allPages = getAllPages();
      if (!searchValue.trim()) {
        return allPages;
      }
      return allPages.filter(page => 
        page.title.toLowerCase().includes(searchValue.toLowerCase()) ||
        page.path.toLowerCase().includes(searchValue.toLowerCase())
      );
    };

    // 处理页面跳转
    const handlePageSelect = (path: string) => {
      navigate(path);
      closeSearch();
    };


    // 弹出菜单内容
    const content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
        <Button type="text" onClick={() => setDialog(true)} style={{ textAlign: 'left' }}>
          个人信息
        </Button>
        <Button type="text" onClick={() => toUser()} style={{ textAlign: 'left' }}>
          个人主页
        </Button>
        <Button type="text" onClick={handleLogout} style={{ textAlign: 'left', color: '#ff4d4f' }}>
          退出登录
        </Button>
      </div>
    )

    return (<div className={styles.container}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button 
                type="text" 
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => onCollapse(!collapsed)}
                style={{ fontSize: '16px', width: 40, height: 40 }}
            />
            <div style={{ flex: 1 }}>
                <Breadcrumb style={{ color: '#fff' }}>
                    {getBreadcrumbByPath(location.pathname).map((item, index) => (
                        <Breadcrumb.Item 
                            key={index}
                            onClick={item.path ? () => navigate(item.path!) : undefined}
                        >
                            <span style={item.path ? { cursor: 'pointer' } : undefined}>
                                {item.title}
                            </span>
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 搜索按钮 */}
            <Button 
                type="text" 
                icon={<SearchOutlined />}
                onClick={openSearch}
                style={{ 
                    fontSize: '16px', 
                    width: 40, 
                    height: 40,
                    color: '#fff'
                }}
                title="页面搜索"
            />
            
            {/* 全屏按钮 */}
            <Button 
                type="text" 
                icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                onClick={toggleFullscreen}
                style={{ 
                    fontSize: '16px', 
                    width: 40, 
                    height: 40,
                    color: '#fff'
                }}
                title={isFullscreen ? "退出全屏" : "进入全屏"}
            />
            
            {/* 通知中心 */}
            <div style={{ color: '#fff' }}>
                <NotificationCenter />
            </div>
            
            <div className={styles.icon}>
                <Image src={reactIcon} width={30} height={30} preview={false}></Image>
            </div>
            <div className={styles.userWrap}>
                 <p className={styles.nickname}>{user?.nickname || '用户'}</p>
                 <Popover content={content} title="个人主页" placement="bottomRight">
                  <Avatar 
                    icon={<UserOutlined />} 
                    src={user?.avatarUrl ? `http://${user.avatarUrl}` : undefined} 
                    size={30} 
                    style={{ cursor: 'pointer' }}
                  />  
                 </Popover>
            </div>
        </div>
        {/* 页面搜索弹窗 */}
        <Modal 
            title="页面搜索" 
            open={searchVisible} 
            onCancel={closeSearch}
            footer={null}
            width={600}
            style={{ top: 100 }}
        >
            <div style={{ marginBottom: 16 }}>
                <Input
                    placeholder="搜索页面名称或路径..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    prefix={<SearchOutlined />}
                    size="large"
                    autoFocus
                />
            </div>
            <div style={{ maxHeight: 400, overflow: 'auto' }}>
                <List
                    dataSource={getFilteredPages()}
                    renderItem={(item) => (
                        <List.Item
                            onClick={() => handlePageSelect(item.path)}
                            style={{ 
                                cursor: 'pointer',
                                padding: '12px 16px',
                                borderRadius: '6px',
                                margin: '4px 0'
                            }}
                            className="search-list-item"
                        >
                            <List.Item.Meta
                                title={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '16px' }}>📄</span>
                                        <span>{item.title}</span>
                                    </div>
                                }
                                description={
                                    <div style={{ color: '#666', fontSize: '12px' }}>
                                        {item.breadcrumbs.map(breadcrumb => breadcrumb.title).join(' / ')}
                                        <br />
                                        <span style={{ fontFamily: 'monospace', color: '#999' }}>
                                            {item.path}
                                        </span>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                    locale={{ emptyText: '没有找到匹配的页面' }}
                />
            </div>
        </Modal>

        {/* 用户信息弹窗 */}
        <Modal title="用户信息" open={dialog} onCancel={() => setDialog(false)} onOk={() => setDialog(false)} okText="确认" cancelText="取消">
            <div className={styles.modalWrap}>
              <p className={styles.userInfo}><span className={styles.userInfoTitle}>昵称</span>{user?.nickname}</p>
              <p className={styles.userInfo}><span className={styles.userInfoTitle}>邮箱</span>{user?.email}</p>
              <p className={styles.userInfo}><span className={styles.userInfoTitle}>地址</span>{user?.address}</p>
              <p className={styles.userInfo}><span className={styles.userInfoTitle}>手机号</span>{user?.phone}</p>
              <p className={styles.userInfo}><span className={styles.userInfoTitle}>积分</span>{user?.points}</p>
            </div>
        </Modal>
    </div>)
}

export default Header