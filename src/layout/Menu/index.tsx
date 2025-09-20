import { useState } from 'react';
import { Menu as AntdMenu } from 'antd';
import { DesktopOutlined, UsergroupDeleteOutlined, SettingOutlined, BankOutlined, InsertRowAboveOutlined, ApartmentOutlined, IdcardOutlined, ToolOutlined, SoundOutlined, BuildOutlined, UserOutlined, ClockCircleOutlined, DatabaseOutlined, MenuOutlined, BookOutlined, FileTextOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router';
import logo from '@/assets/logo.png';

export default function Menu() {
    const navigate = useNavigate();//编程式导航
    const [openKeys, setOpenKeys] = useState<string[]>(['system-management']); // 默认展开系统管理
    
    const handleClick: MenuProps['onClick'] = (info) => {
         navigate(info.key) // 点击菜单项时，导航到对应的页面
    };

    // 处理子菜单展开/收起，实现手风琴模式
    const handleOpenChange = (keys: string[]) => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        const rootSubmenuKeys = ['system-management', 'system-monitor', 'system-tools'];
        
        if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
            setOpenKeys(keys);
        } else {
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
        }
    };
    const menuItems = [
        {
            key: '/index/home',
            label: '首页',
            icon: <BankOutlined />,
        },
        {
            key: 'system-management',
            label: '系统管理',
            icon: <SettingOutlined />,
            children: [
                {
                    key: '/index/userList',
                    label: '用户管理',
                    icon: <UsergroupDeleteOutlined />,
                },
                {
                    key: '/index/role',
                    label: '角色管理',
                    icon: <UsergroupDeleteOutlined />,
                },
                {
                    key: '/index/department',
                    label: '部门管理',
                    icon: <ApartmentOutlined />,
                },
                {
                    key: '/index/position',
                    label: '岗位管理',
                    icon: <IdcardOutlined />,
                },
                {
                    key: '/index/parameter',
                    label: '参数设置',
                    icon: <ToolOutlined />,
                },
                    {
                        key: '/index/announcement',
                        label: '公告管理',
                        icon: <SoundOutlined />,
                    },
                    {
                        key: '/index/menu',
                        label: '菜单管理',
                        icon: <MenuOutlined />,
                    },
                    {
                        key: '/index/dict',
                        label: '字典管理',
                        icon: <BookOutlined />,
                    },
                    {
                        key: 'log-management',
                        label: '日志管理',
                        icon: <FileTextOutlined />,
                        children: [
                            {
                                key: '/index/log/operlog',
                                label: '操作日志',
                                icon: <FileTextOutlined />,
                            },
                            {
                                key: '/index/log/logininfor',
                                label: '登录日志',
                                icon: <FileTextOutlined />,
                            }
                        ]
                    }
            ]
        },
        {
            key: 'system-monitor',
            label: '系统监控',
            icon: <DesktopOutlined />,
            children: [
                {
                    key: '/index/monitor/online',
                    label: '在线用户',
                    icon: <UserOutlined />,
                },
                {
                    key: '/index/monitor/job',
                    label: '定时任务',
                    icon: <ClockCircleOutlined />,
                },
                    {
                        key: '/index/monitor/cache',
                        label: '缓存监控',
                        icon: <DatabaseOutlined />,
                    }
            ]
        },
        {
            key: 'system-tools',
            label: '系统工具',
            icon: <InsertRowAboveOutlined />,
            children: [
                {
                    key: '/index/tool/build',
                    label: '表单构建',
                    icon: <BuildOutlined />,
                }
            ]
        }
    ];
    
    return (
        <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            background: '#001529'
        }}>
            {/* Logo 区域 - 固定在顶部 */}
            <div style={{
                height: '64px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                background: '#001529',
                borderBottom: '1px solid #1f1f1f',
                flexShrink: 0, // 防止收缩
                zIndex: 10 // 确保在最上层
            }}>
                <img 
                    src={logo} 
                    alt="Logo" 
                    style={{
                        maxHeight: '40px',
                        maxWidth: '100%',
                        objectFit: 'contain'
                    }}
                />
            </div>
            
            {/* 菜单区域 - 可滚动 */}
            <div style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <AntdMenu 
                    onClick={handleClick}
                    openKeys={openKeys}
                    onOpenChange={handleOpenChange}
                    style={{
                        flex: 1,
                        borderRight: 0,
                        background: '#001529',
                        overflow: 'auto' // 允许菜单区域滚动
                    }} 
                    items={menuItems} 
                    mode="inline"
                    theme="dark"
                />
            </div>
        </div>
    );
}