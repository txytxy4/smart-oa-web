import { Menu as AntdMenu } from 'antd';
import { DesktopOutlined, UsergroupDeleteOutlined, SettingOutlined, BankOutlined, InsertRowAboveOutlined, ApartmentOutlined, IdcardOutlined, ToolOutlined, SoundOutlined, BuildOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router';
import logo from '@/assets/logo.png';

export default function Menu() {
    const navigate = useNavigate();//编程式导航
    const handleClick: MenuProps['onClick'] = (info) => {
         navigate(info.key) // 点击菜单项时，导航到对应的页面
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
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo 区域 */}
            <div style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                background: '#001529'
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
            
            {/* 菜单区域 */}
            <AntdMenu 
                onClick={handleClick} 
                style={{
                    flex: 1,
                    borderRight: 0
                }} 
                items={menuItems} 
                mode="inline"
                theme="dark"
            />
        </div>
    );
}