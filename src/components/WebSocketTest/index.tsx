import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Tag, Divider, Alert } from 'antd';
import { ConnectOutlined, DisconnectOutlined, SendOutlined } from '@ant-design/icons';
import { useWebSocket } from '@/components/WebSocketProvider';
import wsService from '@/services/websocket';

const { Title, Text, Paragraph } = Typography;

const WebSocketTest: React.FC = () => {
  const { isConnected, connect, disconnect } = useWebSocket();
  const [lastMessage, setLastMessage] = useState<string>('');

  useEffect(() => {
    // 监听所有消息类型
    const handleMessage = (data: any) => {
      setLastMessage(JSON.stringify(data, null, 2));
    };

    wsService.on('time_push', handleMessage);

    return () => {
      wsService.off('time_push', handleMessage);
    };
  }, []);

  const sendPing = () => {
    wsService.send({ type: 'ping' });
  };

  return (
    <Card title="WebSocket 连接测试" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={4}>连接状态</Title>
          <Space>
            <Tag color={isConnected ? 'success' : 'error'}>
              {isConnected ? '已连接' : '未连接'}
            </Tag>
            <Button
              type={isConnected ? 'default' : 'primary'}
              icon={isConnected ? <DisconnectOutlined /> : <ConnectOutlined />}
              onClick={isConnected ? disconnect : connect}
            >
              {isConnected ? '断开连接' : '连接WebSocket'}
            </Button>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={4}>操作</Title>
          <Space>
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={sendPing}
              disabled={!isConnected}
            >
              发送心跳
            </Button>
          </Space>
        </div>

        <Divider />

        <div>
          <Title level={4}>使用说明</Title>
          <Alert
            message="WebSocket 定时推送功能"
            description={
              <div>
                <Paragraph>
                  后端WebSocket服务会每30分钟推送一次时间信息，推送的消息会：
                </Paragraph>
                <ul>
                  <li>在页面右上角的通知中心显示</li>
                  <li>弹出系统通知提示</li>
                  <li>铃铛图标会摇动提醒</li>
                  <li>显示未读消息数量</li>
                </ul>
                <Paragraph>
                  <Text strong>WebSocket地址：</Text>
                  <Text code>ws://localhost:3001/ws</Text>
                </Paragraph>
              </div>
            }
            type="info"
            showIcon
          />
        </div>

        {lastMessage && (
          <>
            <Divider />
            <div>
              <Title level={4}>最新消息</Title>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '12px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto'
              }}>
                {lastMessage}
              </pre>
            </div>
          </>
        )}
      </Space>
    </Card>
  );
};

export default WebSocketTest;
