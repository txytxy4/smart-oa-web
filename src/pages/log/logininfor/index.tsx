import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Form,
  Button,
  Input,
  Select,
  message,
  Space,
  Modal,
  DatePicker,
  Tag,
  Card,
  Typography,
  Divider,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  ExportOutlined,
  EyeOutlined,
  ReloadOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import VirtualList from "@/components/VirtualList";
import styles from "./index.module.scss";

// 登录日志数据接口
interface LoginInforData {
  id: number;
  userName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: boolean;
  msg: string;
  loginTime: string;
}

// 搜索参数接口
interface SearchParams {
  ipaddr?: string;
  userName?: string;
  status?: string;
  loginTime?: [string, string] | null;
}

const { RangePicker } = DatePicker;
const { Text } = Typography;

// 登录状态映射
const statusMap: Record<string, { label: string; color: string }> = {
  'true': { label: '成功', color: 'success' },
  'false': { label: '失败', color: 'error' },
};

// 浏览器图标映射
const browserIconMap: Record<string, string> = {
  'Chrome': '🌐',
  'Firefox': '🦊',
  'Safari': '🧭',
  'Edge': '🔷',
  'IE': '🔵',
  'Opera': '🎭',
};

// 操作系统图标映射
const osIconMap: Record<string, string> = {
  'Windows 10': '🪟',
  'Windows 11': '🪟',
  'Mac OS X': '🍎',
  'Linux': '🐧',
  'Android': '🤖',
  'iOS': '📱',
};

// 模拟登录日志数据生成函数
const generateMockLoginData = (count: number): LoginInforData[] => {
  const data: LoginInforData[] = [];
  const userNames = ['admin', 'test', 'demo', 'user', 'manager', 'guest', 'operator', 'developer'];
  const browsers = ['Chrome 14', 'Chrome 13', 'Firefox 91', 'Safari', 'Edge 94', 'Chrome 11'];
  const osList = ['Windows 10', 'Windows 11', 'Mac OS X', 'Linux', 'Android', 'iOS'];
  const locations = ['内网IP', '江苏省 南京市', '山东省 济南市', '广东省 广州市', '辽宁省 沈阳市', '吉林省 长春市', '四川省 成都市', '天津市 天津市', '北京市 北京市', '上海市 上海市'];
  const ips = ['127.0.0.1', '192.168.1.1', '10.0.0.1', '172.16.0.1', '221.226.116.90', '60.178.135.19', '113.214.223.91', '180.165.162.34'];
  const successMessages = ['登录成功', ''];
  const failMessages = ['用户不存在/密码错误', '验证码错误', '账户已锁定', '用户已停用', '密码过期', '登录超时'];

  for (let i = count; i > 0; i--) {
    const status = Math.random() > 0.3; // 70% 成功率
    const userName = userNames[Math.floor(Math.random() * userNames.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const os = osList[Math.floor(Math.random() * osList.length)];
    
    // 生成时间（最近7天内的随机时间）
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 7);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    
    const loginTime = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000 - randomHours * 60 * 60 * 1000 - randomMinutes * 60 * 1000 - randomSeconds * 1000);
    
    data.push({
      id: 238000 + i,
      userName,
      ipaddr: ips[Math.floor(Math.random() * ips.length)],
      loginLocation: locations[Math.floor(Math.random() * locations.length)],
      browser,
      os,
      status,
      msg: status 
        ? successMessages[Math.floor(Math.random() * successMessages.length)] || '登录成功'
        : failMessages[Math.floor(Math.random() * failMessages.length)],
      loginTime: loginTime.toISOString().replace('T', ' ').substring(0, 19),
    });
  }
  
  return data.sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
};

