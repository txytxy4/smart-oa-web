import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Input,
  Table,
  Select,
  message,
  Space,
  Modal,
  DatePicker,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import styles from "./index.module.scss";

// 参数数据接口
interface ParameterData {
  id: number;
  parameterName: string;
  parameterKey: string;
  parameterValue: string;
  isSystemBuiltIn: boolean;
  remark?: string;
  createTime: string;
}

// 搜索参数接口
interface SearchParams {
  parameterName?: string;
  parameterKey?: string;
  isSystemBuiltIn?: string;
  createTime?: [string, string] | null;
}

// 分页数据接口
interface PageData {
  page: number;
  pageSize: number;
  total: number;
}

const { Column } = Table;
const { RangePicker } = DatePicker;

// 模拟参数数据
const mockParameterData: ParameterData[] = [
  {
    id: 1,
    parameterName: "主框架页-默认皮肤样式名称",
    parameterKey: "sys.index.skinName",
    parameterValue: "skin-blue",
    isSystemBuiltIn: true,
    remark: "蓝色 skin-blue、绿色 skin-green、紫色 skin-purple、红色 skin-red、黄色 skin-yellow",
    createTime: "2025-05-26 10:09:37",
  },
  {
    id: 2,
    parameterName: "用户管理-账号初始密码",
    parameterKey: "sys.user.initPassword",
    parameterValue: "123456",
    isSystemBuiltIn: true,
    remark: "初始化密码 123456",
    createTime: "2025-05-26 10:09:37",
  },
  {
    id: 3,
    parameterName: "主框架页-侧边栏主题",
    parameterKey: "sys.index.sideTheme",
    parameterValue: "theme-dark",
    isSystemBuiltIn: true,
    remark: "深色主题theme-dark,浅色主题theme-light",
    createTime: "2025-05-26 10:09:37",
  },
  {
    id: 4,
    parameterName: "账号自助-验证码开关",
    parameterKey: "sys.account.captchaEnabled",
    parameterValue: "true",
    isSystemBuiltIn: true,
    remark: "是否开启验证码功能(true开启，false关闭)",
    createTime: "2025-05-26 10:09:38",
  },
  {
    id: 5,
    parameterName: "账号自助-是否开启用户注册功能",
    parameterKey: "sys.account.registerUser",
    parameterValue: "false",
    isSystemBuiltIn: true,
    remark: "是否开启注册用户功能(true开启，false关闭)",
    createTime: "2025-05-26 10:09:38",
  },
  {
    id: 6,
    parameterName: "用户登录-黑名单列表",
    parameterKey: "sys.login.blackIPList",
    parameterValue: "",
    isSystemBuiltIn: true,
    remark: "设置登录IP黑名单限制，多个请用逗号隔开",
    createTime: "2025-05-26 10:09:38",
  },
  {
    id: 7,
    parameterName: "用户管理-初始密码修改策略",
    parameterKey: "sys.account.initPasswordModify",
    parameterValue: "1",
    isSystemBuiltIn: true,
    remark: "0:初始密码修改策略关闭，1:提示用户修改密码，2:强制用户修改密码",
    createTime: "2025-05-26 10:09:39",
  },
  {
    id: 8,
    parameterName: "用户管理-账号密码更新周期",
    parameterKey: "sys.account.passwordValidDays",
    parameterValue: "0",
    isSystemBuiltIn: true,
    remark: "密码更新周期(填写数字，数据单位天，默认0表示不限制)",
    createTime: "2025-05-26 10:09:39",
  },
];

