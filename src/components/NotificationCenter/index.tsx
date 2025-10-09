import React, { useState, useEffect } from 'react';
import { notification, Badge, Popover, List, Typography, Button, Space } from 'antd';
import { BellOutlined, ClockCircleOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import wsService, { type WebSocketMessage } from '@/services/websocket';
import styles from './index.module.scss';

const { Text } = Typography;

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  content: string;
  time: string;
  timestamp: Date;
  read: boolean;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [visible, setVisible] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  useEffect(() => {
    // 监听时间推送消息
    const handleTimePush = (data: WebSocketMessage) => {
      const newNotification: NotificationItem = {
        id: Date.now().toString(),
        type: 'time_push',
        title: data.message || '定时推送',
        content: `当前时间: ${data.time} | 在线用户: ${data.clientCount || 0}人`,
        time: data.time || '',
        timestamp: new Date(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev]);
      
      // 触发铃铛摇动效果
      setHasNewNotification(true);
      setTimeout(() => setHasNewNotification(false), 800);

      // 显示系统通知
      notification.info({
        message: data.message || '定时推送',
        description: `当前时间: ${data.time} | 在线用户: ${data.clientCount || 0}人`,
        placement: 'topRight',
        duration: 4,
        icon: <ClockCircleOutlined style={{ color: '#1890ff' }} />,
      });
    };

    // 注册消息处理器
    wsService.on('time_push', handleTimePush);

    // 清理函数
    return () => {
      wsService.off('time_push', handleTimePush);
    };
  }, []);

  // 未读消息数量
  const unreadCount = notifications.filter(item => !item.read).length;

  // 标记消息为已读
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(item => 
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  // 标记所有消息为已读
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(item => ({ ...item, read: true }))
    );
  };

  // 删除消息
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id));
  };

  // 清空所有消息
  const clearAll = () => {
    setNotifications([]);
  };

  // 格式化时间
  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}小时前`;
    
    const days = Math.floor(hours / 24);
    return `${days}天前`;
  };

  const notificationContent = (
    <div className={styles.notificationPanel}>
      <div className={styles.header}>
        <Text strong>通知中心</Text>
        <Space>
          {unreadCount > 0 && (
            <Button 
              type="link" 
              size="small" 
              onClick={markAllAsRead}
              icon={<CheckOutlined />}
            >
              全部已读
            </Button>
          )}
          <Button 
            type="link" 
            size="small" 
            onClick={clearAll}
            icon={<DeleteOutlined />}
            danger
          >
            清空
          </Button>
        </Space>
      </div>
      
      <div className={styles.content}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <Text type="secondary">暂无通知</Text>
          </div>
        ) : (
          <List
            size="small"
            dataSource={notifications}
            renderItem={(item) => (
              <List.Item
                className={`${styles.notificationItem} ${!item.read ? styles.unread : ''}`}
                actions={[
                  <Button
                    type="link"
                    size="small"
                    onClick={() => deleteNotification(item.id)}
                    icon={<DeleteOutlined />}
                  />
                ]}
                onClick={() => markAsRead(item.id)}
              >
                <List.Item.Meta
                  avatar={<ClockCircleOutlined className={styles.icon} />}
                  title={
                    <div className={styles.title}>
                      <Text strong={!item.read}>{item.title}</Text>
                      {!item.read && <div className={styles.dot} />}
                    </div>
                  }
                  description={
                    <div>
                      <div className={styles.description}>{item.content}</div>
                      <Text type="secondary" className={styles.time}>
                        {formatTime(item.timestamp)}
                      </Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </div>
    </div>
  );

  return (
    <Popover
      content={notificationContent}
      title={null}
      trigger="click"
      placement="bottomRight"
      visible={visible}
      onVisibleChange={setVisible}
      overlayClassName={styles.notificationPopover}
    >
      <div className={`${styles.notificationBell} ${hasNewNotification ? styles.hasNew : ''}`}>
        <Badge count={unreadCount} size="small">
          <BellOutlined className={styles.bellIcon} />
        </Badge>
      </div>
    </Popover>
  );
};

export default NotificationCenter;
