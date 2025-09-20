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
  Switch,
  DatePicker,
  TreeSelect,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  MenuOutlined,
  UserOutlined,
  SettingOutlined,
  DesktopOutlined,
  ToolOutlined,
  SoundOutlined,
  BuildOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  HomeOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import styles from "./index.module.scss";

// 菜单数据接口
interface MenuData {
  id: number;
  menuName: string;
  parentId: number;
  orderNum: number;
  path?: string;
  component?: string;
  query?: string;
  isFrame: boolean;
  isCache: boolean;
  menuType: 'M' | 'C' | 'F'; // M目录 C菜单 F按钮
  visible: boolean;
  status: boolean;
  perms?: string;
  icon?: string;
  createTime: string;
  remark?: string;
  children?: MenuData[];
}

// 搜索参数接口
interface SearchParams {
  menuName?: string;
  status?: string;
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
const { TextArea } = Input;

// 图标选项
const iconOptions = [
  { value: 'HomeOutlined', label: '首页', icon: <HomeOutlined /> },
  { value: 'UserOutlined', label: '用户', icon: <UserOutlined /> },
  { value: 'SettingOutlined', label: '设置', icon: <SettingOutlined /> },
  { value: 'MenuOutlined', label: '菜单', icon: <MenuOutlined /> },
  { value: 'DesktopOutlined', label: '监控', icon: <DesktopOutlined /> },
  { value: 'ToolOutlined', label: '工具', icon: <ToolOutlined /> },
  { value: 'SoundOutlined', label: '公告', icon: <SoundOutlined /> },
  { value: 'BuildOutlined', label: '构建', icon: <BuildOutlined /> },
  { value: 'ClockCircleOutlined', label: '任务', icon: <ClockCircleOutlined /> },
  { value: 'DatabaseOutlined', label: '数据库', icon: <DatabaseOutlined /> },
  { value: 'ShoppingOutlined', label: '商品', icon: <ShoppingOutlined /> },
];

// 模拟菜单数据
const mockMenuData: MenuData[] = [
  {
    id: 1,
    menuName: "系统管理",
    parentId: 0,
    orderNum: 1,
    path: "system",
    component: "",
    query: "",
    isFrame: false,
    isCache: false,
    menuType: "M",
    visible: true,
    status: true,
    perms: "",
    icon: "SettingOutlined",
    createTime: "2025-05-26 10:07:40",
    remark: "系统管理目录",
    children: [
      {
        id: 2,
        menuName: "用户管理",
        parentId: 1,
        orderNum: 1,
        path: "userList",
        component: "pages/User/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "system:user:list",
        icon: "UserOutlined",
        createTime: "2025-05-26 10:07:41",
        remark: "用户管理菜单",
      },
      {
        id: 3,
        menuName: "角色管理",
        parentId: 1,
        orderNum: 2,
        path: "role",
        component: "pages/role/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "system:role:list",
        icon: "UserOutlined",
        createTime: "2025-05-26 10:07:42",
        remark: "角色管理菜单",
      },
      {
        id: 4,
        menuName: "部门管理",
        parentId: 1,
        orderNum: 3,
        path: "department",
        component: "pages/department/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "system:dept:list",
        icon: "UserOutlined",
        createTime: "2025-05-26 10:07:43",
        remark: "部门管理菜单",
      },
      {
        id: 5,
        menuName: "岗位管理",
        parentId: 1,
        orderNum: 4,
        path: "position",
        component: "pages/position/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "system:post:list",
        icon: "UserOutlined",
        createTime: "2025-05-26 10:07:44",
        remark: "岗位管理菜单",
      },
      {
        id: 6,
        menuName: "菜单管理",
        parentId: 1,
        orderNum: 5,
        path: "menu",
        component: "pages/menu/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "system:menu:list",
        icon: "MenuOutlined",
        createTime: "2025-05-26 10:07:45",
        remark: "菜单管理菜单",
      },
      {
        id: 7,
        menuName: "参数设置",
        parentId: 1,
        orderNum: 6,
        path: "parameter",
        component: "pages/parameter/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "system:config:list",
        icon: "SettingOutlined",
        createTime: "2025-05-26 10:07:46",
        remark: "参数设置菜单",
      },
      {
        id: 8,
        menuName: "公告管理",
        parentId: 1,
        orderNum: 7,
        path: "announcement",
        component: "pages/announcement/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "system:notice:list",
        icon: "SoundOutlined",
        createTime: "2025-05-26 10:07:47",
        remark: "公告管理菜单",
      },
    ]
  },
  {
    id: 9,
    menuName: "系统监控",
    parentId: 0,
    orderNum: 2,
    path: "monitor",
    component: "",
    query: "",
    isFrame: false,
    isCache: false,
    menuType: "M",
    visible: true,
    status: true,
    perms: "",
    icon: "DesktopOutlined",
    createTime: "2025-05-26 10:07:48",
    remark: "系统监控目录",
    children: [
      {
        id: 10,
        menuName: "在线用户",
        parentId: 9,
        orderNum: 1,
        path: "monitor/online",
        component: "pages/monitor/online/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "monitor:online:list",
        icon: "UserOutlined",
        createTime: "2025-05-26 10:07:49",
        remark: "在线用户菜单",
      },
      {
        id: 11,
        menuName: "定时任务",
        parentId: 9,
        orderNum: 2,
        path: "monitor/job",
        component: "pages/monitor/job/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "monitor:job:list",
        icon: "ClockCircleOutlined",
        createTime: "2025-05-26 10:07:50",
        remark: "定时任务菜单",
      },
      {
        id: 12,
        menuName: "缓存监控",
        parentId: 9,
        orderNum: 3,
        path: "monitor/cache",
        component: "pages/monitor/cache/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "monitor:cache:list",
        icon: "DatabaseOutlined",
        createTime: "2025-05-26 10:07:51",
        remark: "缓存监控菜单",
      },
    ]
  },
  {
    id: 13,
    menuName: "系统工具",
    parentId: 0,
    orderNum: 3,
    path: "tool",
    component: "",
    query: "",
    isFrame: false,
    isCache: false,
    menuType: "M",
    visible: true,
    status: true,
    perms: "",
    icon: "ToolOutlined",
    createTime: "2025-05-26 10:07:52",
    remark: "系统工具目录",
    children: [
      {
        id: 14,
        menuName: "表单构建",
        parentId: 13,
        orderNum: 1,
        path: "tool/build",
        component: "pages/tool/build/index",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "tool:build:list",
        icon: "BuildOutlined",
        createTime: "2025-05-26 10:07:53",
        remark: "表单构建菜单",
      },
    ]
  },
];

// 为表格数据添加key和层级信息
const processTreeData = (data: MenuData[]): MenuData[] => {
  const processNode = (node: MenuData): MenuData => {
    const processedNode = {
      ...node,
      key: node.id.toString(),
    };
    
    if (node.children && node.children.length > 0) {
      processedNode.children = node.children.map(child => processNode(child));
    }
    
    return processedNode;
  };
  
  return data.map(item => processNode(item));
};

// 构建菜单树选择器数据
interface TreeSelectNode {
  value: number;
  title: string;
  children?: TreeSelectNode[];
}

const buildTreeSelectData = (data: MenuData[]): TreeSelectNode[] => {
  return data.map(item => ({
    value: item.id,
    title: item.menuName,
    children: item.children && item.children.length > 0 ? buildTreeSelectData(item.children) : undefined
  }));
};

// 获取图标组件
const getIconComponent = (iconName?: string) => {
  if (!iconName) return null;
  
  const iconMap: Record<string, React.ReactNode> = {
    'HomeOutlined': <HomeOutlined />,
    'UserOutlined': <UserOutlined />,
    'SettingOutlined': <SettingOutlined />,
    'MenuOutlined': <MenuOutlined />,
    'DesktopOutlined': <DesktopOutlined />,
    'ToolOutlined': <ToolOutlined />,
    'SoundOutlined': <SoundOutlined />,
    'BuildOutlined': <BuildOutlined />,
    'ClockCircleOutlined': <ClockCircleOutlined />,
    'DatabaseOutlined': <DatabaseOutlined />,
    'ShoppingOutlined': <ShoppingOutlined />,
  };
  
  return iconMap[iconName] || null;
};

const MenuManagement = () => {
  // 菜单数据
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [processedData, setProcessedData] = useState<MenuData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    menuName: "",
    status: "",
    createTime: null,
  });
  const [pageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // 模态框状态
  const [currentMenu, setCurrentMenu] = useState<MenuData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 新增菜单数据
  const [newMenu, setNewMenu] = useState({
    menuName: "",
    parentId: 0,
    orderNum: 0,
    path: "",
    component: "",
    query: "",
    isFrame: false,
    isCache: false,
    menuType: "C" as 'M' | 'C' | 'F',
    visible: true,
    status: true,
    perms: "",
    icon: "",
    remark: "",
  });

  // 获取菜单数据
  const getMenuData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 这里使用模拟数据
      setMenuData(mockMenuData);
      const processedTreeData = processTreeData(mockMenuData);
      setProcessedData(processedTreeData);
      
      // 默认展开第一级
      const firstLevelKeys = mockMenuData.map(item => item.id.toString());
      setExpandedRowKeys(firstLevelKeys);
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取菜单数据失败:", e);
      message.error("获取菜单数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理展开/收起
  const handleExpand = (expanded: boolean, record: MenuData) => {
    const key = record.id.toString();
    if (expanded) {
      setExpandedRowKeys(prev => [...prev, key]);
    } else {
      setExpandedRowKeys(prev => prev.filter(k => k !== key));
    }
  };

  // 展开/收起所有
  const handleExpandAll = () => {
    const getAllKeys = (data: MenuData[]): string[] => {
      let keys: string[] = [];
      data.forEach(item => {
        keys.push(item.id.toString());
        if (item.children && item.children.length > 0) {
          keys = keys.concat(getAllKeys(item.children));
        }
      });
      return keys;
    };

    if (expandedRowKeys.length > 0) {
      // 收起所有
      setExpandedRowKeys([]);
    } else {
      // 展开所有
      const allKeys = getAllKeys(mockMenuData);
      setExpandedRowKeys(allKeys);
    }
  };

  // 处理编辑按钮点击
  const handleEdit = (record: MenuData) => {
    setCurrentMenu(record);
    setIsEditModalVisible(true);
    console.log("编辑菜单:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: MenuData) => {
    setCurrentMenu(record);
    setIsDeleteModalVisible(true);
    console.log("删除菜单:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentMenu?.id) {
      try {
        // 这里调用删除API
        console.log("删除菜单 ID:", currentMenu.id);
        message.success("删除成功");
        // 重新获取数据
        getMenuData();
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
      console.log("新增菜单:", newMenu);
      message.success("新增成功");
      setIsAddModalVisible(false);
      // 重置表单
      setNewMenu({
        menuName: "",
        parentId: 0,
        orderNum: 0,
        path: "",
        component: "",
        query: "",
        isFrame: false,
        isCache: false,
        menuType: "C",
        visible: true,
        status: true,
        perms: "",
        icon: "",
        remark: "",
      });
      // 重新获取数据
      getMenuData();
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      console.log("保存菜单信息:", currentMenu);
      message.success("保存成功");
      setIsEditModalVisible(false);
      // 重新获取数据
      getMenuData();
    } catch (e) {
      console.log("保存失败:", e);
      message.error("保存失败");
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      menuName: "",
      status: "",
      createTime: null,
    });
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      console.log(`切换菜单 ${id} 状态为:`, status);
      // 这里应该调用API更新状态
      message.success("状态更新成功");
      // 重新获取数据
      getMenuData();
    } catch (e) {
      console.log("状态更新失败:", e);
      message.error("状态更新失败");
    }
  };

  useEffect(() => {
    getMenuData();
  }, [getMenuData]);

  return (
    <div className={styles.menuManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="菜单名称" name="menuName">
          <Input
            placeholder="请输入菜单名称"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                menuName: e.target.value,
              });
            }}
            value={searchParams?.menuName}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            placeholder="菜单状态"
            style={{ width: 200 }}
            options={[
              { label: "正常", value: "true" },
              { label: "停用", value: "false" },
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
              getMenuData();
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
      <TableComponent<MenuData>
        data={processedData}
        toolbarRender={() => (
          <div className={styles.tableHeader}>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setIsAddModalVisible(true)}
            >
              新增
            </Button>
            <Button onClick={handleExpandAll}>
              {expandedRowKeys.length > 0 ? '折叠' : '展开'}
            </Button>
          </div>
        )}
        pagination={undefined} // 树形表格通常不分页
        expandable={{
          expandedRowKeys,
          onExpand: handleExpand,
          indentSize: 20,
        }}
      >
        <Column 
          title="菜单名称" 
          dataIndex="menuName" 
          key="menuName"
          width={200}
          render={(text: string, record: MenuData) => (
            <Space>
              {getIconComponent(record.icon)}
              <span>{text}</span>
            </Space>
          )}
        />
        <Column 
          title="图标" 
          dataIndex="icon" 
          key="icon" 
          width={80}
          render={(icon: string) => getIconComponent(icon)}
        />
        <Column 
          title="排序" 
          dataIndex="orderNum" 
          key="orderNum" 
          width={80}
        />
        <Column
          title="权限标识"
          dataIndex="perms"
          key="perms"
          width={150}
          render={(text: string) => text || '-'}
        />
        <Column 
          title="组件路径" 
          dataIndex="component" 
          key="component" 
          width={150}
          render={(text: string) => text || '-'}
        />
        <Column
          title="状态"
          key="status"
          width={100}
          render={(_, record: MenuData) => (
            <Switch
              checked={record.status}
              onChange={(checked) => handleStatusChange(record.id, checked)}
              checkedChildren="正常"
              unCheckedChildren="停用"
            />
          )}
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
          width={180}
          render={(_, record: MenuData) => (
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
                size="small"
                onClick={() => {
                  setNewMenu({ ...newMenu, parentId: record.id });
                  setIsAddModalVisible(true);
                }}
              >
                新增
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

      {/* 新增菜单模态框 */}
      <Modal
        title="添加菜单"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={700}
      >
        <Form layout="vertical">
          <Form.Item label="上级菜单">
            <TreeSelect
              value={newMenu.parentId === 0 ? undefined : newMenu.parentId}
              onChange={(value) => setNewMenu({ ...newMenu, parentId: value || 0 })}
              treeData={[
                { value: 0, title: "主类目" },
                ...buildTreeSelectData(menuData)
              ]}
              placeholder="选择上级菜单"
              allowClear
            />
          </Form.Item>
          <Form.Item label="菜单类型" required>
            <Select
              value={newMenu.menuType}
              onChange={(value) => setNewMenu({ ...newMenu, menuType: value })}
              options={[
                { label: "目录", value: "M" },
                { label: "菜单", value: "C" },
                { label: "按钮", value: "F" },
              ]}
            />
          </Form.Item>
          <Form.Item label="菜单图标">
            <Select
              value={newMenu.icon}
              onChange={(value) => setNewMenu({ ...newMenu, icon: value })}
              placeholder="选择菜单图标"
              allowClear
            >
              {iconOptions.map(option => (
                <Select.Option key={option.value} value={option.value}>
                  <Space>
                    {option.icon}
                    <span>{option.label}</span>
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="菜单名称" required>
            <Input
              placeholder="请输入菜单名称"
              value={newMenu.menuName}
              onChange={(e) => setNewMenu({ ...newMenu, menuName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="显示排序">
            <InputNumber
              placeholder="请输入显示排序"
              value={newMenu.orderNum}
              onChange={(value) => setNewMenu({ ...newMenu, orderNum: value || 0 })}
              style={{ width: '100%' }}
            />
          </Form.Item>
          {newMenu.menuType !== 'F' && (
            <>
              <Form.Item label="路由地址">
                <Input
                  placeholder="请输入路由地址"
                  value={newMenu.path}
                  onChange={(e) => setNewMenu({ ...newMenu, path: e.target.value })}
                />
              </Form.Item>
              <Form.Item label="组件路径">
                <Input
                  placeholder="请输入组件路径"
                  value={newMenu.component}
                  onChange={(e) => setNewMenu({ ...newMenu, component: e.target.value })}
                />
              </Form.Item>
            </>
          )}
          <Form.Item label="权限标识">
            <Input
              placeholder="请输入权限标识"
              value={newMenu.perms}
              onChange={(e) => setNewMenu({ ...newMenu, perms: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="路由参数">
            <Input
              placeholder="请输入路由参数"
              value={newMenu.query}
              onChange={(e) => setNewMenu({ ...newMenu, query: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="是否外链">
            <Select
              value={newMenu.isFrame}
              onChange={(value) => setNewMenu({ ...newMenu, isFrame: value })}
              options={[
                { label: "是", value: true },
                { label: "否", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="是否缓存">
            <Select
              value={newMenu.isCache}
              onChange={(value) => setNewMenu({ ...newMenu, isCache: value })}
              options={[
                { label: "缓存", value: true },
                { label: "不缓存", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="显示状态">
            <Select
              value={newMenu.visible}
              onChange={(value) => setNewMenu({ ...newMenu, visible: value })}
              options={[
                { label: "显示", value: true },
                { label: "隐藏", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="菜单状态">
            <Select
              value={newMenu.status}
              onChange={(value) => setNewMenu({ ...newMenu, status: value })}
              options={[
                { label: "正常", value: true },
                { label: "停用", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注">
            <TextArea
              rows={3}
              placeholder="请输入内容"
              value={newMenu.remark}
              onChange={(e) => setNewMenu({ ...newMenu, remark: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑菜单模态框 */}
      <Modal
        title="修改菜单"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={700}
      >
        {currentMenu && (
          <Form layout="vertical">
            <Form.Item label="上级菜单">
              <TreeSelect
                value={currentMenu.parentId === 0 ? undefined : currentMenu.parentId}
                onChange={(value) => setCurrentMenu({ ...currentMenu, parentId: value || 0 })}
                treeData={[
                  { value: 0, title: "主类目" },
                  ...buildTreeSelectData(menuData)
                ]}
                placeholder="选择上级菜单"
                allowClear
              />
            </Form.Item>
            <Form.Item label="菜单类型" required>
              <Select
                value={currentMenu.menuType}
                onChange={(value) => setCurrentMenu({ ...currentMenu, menuType: value })}
                options={[
                  { label: "目录", value: "M" },
                  { label: "菜单", value: "C" },
                  { label: "按钮", value: "F" },
                ]}
              />
            </Form.Item>
            <Form.Item label="菜单图标">
              <Select
                value={currentMenu.icon}
                onChange={(value) => setCurrentMenu({ ...currentMenu, icon: value })}
                placeholder="选择菜单图标"
                allowClear
              >
                {iconOptions.map(option => (
                  <Select.Option key={option.value} value={option.value}>
                    <Space>
                      {option.icon}
                      <span>{option.label}</span>
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="菜单名称" required>
              <Input
                placeholder="请输入菜单名称"
                value={currentMenu.menuName}
                onChange={(e) =>
                  setCurrentMenu({ ...currentMenu, menuName: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="显示排序">
              <InputNumber
                placeholder="请输入显示排序"
                value={currentMenu.orderNum}
                onChange={(value) =>
                  setCurrentMenu({ ...currentMenu, orderNum: value || 0 })
                }
                style={{ width: '100%' }}
              />
            </Form.Item>
            {currentMenu.menuType !== 'F' && (
              <>
                <Form.Item label="路由地址">
                  <Input
                    placeholder="请输入路由地址"
                    value={currentMenu.path}
                    onChange={(e) =>
                      setCurrentMenu({ ...currentMenu, path: e.target.value })
                    }
                  />
                </Form.Item>
                <Form.Item label="组件路径">
                  <Input
                    placeholder="请输入组件路径"
                    value={currentMenu.component}
                    onChange={(e) =>
                      setCurrentMenu({ ...currentMenu, component: e.target.value })
                    }
                  />
                </Form.Item>
              </>
            )}
            <Form.Item label="权限标识">
              <Input
                placeholder="请输入权限标识"
                value={currentMenu.perms}
                onChange={(e) =>
                  setCurrentMenu({ ...currentMenu, perms: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="路由参数">
              <Input
                placeholder="请输入路由参数"
                value={currentMenu.query}
                onChange={(e) =>
                  setCurrentMenu({ ...currentMenu, query: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="是否外链">
              <Select
                value={currentMenu.isFrame}
                onChange={(value) =>
                  setCurrentMenu({ ...currentMenu, isFrame: value })
                }
                options={[
                  { label: "是", value: true },
                  { label: "否", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="是否缓存">
              <Select
                value={currentMenu.isCache}
                onChange={(value) =>
                  setCurrentMenu({ ...currentMenu, isCache: value })
                }
                options={[
                  { label: "缓存", value: true },
                  { label: "不缓存", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="显示状态">
              <Select
                value={currentMenu.visible}
                onChange={(value) =>
                  setCurrentMenu({ ...currentMenu, visible: value })
                }
                options={[
                  { label: "显示", value: true },
                  { label: "隐藏", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="菜单状态">
              <Select
                value={currentMenu.status}
                onChange={(value) =>
                  setCurrentMenu({ ...currentMenu, status: value })
                }
                options={[
                  { label: "正常", value: true },
                  { label: "停用", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="备注">
              <TextArea
                rows={3}
                placeholder="请输入内容"
                value={currentMenu.remark}
                onChange={(e) =>
                  setCurrentMenu({ ...currentMenu, remark: e.target.value })
                }
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
        <p>确定要删除菜单 "{currentMenu?.menuName}" 吗？</p>
      </Modal>
    </div>
  );
};

export default MenuManagement;
