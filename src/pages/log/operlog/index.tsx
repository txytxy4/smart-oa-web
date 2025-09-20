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
} from "@ant-design/icons";
import VirtualList from "@/components/VirtualList";
import styles from "./index.module.scss";

// 操作日志数据接口
interface OperLogData {
  id: number;
  title: string;
  businessType: string;
  method: string;
  requestMethod: string;
  operatorType: string;
  operName: string;
  deptName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  operParam?: string;
  jsonResult?: string;
  status: boolean;
  errorMsg?: string;
  operTime: string;
  costTime: number;
}

// 搜索参数接口
interface SearchParams {
  title?: string;
  operName?: string;
  businessType?: string;
  status?: string;
  operTime?: [string, string] | null;
}

const { RangePicker } = DatePicker;
const { Text } = Typography;

// 业务类型映射
const businessTypeMap: Record<string, { label: string; color: string }> = {
  '0': { label: '其它', color: 'default' },
  '1': { label: '新增', color: 'green' },
  '2': { label: '修改', color: 'blue' },
  '3': { label: '删除', color: 'red' },
  '4': { label: '授权', color: 'purple' },
  '5': { label: '导出', color: 'orange' },
  '6': { label: '导入', color: 'cyan' },
  '7': { label: '强退', color: 'magenta' },
  '8': { label: '生成代码', color: 'lime' },
  '9': { label: '清空数据', color: 'volcano' },
};

// 操作类型映射
const operatorTypeMap: Record<string, string> = {
  '0': '其它',
  '1': '后台用户',
  '2': '手机端用户',
};

// 模拟操作日志数据生成函数
const generateMockData = (count: number): OperLogData[] => {
  const data: OperLogData[] = [];
  const titles = ['用户管理', '角色管理', '部门管理', '菜单管理', '字典管理', '参数设置', '公告管理', '日志管理', '文件管理', '系统监控'];
  const methods = ['com.ruoyi.web.controller.system.SysUserController.add', 'com.ruoyi.web.controller.system.SysRoleController.edit', 'com.ruoyi.web.controller.system.SysDeptController.remove'];
  const requestMethods = ['GET', 'POST', 'PUT', 'DELETE'];
  const operNames = ['admin', 'test', 'demo', 'user'];
  const deptNames = ['研发部门', '市场部门', '测试部门', '财务部门', '运维部门'];
  const locations = ['内网IP', '江苏省 南京市', '山东省 济南市', '广东省 广州市', '辽宁省 沈阳市', '吉林省 长春市', '四川省 成都市', '天津市 天津市'];
  const ips = ['127.0.0.1', '192.168.1.1', '10.0.0.1', '172.16.0.1'];

  for (let i = count; i > 0; i--) {
    const businessType = Math.floor(Math.random() * 10).toString();
    const status = Math.random() > 0.1; // 90% 成功率
    const costTime = Math.floor(Math.random() * 5000) + 10; // 10-5010ms
    
    // 生成时间（最近30天内的随机时间）
    const now = new Date();
    const randomDays = Math.floor(Math.random() * 30);
    const randomHours = Math.floor(Math.random() * 24);
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    
    const operTime = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000 - randomHours * 60 * 60 * 1000 - randomMinutes * 60 * 1000 - randomSeconds * 1000);
    
    data.push({
      id: 5000 + i,
      title: titles[Math.floor(Math.random() * titles.length)],
      businessType,
      method: methods[Math.floor(Math.random() * methods.length)],
      requestMethod: requestMethods[Math.floor(Math.random() * requestMethods.length)],
      operatorType: Math.floor(Math.random() * 3).toString(),
      operName: operNames[Math.floor(Math.random() * operNames.length)],
      deptName: deptNames[Math.floor(Math.random() * deptNames.length)],
      operUrl: `/system/${titles[Math.floor(Math.random() * titles.length)].toLowerCase()}`,
      operIp: ips[Math.floor(Math.random() * ips.length)],
      operLocation: locations[Math.floor(Math.random() * locations.length)],
      operParam: status ? '{"userId":1,"userName":"admin"}' : undefined,
      jsonResult: status ? '{"code":200,"msg":"操作成功"}' : '{"code":500,"msg":"操作失败"}',
      status,
      errorMsg: status ? undefined : '系统异常',
      operTime: operTime.toISOString().replace('T', ' ').substring(0, 19),
      costTime,
    });
  }
  
  return data.sort((a, b) => new Date(b.operTime).getTime() - new Date(a.operTime).getTime());
};

