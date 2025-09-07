import styles from './index.module.scss';
import {Image, Avatar, Modal, Popover, Button, Breadcrumb} from "antd";
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import reactIcon from '@/assets/react.svg'
import { useEffect, useState} from 'react';
import { getUserInfo } from '@/api/user/user';
import type { UserInfo } from '@/api/user/user.type';
import { useNavigate, useLocation } from 'react-router-dom';
import { getBreadcrumbByPath } from '@/config/breadcrumb';
import { useTabStore } from '@/store/tabs';


interface HeaderProps {
    collapsed: boolean;
    onCollapse: (collapsed: boolean) => void;
}

const Header = ({ collapsed, onCollapse }: HeaderProps) => {
    const [user, setUser] = useState<UserInfo | null>(null); //用户信息
    const [dialog, setDialog] = useState<boolean>(false);
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
                <Breadcrumb 
                    style={{ color: '#fff' }}
                    items={getBreadcrumbByPath(location.pathname).map(item => ({
                        title: item.title,
                        onClick: item.path ? () => navigate(item.path!) : undefined,
                        style: item.path ? { cursor: 'pointer' } : undefined
                    }))}
                />
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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