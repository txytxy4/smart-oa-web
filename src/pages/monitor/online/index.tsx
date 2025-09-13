import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Input,
  Table,
  message,
  Space,
  Modal,
  Tag,
} from "antd";
import {
  ReloadOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import styles from "./index.module.scss";

// 在线用户数据接口
interface OnlineUserData {
  id: number;
  sessionId: string;
  loginName: string;
  deptName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  loginTime: string;
}

// 搜索参数接口
interface SearchParams {
  ipaddr?: string;
  userName?: string;
}

// 分页数据接口
interface PageData {
  page: number;
  pageSize: number;
  total: number;
}

const { Column } = Table;

// 模拟在线用户数据
const mockOnlineUserData: OnlineUserData[] = [
  {
    id: 1,
    sessionId: "32f087b-7401-4f84-8a...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "113.218.170.231",
    loginLocation: "湖南省 长沙市",
    browser: "Chrome 13",
    os: "Mac OS X",
    loginTime: "2025-09-13 15:09:11",
  },
  {
    id: 2,
    sessionId: "4d8c250d-1c0c-4e23-8...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "36.110.76.42",
    loginLocation: "北京市 北京市",
    browser: "Chrome 13",
    os: "Windows 10",
    loginTime: "2025-09-13 15:26:04",
  },
  {
    id: 3,
    sessionId: "062bf84d-3ec3-422f-ae...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "183.221.0.75",
    loginLocation: "四川省 成都市",
    browser: "Chrome 14",
    os: "Windows 10",
    loginTime: "2025-09-13 15:04:06",
  },
  {
    id: 4,
    sessionId: "51fb7458-de8c-4b1e-ac...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "125.47.66.118",
    loginLocation: "河南省 郑州市",
    browser: "Chrome 13",
    os: "Windows 10",
    loginTime: "2025-09-13 15:23:03",
  },
  {
    id: 5,
    sessionId: "bab97a1d-bb25-4c4d-9...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "218.26.158.197",
    loginLocation: "山西省 太原市",
    browser: "Chrome Mobile",
    os: "Android 1.x",
    loginTime: "2025-09-13 15:27:18",
  },
  {
    id: 6,
    sessionId: "dc20c553-936f-45c2-af...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "183.192.121.178",
    loginLocation: "上海市 上海市",
    browser: "Chrome 14",
    os: "Windows 10",
    loginTime: "2025-09-13 15:12:34",
  },
  {
    id: 7,
    sessionId: "9873a5cc-9c2e-44f9-97...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "112.96.64.68",
    loginLocation: "广东省 广州市",
    browser: "Chrome Mobile",
    os: "Android 1.x",
    loginTime: "2025-09-13 15:02:59",
  },
  {
    id: 8,
    sessionId: "f6b5c4ca-bda1-4531-8d...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "220.175.48.223",
    loginLocation: "江西省 南昌市",
    browser: "Chrome 13",
    os: "Windows 10",
    loginTime: "2025-09-13 15:16:47",
  },
  {
    id: 9,
    sessionId: "cd23dfed-6e38-48c0-88...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "116.162.93.157",
    loginLocation: "湖南省 长沙市",
    browser: "Chrome 14",
    os: "Windows 10",
    loginTime: "2025-09-13 15:23:58",
  },
  {
    id: 10,
    sessionId: "ef8f9860-e870-49a1-9e...",
    loginName: "admin",
    deptName: "研发部门",
    ipaddr: "122.244.216.8",
    loginLocation: "浙江省 宁波市",
    browser: "Chrome Mobile",
    os: "Android 6.x",
    loginTime: "2025-09-13 15:25:39",
  },
];

const OnlineUserManagement = () => {
  // 在线用户数据
  const [onlineUserData, setOnlineUserData] = useState<OnlineUserData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    ipaddr: "",
    userName: "",
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框状态
  const [currentUser, setCurrentUser] = useState<OnlineUserData | null>(null);
  const [isForceLogoutModalVisible, setIsForceLogoutModalVisible] = useState(false);

  // 获取在线用户数据
  const getOnlineUserData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 这里使用模拟数据
      setOnlineUserData(mockOnlineUserData);
      setPageData(prev => ({ ...prev, total: mockOnlineUserData.length }));
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取在线用户数据失败:", e);
      message.error("获取在线用户数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理强退按钮点击
  const handleForceLogout = (record: OnlineUserData) => {
    setCurrentUser(record);
    setIsForceLogoutModalVisible(true);
    console.log("强退用户:", record);
  };

  // 确认强退
  const confirmForceLogout = async () => {
    if (currentUser?.id) {
      try {
        // 这里调用强退API
        console.log("强退用户 ID:", currentUser.id);
        message.success("强退成功");
        // 重新获取数据
        getOnlineUserData();
      } catch (error: unknown) {
        console.error(error);
        message.error("强退失败");
      }
    }
    setIsForceLogoutModalVisible(false);
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      ipaddr: "",
      userName: "",
    });
  };

  // 刷新数据
  const handleRefresh = () => {
    getOnlineUserData();
    message.info("数据已刷新");
  };

  // 获取浏览器标签颜色
  const getBrowserTagColor = (browser: string) => {
    if (browser.includes("Chrome")) {
      return "green";
    } else if (browser.includes("Firefox")) {
      return "orange";
    } else if (browser.includes("Safari")) {
      return "blue";
    } else if (browser.includes("Mobile")) {
      return "purple";
    }
    return "default";
  };

  // 获取操作系统标签颜色
  const getOSTagColor = (os: string) => {
    if (os.includes("Windows")) {
      return "blue";
    } else if (os.includes("Mac")) {
      return "cyan";
    } else if (os.includes("Android")) {
      return "green";
    } else if (os.includes("iOS")) {
      return "magenta";
    }
    return "default";
  };

  useEffect(() => {
    getOnlineUserData();
  }, [getOnlineUserData]);

  return (
    <div className={styles.onlineUserManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="登录地址" name="ipaddr">
          <Input
            placeholder="请输入登录地址"
            style={{ width: 200 }}
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
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                userName: e.target.value,
              });
            }}
            value={searchParams?.userName}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              getOnlineUserData();
            }}
            style={{ marginRight: 8 }}
          >
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>

      {/* 数据表格 */}
      <TableComponent<OnlineUserData>
        data={onlineUserData}
        toolbarRender={() => (
          <div className={styles.tableHeader}>
            <Button 
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
            >
              刷新
            </Button>
          </div>
        )}
        pagination={{
          current: pageData.page,
          pageSize: pageData.pageSize,
          total: pageData.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setPageData({ ...pageData, page, pageSize });
          },
          onShowSizeChange: (_, size) => {
            setPageData({ ...pageData, page: 1, pageSize: size });
          },
        }}
      >
        <Column 
          title="序号" 
          dataIndex="id" 
          key="id" 
          width={80}
        />
        <Column 
          title="会话编号" 
          dataIndex="sessionId" 
          key="sessionId"
          ellipsis
          render={(text) => (
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {text}
            </span>
          )}
        />
        <Column 
          title="登录名称" 
          dataIndex="loginName" 
          key="loginName"
          width={100}
          render={(text) => <Tag color="blue">{text}</Tag>}
        />
        <Column 
          title="部门名称" 
          dataIndex="deptName" 
          key="deptName"
          width={120}
        />
        <Column 
          title="主机" 
          dataIndex="ipaddr" 
          key="ipaddr"
          width={140}
          render={(text) => (
            <span style={{ fontFamily: 'monospace', color: '#1890ff' }}>
              {text}
            </span>
          )}
        />
        <Column 
          title="登录地址" 
          dataIndex="loginLocation" 
          key="loginLocation"
          width={140}
        />
        <Column 
          title="浏览器" 
          dataIndex="browser" 
          key="browser"
          width={120}
          render={(text) => (
            <Tag color={getBrowserTagColor(text)}>
              {text}
            </Tag>
          )}
        />
        <Column 
          title="操作系统" 
          dataIndex="os" 
          key="os"
          width={120}
          render={(text) => (
            <Tag color={getOSTagColor(text)}>
              {text}
            </Tag>
          )}
        />
        <Column 
          title="登录时间" 
          dataIndex="loginTime" 
          key="loginTime" 
          width={160}
          render={(text) => (
            <span style={{ fontSize: '12px' }}>
              {text}
            </span>
          )}
        />
        <Column
          title="操作"
          key="action"
          width={100}
          render={(_, record: OnlineUserData) => (
            <Space>
              <Button 
                type="link" 
                danger 
                size="small"
                icon={<LogoutOutlined />}
                onClick={() => handleForceLogout(record)}
              >
                强退
              </Button>
            </Space>
          )}
        />
      </TableComponent>

      {/* 强退确认框 */}
      <Modal
        title="确认强退"
        open={isForceLogoutModalVisible}
        onCancel={() => setIsForceLogoutModalVisible(false)}
        onOk={confirmForceLogout}
      >
        <p>确定要强制退出用户 "{currentUser?.loginName}" 吗？</p>
        <p>会话编号：{currentUser?.sessionId}</p>
        <p>登录地址：{currentUser?.ipaddr}</p>
      </Modal>
    </div>
  );
};

export default OnlineUserManagement;