const ParameterManagement = () => {
  // 参数数据
  const [parameterData, setParameterData] = useState<ParameterData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    parameterName: "",
    parameterKey: "",
    isSystemBuiltIn: "",
    createTime: null,
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框状态
  const [currentParameter, setCurrentParameter] = useState<ParameterData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 新增参数数据
  const [newParameter, setNewParameter] = useState({
    parameterName: "",
    parameterKey: "",
    parameterValue: "",
    isSystemBuiltIn: false,
    remark: "",
  });

  // 获取参数数据
  const getParameterData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 这里使用模拟数据
      setParameterData(mockParameterData);
      setPageData(prev => ({ ...prev, total: mockParameterData.length }));
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取参数数据失败:", e);
      message.error("获取参数数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理编辑按钮点击
  const handleEdit = (record: ParameterData) => {
    setCurrentParameter(record);
    setIsEditModalVisible(true);
    console.log("编辑参数:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: ParameterData) => {
    setCurrentParameter(record);
    setIsDeleteModalVisible(true);
    console.log("删除参数:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentParameter?.id) {
      try {
        // 这里调用删除API
        console.log("删除参数 ID:", currentParameter.id);
        message.success("删除成功");
        // 重新获取数据
        getParameterData();
      } catch (error: unknown) {
        console.error(error);
        message.error("删除失败");
      }
    }
    setIsDeleteModalVisible(false);
  };

  // 处理新增
  const handleAdd = async () => {
    try {
      console.log("新增参数:", newParameter);
      message.success("新增成功");
      setIsAddModalVisible(false);
      // 重置表单
      setNewParameter({
        parameterName: "",
        parameterKey: "",
        parameterValue: "",
        isSystemBuiltIn: false,
        remark: "",
      });
      // 重新获取数据
      getParameterData();
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      console.log("保存参数信息:", currentParameter);
      message.success("保存成功");
      setIsEditModalVisible(false);
      // 重新获取数据
      getParameterData();
    } catch (e) {
      console.log("保存失败:", e);
      message.error("保存失败");
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      parameterName: "",
      parameterKey: "",
      isSystemBuiltIn: "",
      createTime: null,
    });
  };

  // 刷新缓存
  const handleRefreshCache = async () => {
    try {
      console.log("刷新缓存");
      message.success("缓存刷新成功");
    } catch (e) {
      console.log("缓存刷新失败:", e);
      message.error("缓存刷新失败");
    }
  };

  useEffect(() => {
    getParameterData();
  }, [getParameterData]);

  return (
    <div className={styles.parameterManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="参数名称" name="parameterName">
          <Input
            placeholder="请输入参数名称"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                parameterName: e.target.value,
              });
            }}
            value={searchParams?.parameterName}
          />
        </Form.Item>
        <Form.Item label="参数键名" name="parameterKey">
          <Input
            placeholder="请输入参数键名"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                parameterKey: e.target.value,
              });
            }}
            value={searchParams?.parameterKey}
          />
        </Form.Item>
        <Form.Item label="系统内置" name="isSystemBuiltIn">
          <Select
            placeholder="系统内置"
            style={{ width: 200 }}
            options={[
              { label: "是", value: "true" },
              { label: "否", value: "false" },
            ]}
            onChange={(value) => {
              setSearchParams({
                ...searchParams,
                isSystemBuiltIn: value,
              });
            }}
            value={searchParams?.isSystemBuiltIn}
            allowClear
          />
        </Form.Item>
        <Form.Item label="创建时间" name="createTime">
          <RangePicker
            style={{ width: 240 }}
            onChange={(dates, dateStrings) => {
              setSearchParams({
                ...searchParams,
                createTime: dates ? [dateStrings[0], dateStrings[1]] : null,
              });
            }}
            placeholder={["开始日期", "结束日期"]}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              getParameterData();
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
      <TableComponent<ParameterData>
        data={parameterData}
        toolbarRender={(_, selectedRows) => (
          <div className={styles.tableHeader}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalVisible(true)}
            >
              新增
            </Button>
            <Button 
              icon={<EditOutlined />}
              onClick={() => handleEdit(selectedRows[0])} 
              disabled={selectedRows.length !== 1}
            >
              修改
            </Button>
            <Button 
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(selectedRows[0])} 
              disabled={selectedRows.length !== 1}
            >
              删除
            </Button>
            <Button 
              onClick={() => {
                console.log("导出选中数据:", selectedRows);
                message.info("导出功能待实现");
              }}
            >
              导出
            </Button>
            <Button 
              danger
              icon={<ReloadOutlined />}
              onClick={handleRefreshCache}
            >
              刷新缓存
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
          title="参数主键" 
          dataIndex="id" 
          key="id" 
          width={100}
        />
        <Column 
          title="参数名称" 
          dataIndex="parameterName" 
          key="parameterName" 
        />
        <Column 
          title="参数键名" 
          dataIndex="parameterKey" 
          key="parameterKey"
          render={(text) => <Tag color="blue">{text}</Tag>}
        />
        <Column 
          title="参数键值" 
          dataIndex="parameterValue" 
          key="parameterValue"
          render={(text) => <Tag color="green">{text}</Tag>}
        />
        <Column 
          title="系统内置" 
          dataIndex="isSystemBuiltIn" 
          key="isSystemBuiltIn"
          width={100}
          render={(isSystemBuiltIn: boolean) => (
            <Tag color={isSystemBuiltIn ? "red" : "default"}>
              {isSystemBuiltIn ? "是" : "否"}
            </Tag>
          )}
        />
        <Column 
          title="备注" 
          dataIndex="remark" 
          key="remark"
          ellipsis
        />
        <Column 
          title="创建时间" 
          dataIndex="createTime" 
          key="createTime" 
          width={180}
        />
        <Column
          title="操作"
          key="action"
          width={150}
          render={(_, record: ParameterData) => (
            <Space>
              <Button 
                type="link" 
                size="small"
                onClick={() => handleEdit(record)}
              >
                修改
              </Button>
              <Button 
                type="link" 
                danger 
                size="small"
                onClick={() => handleDelete(record)}
              >
                删除
              </Button>
            </Space>
          )}
        />
      </TableComponent>

      {/* 新增参数模态框 */}
      <Modal
        title="添加参数"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="参数名称" required>
            <Input
              placeholder="请输入参数名称"
              value={newParameter.parameterName}
              onChange={(e) => setNewParameter({ ...newParameter, parameterName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="参数键名" required>
            <Input
              placeholder="请输入参数键名"
              value={newParameter.parameterKey}
              onChange={(e) => setNewParameter({ ...newParameter, parameterKey: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="参数键值" required>
            <Input
              placeholder="请输入参数键值"
              value={newParameter.parameterValue}
              onChange={(e) => setNewParameter({ ...newParameter, parameterValue: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="系统内置">
            <Select
              value={newParameter.isSystemBuiltIn}
              onChange={(value) => setNewParameter({ ...newParameter, isSystemBuiltIn: value })}
              options={[
                { label: "是", value: true },
                { label: "否", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea
              placeholder="请输入备注"
              value={newParameter.remark}
              onChange={(e) => setNewParameter({ ...newParameter, remark: e.target.value })}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑参数模态框 */}
      <Modal
        title="修改参数"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={600}
      >
        {currentParameter && (
          <Form layout="vertical">
            <Form.Item label="参数名称" required>
              <Input
                placeholder="请输入参数名称"
                value={currentParameter.parameterName}
                onChange={(e) =>
                  setCurrentParameter({ ...currentParameter, parameterName: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="参数键名" required>
              <Input
                placeholder="请输入参数键名"
                value={currentParameter.parameterKey}
                onChange={(e) =>
                  setCurrentParameter({ ...currentParameter, parameterKey: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="参数键值" required>
              <Input
                placeholder="请输入参数键值"
                value={currentParameter.parameterValue}
                onChange={(e) =>
                  setCurrentParameter({ ...currentParameter, parameterValue: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="系统内置">
              <Select
                value={currentParameter.isSystemBuiltIn}
                onChange={(value) =>
                  setCurrentParameter({ ...currentParameter, isSystemBuiltIn: value })
                }
                options={[
                  { label: "是", value: true },
                  { label: "否", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="备注">
              <Input.TextArea
                placeholder="请输入备注"
                value={currentParameter.remark}
                onChange={(e) =>
                  setCurrentParameter({ ...currentParameter, remark: e.target.value })
                }
                rows={3}
              />
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 删除确认框 */}
      <Modal
        title="确认删除"
        open={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        onOk={confirmDelete}
      >
        <p>确定要删除参数 "{currentParameter?.parameterName}" 吗？</p>
      </Modal>
    </div>
  );
};

export default ParameterManagement;
