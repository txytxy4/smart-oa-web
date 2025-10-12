import React, { useState } from 'react';
import { 
  Drawer, 
  Switch, 
  Divider, 
  Typography, 
  Space, 
  Button,
  Input,
  Row,
  Col
} from 'antd';
import { SettingOutlined, RedoOutlined } from '@ant-design/icons';
import { useThemeStore } from '@/store/theme';
import styles from './index.module.scss';

const { Title, Text } = Typography;

const ThemeSettings: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [customColor, setCustomColor] = useState('');
  const { config, updateConfig, resetConfig } = useThemeStore();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setCustomColor(color);
    updateConfig({ primaryColor: color });
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
      updateConfig({ primaryColor: color });
    }
    setCustomColor(color);
  };

  const presetColors = [
    '#1890ff', '#722ed1', '#13c2c2', '#52c41a', 
    '#eb2f96', '#f5222d', '#fa8c16', '#fadb14'
  ];

  return (
    <>
      {/* 设置按钮 */}
      <div className={styles.settingButton} onClick={() => setVisible(true)}>
        <SettingOutlined />
      </div>

      {/* 设置抽屉 */}
      <Drawer
        title="主题配置"
        placement="right"
        onClose={() => setVisible(false)}
        open={visible}
        width={300}
        className={styles.themeDrawer}
      >
        <div className={styles.settingContent}>
          {/* 主题颜色配置 */}
          <div className={styles.settingSection}>
            <Title level={5}>主题颜色</Title>
            
            {/* 颜色输入框 */}
            <div className={styles.colorInputGroup}>
              <Input
                value={customColor || config.primaryColor}
                onChange={handleColorInputChange}
                placeholder="输入颜色值 (如: #1890ff)"
                addonBefore="颜色"
                style={{ marginBottom: 16 }}
              />
              <input
                type="color"
                value={config.primaryColor}
                onChange={handleColorChange}
                className={styles.colorInput}
                title="选择颜色"
              />
            </div>
            
            {/* 预设颜色快速选择 */}
            <div className={styles.presetColors}>
              <Text style={{ marginBottom: 8, display: 'block' }}>预设颜色：</Text>
              {presetColors.map((color) => (
                <div
                  key={color}
                  className={`${styles.colorItem} ${config.primaryColor === color ? styles.active : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateConfig({ primaryColor: color })}
                  title={color}
                />
              ))}
            </div>
          </div>

          <Divider />

          {/* 界面显示配置 */}
          <div className={styles.settingSection}>
            <Title level={5}>界面显示</Title>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Text>显示 Logo</Text>
                </Col>
                <Col>
                  <Switch
                    checked={config.showLogo}
                    onChange={(checked) => updateConfig({ showLogo: checked })}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Text>动态标题</Text>
                </Col>
                <Col>
                  <Switch
                    checked={config.dynamicTitle}
                    onChange={(checked) => updateConfig({ dynamicTitle: checked })}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Text>显示 Tags-Views</Text>
                </Col>
                <Col>
                  <Switch
                    checked={config.showTagsView}
                    onChange={(checked) => updateConfig({ showTagsView: checked })}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Text>显示 Header</Text>
                </Col>
                <Col>
                  <Switch
                    checked={config.showHeader}
                    onChange={(checked) => updateConfig({ showHeader: checked })}
                  />
                </Col>
              </Row>

              <Row justify="space-between" align="middle">
                <Col>
                  <Text>底部版权</Text>
                </Col>
                <Col>
                  <Switch
                    checked={config.showFooter}
                    onChange={(checked) => updateConfig({ showFooter: checked })}
                  />
                </Col>
              </Row>
            </Space>
          </div>

          <Divider />

          {/* 操作按钮 */}
          <div className={styles.settingActions}>
            <Space style={{ width: '100%' }}>
              <Button 
                icon={<RedoOutlined />} 
                onClick={resetConfig}
                block
              >
                恢复默认
              </Button>
            </Space>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ThemeSettings;