const LoginInforManagement = () => {
  // 登录日志数据
  const [loginInforData, setLoginInforData] = useState<LoginInforData[]>([]);
  const [filteredData, setFilteredData] = useState<LoginInforData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    ipaddr: "",
    userName: "",
    status: "",
    loginTime: null,
  });

  // 模态框状态
  const [currentLog, setCurrentLog] = useState<LoginInforData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // 生成大量模拟数据
  const mockData = useMemo(() => generateMockLoginData(8000), []);

  // 获取登录日志数据
  const getLoginInforData = useCallback(async () => {
    try {
      console.log("搜索参数:", searchParams);
      
      // 过滤数据
      let filtered = [...mockData];
      
      if (searchParams.ipaddr) {
        filtered = filtered.filter(item => 
          item.ipaddr.includes(searchParams.ipaddr!)
        );
      }
      
      if (searchParams.userName) {
        filtered = filtered.filter(item => 
          item.userName.includes(searchParams.userName!)
        );
      }
      
      if (searchParams.status) {
        const statusBool = searchParams.status === 'true';
        filtered = filtered.filter(item => item.status === statusBool);
      }
      
      if (searchParams.loginTime && searchParams.loginTime[0] && searchParams.loginTime[1]) {
        const startDate = new Date(searchParams.loginTime[0]);
        const endDate = new Date(searchParams.loginTime[1]);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.loginTime);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      setLoginInforData(mockData);
      setFilteredData(filtered);
      
      message.success(`数据加载成功，共 ${filtered.length} 条记录`);
    } catch (e) {
      console.log("获取登录日志数据失败:", e);
      message.error("获取登录日志数据失败");
    }
  }, [searchParams, mockData]);

  // 处理查看详情
  const handleViewDetail = (record: LoginInforData) => {
    setCurrentLog(record);
    setIsDetailModalVisible(true);
  };

  // 处理删除按钮点击
  const handleDelete = (record: LoginInforData) => {
    setCurrentLog(record);
    setIsDeleteModalVisible(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentLog?.id) {
      try {
        console.log("删除登录日志 ID:", currentLog.id);
        message.success("删除成功");
        // 重新获取数据
        getLoginInforData();
      } catch (error: unknown) {
        console.error(error);
        message.error("删除失败");
      }
    }
    setIsDeleteModalVisible(false);
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      ipaddr: "",
      userName: "",
      status: "",
      loginTime: null,
    });
  };

  // 导出功能
  const handleExport = async () => {
    try {
      console.log("导出登录日志数据");
      // 模拟导出逻辑
      const dataStr = JSON.stringify(filteredData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `登录日志_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      message.success("导出成功");
    } catch (e) {
      console.log("导出失败:", e);
      message.error("导出失败");
    }
  };

  // 清空日志
  const handleClear = () => {
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有登录日志吗？此操作不可恢复！',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          console.log("清空登录日志");
          setFilteredData([]);
          message.success("清空成功");
        } catch (e) {
          console.log("清空失败:", e);
          message.error("清空失败");
        }
      },
    });
  };

  // 解锁用户
  const handleUnlock = () => {
    Modal.confirm({
      title: '确认解锁',
      content: '确定要解锁选中的用户账户吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          console.log("解锁用户账户");
          message.success("解锁成功");
        } catch (e) {
          console.log("解锁失败:", e);
          message.error("解锁失败");
        }
      },
    });
  };

  // 渲染虚拟列表项
  const renderLoginItem = useCallback((item: LoginInforData, index: number) => {
    const statusInfo = statusMap[item.status.toString()];
    const browserIcon = browserIconMap[item.browser.split(' ')[0]] || '🌐';
    const osIcon = osIconMap[item.os] || '💻';
    
    return (
      <div className={styles.loginItem}>
        <div className={styles.loginHeader}>
          <div className={styles.loginTitle}>
            <Text strong>{item.userName}</Text>
            <Tag color={statusInfo.color} className={styles.statusTag}>
              {statusInfo.label}
            </Tag>
            <span className={styles.visitId}>#{item.id}</span>
          </div>
          <div className={styles.loginActions}>
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(item)}
            >
              详细
            </Button>
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(item)}
            >
              删除
            </Button>
          </div>
        </div>
        <div className={styles.loginContent}>
          <div className={styles.loginInfo}>
            <span className={styles.loginField}>
              <Text type="secondary">登录地址:</Text> {item.ipaddr}
            </span>
            <span className={styles.loginField}>
              <Text type="secondary">登录地点:</Text> {item.loginLocation}
            </span>
            <span className={styles.loginField}>
              <Text type="secondary">浏览器:</Text> 
              <span className={styles.browserInfo}>
                {browserIcon} {item.browser}
              </span>
            </span>
            <span className={styles.loginField}>
              <Text type="secondary">操作系统:</Text>
              <span className={styles.osInfo}>
                {osIcon} {item.os}
              </span>
            </span>
          </div>
          <div className={styles.loginMeta}>
            <span className={styles.loginField}>
              <Text type="secondary">登录时间:</Text> {item.loginTime}
            </span>
            {!item.status && (
              <span className={styles.loginField}>
                <Text type="secondary">提示消息:</Text> 
                <Text type="danger">{item.msg}</Text>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }, []);

  useEffect(() => {
    getLoginInforData();
  }, [getLoginInforData]);

  return (
    <div className={styles.loginInforManagement}>
      {/* 搜索表单 */}
      <Card className={styles.searchCard}>
        <Form layout="inline" className={styles.searchForm}>
          <Form.Item label="登录地址" name="ipaddr">
            <Input
              placeholder="请输入登录地址"
              style={{ width: 180 }}
              onChange={(e) => {
                setSearchParams({
                  ...searchParams,
                  ipaddr: e.target.value,
                });
              }}
              value={searchParams?.ipaddr}
            />
          </Form.Item>
          <Form.Item label="用户名称" name="userName">
            <Input
              placeholder="请输入用户名称"
              style={{ width: 180 }}
              onChange={(e) => {
                setSearchParams({
                  ...searchParams,
                  userName: e.target.value,
                });
              }}
              value={searchParams?.userName}
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select
              placeholder="登录状态"
              style={{ width: 180 }}
              options={[
                { label: "成功", value: "true" },
                { label: "失败", value: "false" },
              ]}
              onChange={(value) => {
                setSearchParams({
                  ...searchParams,
                  status: value,
                });
              }}
              value={searchParams?.status}
              allowClear
            />
          </Form.Item>
          <Form.Item label="登录时间" name="loginTime">
            <RangePicker
              style={{ width: 240 }}
              onChange={(dates, dateStrings) => {
                setSearchParams({
                  ...searchParams,
                  loginTime: dates ? [dateStrings[0], dateStrings[1]] : null,
                });
              }}
              placeholder={["开始日期", "结束日期"]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={getLoginInforData}
              style={{ marginRight: 8 }}
            >
              搜索
            </Button>
            <Button icon={<ReloadOutlined />} onClick={handleReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* 工具栏 */}
      <Card className={styles.toolbarCard}>
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <Text strong>登录日志列表</Text>
            <Text type="secondary" className={styles.recordCount}>
              共 {filteredData.length} 条记录
            </Text>
          </div>
          <Space>
            <Button 
              icon={<UnlockOutlined />}
              onClick={handleUnlock}
            >
              解锁
            </Button>
            <Button 
              danger
              icon={<DeleteOutlined />}
              onClick={handleClear}
            >
              清空
            </Button>
            <Button 
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
          </Space>
        </div>
      </Card>

      {/* 虚拟滚动列表 */}
      <Card className={styles.listCard}>
        <VirtualList
          items={filteredData}
          itemHeight={110}
          containerHeight={600}
          renderItem={renderLoginItem}
          className={styles.virtualList}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="登录日志详细"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentLog && (
          <div className={styles.loginDetail}>
            <div className={styles.detailSection}>
              <h4>基本信息</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <Text strong>访问编号:</Text>
                  <Text>{currentLog.id}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>用户名称:</Text>
                  <Text>{currentLog.userName}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>登录地址:</Text>
                  <Text>{currentLog.ipaddr}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>登录地点:</Text>
                  <Text>{currentLog.loginLocation}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>浏览器:</Text>
                  <Text>{currentLog.browser}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>操作系统:</Text>
                  <Text>{currentLog.os}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>登录状态:</Text>
                  <Tag color={statusMap[currentLog.status.toString()].color}>
                    {statusMap[currentLog.status.toString()].label}
                  </Tag>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>登录时间:</Text>
                  <Text>{currentLog.loginTime}</Text>
                </div>
              </div>
            </div>
            
            {currentLog.msg && (
              <>
                <Divider />
                <div className={styles.detailSection}>
                  <h4>提示信息</h4>
                  <div className={styles.detailItem}>
                    <Text strong>提示消息:</Text>
                    <Text type={currentLog.status ? "success" : "danger"}>
                      {currentLog.msg}
                    </Text>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      {/* 删除确认框 */}
      <Modal
        title="确认删除"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={confirmDelete}
        okType="danger"
      >
        <p>确定要删除这条登录日志吗？</p>
      </Modal>
    </div>
  );
};

export default LoginInforManagement;