const OperLogManagement = () => {
  // 操作日志数据
  const [operLogData, setOperLogData] = useState<OperLogData[]>([]);
  const [filteredData, setFilteredData] = useState<OperLogData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    title: "",
    operName: "",
    businessType: "",
    status: "",
    operTime: null,
  });

  // 模态框状态
  const [currentLog, setCurrentLog] = useState<OperLogData | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // 生成大量模拟数据
  const mockData = useMemo(() => generateMockData(10000), []);

  // 获取操作日志数据
  const getOperLogData = useCallback(async () => {
    try {
      console.log("搜索参数:", searchParams);
      
      // 过滤数据
      let filtered = [...mockData];
      
      if (searchParams.title) {
        filtered = filtered.filter(item => 
          item.title.includes(searchParams.title!)
        );
      }
      
      if (searchParams.operName) {
        filtered = filtered.filter(item => 
          item.operName.includes(searchParams.operName!)
        );
      }
      
      if (searchParams.businessType) {
        filtered = filtered.filter(item => item.businessType === searchParams.businessType);
      }
      
      if (searchParams.status) {
        const statusBool = searchParams.status === 'true';
        filtered = filtered.filter(item => item.status === statusBool);
      }
      
      if (searchParams.operTime && searchParams.operTime[0] && searchParams.operTime[1]) {
        const startDate = new Date(searchParams.operTime[0]);
        const endDate = new Date(searchParams.operTime[1]);
        filtered = filtered.filter(item => {
          const itemDate = new Date(item.operTime);
          return itemDate >= startDate && itemDate <= endDate;
        });
      }
      
      setOperLogData(mockData);
      setFilteredData(filtered);
      
      message.success(`数据加载成功，共 ${filtered.length} 条记录`);
    } catch (e) {
      console.log("获取操作日志数据失败:", e);
      message.error("获取操作日志数据失败");
    }
  }, [searchParams, mockData]);

  // 处理查看详情
  const handleViewDetail = (record: OperLogData) => {
    setCurrentLog(record);
    setIsDetailModalVisible(true);
  };

  // 处理删除按钮点击
  const handleDelete = (record: OperLogData) => {
    setCurrentLog(record);
    setIsDeleteModalVisible(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentLog?.id) {
      try {
        console.log("删除操作日志 ID:", currentLog.id);
        message.success("删除成功");
        // 重新获取数据
        getOperLogData();
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
      title: "",
      operName: "",
      businessType: "",
      status: "",
      operTime: null,
    });
  };

  // 导出功能
  const handleExport = async () => {
    try {
      console.log("导出操作日志数据");
      // 模拟导出逻辑
      const dataStr = JSON.stringify(filteredData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `操作日志_${new Date().toISOString().slice(0, 10)}.json`;
      
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
      content: '确定要清空所有操作日志吗？此操作不可恢复！',
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          console.log("清空操作日志");
          setFilteredData([]);
          message.success("清空成功");
        } catch (e) {
          console.log("清空失败:", e);
          message.error("清空失败");
        }
      },
    });
  };

  // 渲染虚拟列表项
  const renderLogItem = useCallback((item: OperLogData, index: number) => {
    const businessTypeInfo = businessTypeMap[item.businessType] || businessTypeMap['0'];
    
    return (
      <div className={styles.logItem}>
        <div className={styles.logHeader}>
          <div className={styles.logTitle}>
            <Text strong>{item.title}</Text>
            <Tag color={businessTypeInfo.color} className={styles.businessTag}>
              {businessTypeInfo.label}
            </Tag>
            <Tag color={item.status ? 'success' : 'error'} className={styles.statusTag}>
              {item.status ? '成功' : '失败'}
            </Tag>
          </div>
          <div className={styles.logActions}>
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
        <div className={styles.logContent}>
          <div className={styles.logInfo}>
            <span className={styles.logField}>
              <Text type="secondary">操作人员:</Text> {item.operName}
            </span>
            <span className={styles.logField}>
              <Text type="secondary">部门:</Text> {item.deptName}
            </span>
            <span className={styles.logField}>
              <Text type="secondary">请求方式:</Text> 
              <Tag color="blue" size="small">{item.requestMethod}</Tag>
            </span>
            <span className={styles.logField}>
              <Text type="secondary">操作地址:</Text> {item.operIp}
            </span>
            <span className={styles.logField}>
              <Text type="secondary">操作地点:</Text> {item.operLocation}
            </span>
          </div>
          <div className={styles.logMeta}>
            <span className={styles.logField}>
              <Text type="secondary">操作时间:</Text> {item.operTime}
            </span>
            <span className={styles.logField}>
              <Text type="secondary">消耗时间:</Text> {item.costTime}毫秒
            </span>
          </div>
        </div>
      </div>
    );
  }, []);

  useEffect(() => {
    getOperLogData();
  }, [getOperLogData]);

  return (
    <div className={styles.operLogManagement}>
      {/* 搜索表单 */}
      <Card className={styles.searchCard}>
        <Form layout="inline" className={styles.searchForm}>
          <Form.Item label="系统模块" name="title">
            <Input
              placeholder="请输入系统模块"
              style={{ width: 180 }}
              onChange={(e) => {
                setSearchParams({
                  ...searchParams,
                  title: e.target.value,
                });
              }}
              value={searchParams?.title}
            />
          </Form.Item>
          <Form.Item label="操作人员" name="operName">
            <Input
              placeholder="请输入操作人员"
              style={{ width: 180 }}
              onChange={(e) => {
                setSearchParams({
                  ...searchParams,
                  operName: e.target.value,
                });
              }}
              value={searchParams?.operName}
            />
          </Form.Item>
          <Form.Item label="业务类型" name="businessType">
            <Select
              placeholder="操作类型"
              style={{ width: 180 }}
              options={Object.entries(businessTypeMap).map(([key, value]) => ({
                label: value.label,
                value: key,
              }))}
              onChange={(value) => {
                setSearchParams({
                  ...searchParams,
                  businessType: value,
                });
              }}
              value={searchParams?.businessType}
              allowClear
            />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select
              placeholder="操作状态"
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
          <Form.Item label="操作时间" name="operTime">
            <RangePicker
              style={{ width: 240 }}
              onChange={(dates, dateStrings) => {
                setSearchParams({
                  ...searchParams,
                  operTime: dates ? [dateStrings[0], dateStrings[1]] : null,
                });
              }}
              placeholder={["开始日期", "结束日期"]}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={getOperLogData}
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
            <Text strong>操作日志列表</Text>
            <Text type="secondary" className={styles.recordCount}>
              共 {filteredData.length} 条记录
            </Text>
          </div>
          <Space>
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
          itemHeight={120}
          containerHeight={600}
          renderItem={renderLogItem}
          className={styles.virtualList}
        />
      </Card>

      {/* 详情模态框 */}
      <Modal
        title="操作日志详细"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentLog && (
          <div className={styles.logDetail}>
            <div className={styles.detailSection}>
              <h4>基本信息</h4>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <Text strong>操作模块:</Text>
                  <Text>{currentLog.title}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>业务类型:</Text>
                  <Tag color={businessTypeMap[currentLog.businessType]?.color || 'default'}>
                    {businessTypeMap[currentLog.businessType]?.label || '其它'}
                  </Tag>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>请求方式:</Text>
                  <Tag color="blue">{currentLog.requestMethod}</Tag>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>操作类别:</Text>
                  <Text>{operatorTypeMap[currentLog.operatorType] || '其它'}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>操作人员:</Text>
                  <Text>{currentLog.operName}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>所属部门:</Text>
                  <Text>{currentLog.deptName}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>请求地址:</Text>
                  <Text code>{currentLog.operUrl}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>操作地址:</Text>
                  <Text>{currentLog.operIp}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>操作地点:</Text>
                  <Text>{currentLog.operLocation}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>操作状态:</Text>
                  <Tag color={currentLog.status ? 'success' : 'error'}>
                    {currentLog.status ? '正常' : '异常'}
                  </Tag>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>操作时间:</Text>
                  <Text>{currentLog.operTime}</Text>
                </div>
                <div className={styles.detailItem}>
                  <Text strong>消耗时间:</Text>
                  <Text>{currentLog.costTime}毫秒</Text>
                </div>
              </div>
            </div>
            
            <Divider />
            
            <div className={styles.detailSection}>
              <h4>请求信息</h4>
              <div className={styles.detailItem} style={{ marginBottom: 16 }}>
                <Text strong>请求方法:</Text>
                <Text code style={{ fontSize: 12, wordBreak: 'break-all' }}>
                  {currentLog.method}
                </Text>
              </div>
              <div className={styles.detailItem}>
                <Text strong>请求参数:</Text>
                <pre className={styles.jsonContent}>
                  {currentLog.operParam || '无参数'}
                </pre>
              </div>
            </div>
            
            <Divider />
            
            <div className={styles.detailSection}>
              <h4>响应信息</h4>
              <div className={styles.detailItem}>
                <Text strong>返回结果:</Text>
                <pre className={styles.jsonContent}>
                  {currentLog.jsonResult || '无返回数据'}
                </pre>
              </div>
              {currentLog.errorMsg && (
                <div className={styles.detailItem}>
                  <Text strong>异常信息:</Text>
                  <Text type="danger">{currentLog.errorMsg}</Text>
                </div>
              )}
            </div>
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
        <p>确定要删除这条操作日志吗？</p>
      </Modal>
    </div>
  );
};

export default OperLogManagement;
