import styles from './index.module.scss';
import {Image, Avatar, Modal, Popover, Button} from "antd";
import { UserOutlined } from '@ant-design/icons';
import reactIcon from '@/assets/react.svg'
import { useEffect, useState} from 'react';
import { getUserInfo } from '@/api/user/user';
import type { UserInfo } from '@/api/user/user.type';
import { useNavigate } from 'react-router-dom';


const Header = () => {
    const [user, setUser] = useState<UserInfo | null>(null); //用户信息
    const [dialog, setDialog] = useState<boolean>(false);
    const navigate = useNavigate();
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


    // 旗袍内容
    const content = (
      <div>
        <Button onClick={() => setDialog(true)}>个人信息</Button>
        <Button onClick={() => toUser()}>个人主页</Button>
      </div>
    )

    return (<div className={styles.container}>
        <div className={styles.icon}>
            <Image src={reactIcon} width={30} height={30}></Image>
        </div>
        <div className={styles.userWrap} >
             <p className={styles.nickname}>{user?.nickname}</p>
             <Popover content={content} title="个人主页">
              <Avatar icon={<UserOutlined />} src={`http://${user?.avatarUrl}`} size={30} />  
             </Popover>
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