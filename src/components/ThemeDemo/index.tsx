import React from 'react';
import { Card, Button, Space, Typography, Divider, Form, Input, Select, Switch, Slider } from 'antd';
import { 
  BgColorsOutlined, 
  SettingOutlined, 
  EyeOutlined,
  BulbOutlined 
} from '@ant-design/icons';
import { useTheme } from '@/hooks/useTheme';
import ThemeButton from '@/components/ThemeButton';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const ThemeDemo: React.FC = () => {
  const { config, setPrimaryColor, toggleTheme, getCurrentColors } = useTheme();
  const [form] = Form.useForm();

  const demoColors = [
    '#1890ff', '#722ed1', '#13c2c2', '#52c41a', 
    '#eb2f96', '#f5222d', '#fa8c16', '#fadb14'
  ];

  const handleQuickColorChange = (color: string) => {
    setPrimaryColor(color);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card title="🎨 主题系统演示" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={4}>
              <BgColorsOutlined /> 当前主题配置
            </Title>
            <Space wrap>
              <Text>主题色: <span style={{ color: config.primaryColor, fontWeight: 'bold' }}>{config.primaryColor}</span></Text>
              <Text>主题模式: {config.theme === 'light' ? '🌞 亮色' : '🌙 暗色'}</Text>
              <Button 
                type="link" 
                icon={<BulbOutlined />}
                onClick={toggleTheme}
              >
                切换{config.theme === 'light' ? '暗色' : '亮色'}主题
              </Button>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>快速切换主题色</Title>
            <Space wrap>
              {demoColors.map((color) => (
                <div
                  key={color}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: color,
                    borderRadius: '6px',
                    cursor: 'pointer',
                    border: config.primaryColor === color ? '3px solid #333' : '2px solid #ddd',
                    transition: 'all 0.2s ease',
                  }}
                  onClick={() => handleQuickColorChange(color)}
                  title={color}
                />
              ))}
            </Space>
          </div>
        </Space>
      </Card>

      <Card title="🎛️ 组件主题色演示" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <Title level={4}>按钮组件</Title>
            <Space wrap>
              <Button type="primary">主要按钮</Button>
              <Button type="default">默认按钮</Button>
              <Button type="dashed">虚线按钮</Button>
              <Button type="text">文本按钮</Button>
              <Button type="link">链接按钮</Button>
              <Button type="primary" danger>危险按钮</Button>
            </Space>
          </div>

          <div>
            <Title level={4}>自定义主题按钮</Title>
            <Space wrap>
              <ThemeButton variant="primary">主题按钮</ThemeButton>
              <ThemeButton variant="outline">轮廓按钮</ThemeButton>
              <ThemeButton variant="ghost">幽灵按钮</ThemeButton>
              <ThemeButton variant="text">文本按钮</ThemeButton>
            </Space>
          </div>

          <Divider />

          <div>
            <Title level={4}>表单组件</Title>
            <Form form={form} layout="inline" style={{ width: '100%' }}>
              <Form.Item label="输入框" name="input">
                <Input placeholder="请输入内容" style={{ width: 200 }} />
              </Form.Item>
              <Form.Item label="选择器" name="select">
                <Select placeholder="请选择" style={{ width: 150 }}>
                  <Option value="option1">选项1</Option>
                  <Option value="option2">选项2</Option>
                  <Option value="option3">选项3</Option>
                </Select>
              </Form.Item>
              <Form.Item label="开关" name="switch" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Form>
          </div>

          <div>
            <Title level={4}>滑块和其他组件</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ width: 300 }}>
                <Text>滑块组件：</Text>
                <Slider defaultValue={30} />
              </div>
            </Space>
          </div>
        </Space>
      </Card>

      <Card title="📋 使用说明">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Paragraph>
            <Title level={5}>🎯 功能特点</Title>
            <ul>
              <li><strong>全局主题色同步</strong>：所有Antd组件自动跟随主题色变化</li>
              <li><strong>界面元素控制</strong>：可以显示/隐藏Logo、Header、Tags等界面元素</li>
              <li><strong>配置持久化</strong>：主题设置会保存到localStorage，刷新页面不丢失</li>
              <li><strong>实时预览</strong>：修改配置立即生效，无需刷新页面</li>
              <li><strong>零侵入式</strong>：现有代码无需修改，自动应用主题</li>
            </ul>
          </Paragraph>

          <Paragraph>
            <Title level={5}>🛠️ 如何使用</Title>
            <ol>
              <li>点击页面右侧的 <SettingOutlined /> 设置按钮打开主题配置面板</li>
              <li>选择你喜欢的主题颜色，支持预设颜色和自定义颜色</li>
              <li>调整界面显示选项，如显示/隐藏Logo、Header等</li>
              <li>所有设置会自动保存，下次访问时保持你的配置</li>
            </ol>
          </Paragraph>

          <Paragraph>
            <Title level={5}>💡 开发提示</Title>
            <ul>
              <li>在组件中使用 <code>useTheme()</code> Hook 获取当前主题配置</li>
              <li>使用 <code>ThemeButton</code> 组件创建自定义样式按钮</li>
              <li>所有表单组件会自动应用主题色，无需额外配置</li>
              <li>可以通过CSS变量 <code>var(--primary-color)</code> 在自定义样式中使用主题色</li>
            </ul>
          </Paragraph>
        </Space>
      </Card>
    </div>
  );
};

export default ThemeDemo;
