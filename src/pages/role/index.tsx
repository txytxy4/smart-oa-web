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
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import styles from "./index.module.scss";

// 角色数据接口
interface RoleData {
  id: number;
  roleName: string;
  roleCode: string;
  displayOrder: number;
  status: boolean;
  createTime: string;
  remark?: string;
}

// 搜索参数接口
interface SearchParams {
  roleName?: string;
  roleCode?: string;
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

// 模拟角色数据
const mockRoleData: RoleData[] = [
  {
    id: 1,
    roleName: "超级管理员",
    roleCode: "admin",
    displayOrder: 1,
    status: true,
    createTime: "2025-05-26 10:07:54",
    remark: "系统超级管理员，拥有所有权限",
  },
  {
    id: 2,
    roleName: "普通角色",
    roleCode: "common",
    displayOrder: 2,
    status: true,
    createTime: "2025-05-26 10:07:54",
    remark: "普通用户角色，基础权限",
  },
];

const RoleManagement = () => {
  // 角色数据
  const [roleData, setRoleData] = useState<RoleData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    roleName: "",
    roleCode: "",
    status: "",
    createTime: null,
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框状态
  const [currentRole, setCurrentRole] = useState<RoleData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 新增角色数据
  const [newRole, setNewRole] = useState({
    roleName: "",
    roleCode: "",
    displayOrder: 1,
    status: true,
    remark: "",
  });

  // 获取角色数据
  const getRoleData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 这里使用模拟数据
      setRoleData(mockRoleData);
      setPageData(prev => ({ ...prev, total: mockRoleData.length }));
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取角色数据失败:", e);
      message.error("获取角色数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理编辑按钮点击
  const handleEdit = (record: RoleData) => {
    setCurrentRole(record);
    setIsEditModalVisible(true);
    console.log("编辑角色:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: RoleData) => {
    setCurrentRole(record);
    setIsDeleteModalVisible(true);
    console.log("删除角色:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentRole?.id) {
      try {
        // 这里调用删除API
        console.log("删除角色 ID:", currentRole.id);
        message.success("删除成功");
        // 重新获取数据
        getRoleData();
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
      console.log("新增角色:", newRole);
      message.success("新增成功");
      setIsAddModalVisible(false);
      // 重置表单
      setNewRole({
        roleName: "",
        roleCode: "",
        displayOrder: 1,
        status: true,
        remark: "",
      });
      // 重新获取数据
      getRoleData();
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      console.log("保存角色信息:", currentRole);
      message.success("保存成功");
      setIsEditModalVisible(false);
      // 重新获取数据
      getRoleData();
    } catch (e) {
      console.log("保存失败:", e);
      message.error("保存失败");
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      roleName: "",
      roleCode: "",
      status: "",
      createTime: null,
    });
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      console.log(`切换角色 ${id} 状态为:`, status);
      // 更新本地数据
      setRoleData(prev => 
        prev.map(role => 
          role.id === id ? { ...role, status } : role
        )
      );
      message.success("状态更新成功");
    } catch (e) {
      console.log("状态更新失败:", e);
      message.error("状态更新失败");
    }
  };

  useEffect(() => {
    getRoleData();
  }, [getRoleData]);

  return (
    <div className={styles.roleManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="角色名称" name="roleName">
          <Input
            placeholder="请输入角色名称"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                roleName: e.target.value,
              });
            }}
            value={searchParams?.roleName}
          />
        </Form.Item>
        <Form.Item label="权限字符" name="roleCode">
          <Input
            placeholder="请输入权限字符"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                roleCode: e.target.value,
              });
            }}
            value={searchParams?.roleCode}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            placeholder="角色状态"
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
              getRoleData();
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
      <TableComponent<RoleData>
        data={roleData}
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
          title="角色编号" 
          dataIndex="id" 
          key="id" 
          width={100}
        />
        <Column 
          title="角色名称" 
          dataIndex="roleName" 
          key="roleName" 
        />
        <Column 
          title="权限字符" 
          dataIndex="roleCode" 
          key="roleCode"
          render={(text) => <Tag color="blue">{text}</Tag>}
        />
        <Column 
          title="显示顺序" 
          dataIndex="displayOrder" 
          key="displayOrder" 
          width={100}
        />
        <Column
          title="状态"
          key="status"
          width={100}
          render={(_, record: RoleData) => (
            <Switch
              checked={record.status}
              onChange={(checked) => handleStatusChange(record.id, checked)}
              checkedChildren="启用"
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
          width={150}
          render={(_, record: RoleData) => (
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

      {/* 新增角色模态框 */}
      <Modal
        title="添加角色"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="角色名称" required>
            <Input
              placeholder="请输入角色名称"
              value={newRole.roleName}
              onChange={(e) => setNewRole({ ...newRole, roleName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="权限字符" required>
            <Input
              placeholder="请输入权限字符"
              value={newRole.roleCode}
              onChange={(e) => setNewRole({ ...newRole, roleCode: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="显示顺序">
            <Input
              type="number"
              placeholder="请输入显示顺序"
              value={newRole.displayOrder}
              onChange={(e) => setNewRole({ ...newRole, displayOrder: Number(e.target.value) })}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={newRole.status}
              onChange={(value) => setNewRole({ ...newRole, status: value })}
              options={[
                { label: "正常", value: true },
                { label: "停用", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea
              placeholder="请输入备注"
              value={newRole.remark}
              onChange={(e) => setNewRole({ ...newRole, remark: e.target.value })}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑角色模态框 */}
      <Modal
        title="修改角色"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={600}
      >
        {currentRole && (
          <Form layout="vertical">
            <Form.Item label="角色名称" required>
              <Input
                placeholder="请输入角色名称"
                value={currentRole.roleName}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, roleName: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="权限字符" required>
              <Input
                placeholder="请输入权限字符"
                value={currentRole.roleCode}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, roleCode: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="显示顺序">
              <Input
                type="number"
                placeholder="请输入显示顺序"
                value={currentRole.displayOrder}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, displayOrder: Number(e.target.value) })
                }
              />
            </Form.Item>
            <Form.Item label="状态">
              <Select
                value={currentRole.status}
                onChange={(value) =>
                  setCurrentRole({ ...currentRole, status: value })
                }
                options={[
                  { label: "正常", value: true },
                  { label: "停用", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="备注">
              <Input.TextArea
                placeholder="请输入备注"
                value={currentRole.remark}
                onChange={(e) =>
                  setCurrentRole({ ...currentRole, remark: e.target.value })
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
        <p>确定要删除角色 "{currentRole?.roleName}" 吗？</p>
      </Modal>
    </div>
  );
};

export default RoleManagement;
