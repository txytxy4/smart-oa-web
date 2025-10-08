import React, { useState, useEffect, useCallback } from "react";
import {
  Form,
  Button,
  Input,
  Table,
  Select,
  message,
  Space,
  Modal,
  Avatar,
  Upload,
  Checkbox,
  Card,
} from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import {
  InboxOutlined,
  FileExcelOutlined,
  DownloadOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import ResizableSplitPane from "@/components/ResizableSplitPane";
import DepartmentTree from "@/components/DepartmentTree";
import { getUserList, register, deleteUser, updateUserInfo } from "@/api/user/user";
import styles from "./index.module.scss";
import { exportToExcel } from "@/hooks/exportToExcel";

interface UserData {
  id?: number;
  username?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  avatarUrl?: string;
}

interface SearchParams {
  username?: string;
  phone?: string;
  role?: string;
  nickname?: string;
  email?: string;
}

interface PageData {
  page: number;
  pageSize: number;
  total?: number;
}

const { Column } = Table;

const UserList = () => {
  // 用户数据
  const [userData, setUserData] = useState<UserData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    username: "",
    phone: "",
    role: "",
    nickname: "",
    email: "",
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  // 当前选中的用户数据
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  // 控制编辑模态框显示
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  // 控制删除确认框显示
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  // 控制新增模态框显示
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  // 新增用户数据
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  // 导入模态框
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  // 导入相关状态
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  // 选中的部门
  const [selectedDepartment, setSelectedDepartment] = useState<string>('深圳科技有限公司');

  //获取用户数据
  const getUserData = useCallback(async () => {
    try {
      //获取数据
      const data = {
        page: pageData.page,
        pageSize: pageData.pageSize,
        ...searchParams,
      };
      const res = await getUserList(data);
      if (res.code === 200) {
        console.log("data", res.data);
        setUserData(res.data.list);
        setPageData(prev => ({ ...prev, total: res.data.pagination.total }));
      } else {
        message.error(res.message);
      }
    } catch (e) {
      console.log(e);
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理编辑按钮点击
  const handleEdit = (record: UserData) => {
    setCurrentUser(record);
    setIsEditModalVisible(true);
    console.log("编辑用户:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: UserData) => {
    setCurrentUser(record);
    setIsDeleteModalVisible(true);
    console.log("删除用户:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentUser?.id) {
      try {
        // 这里调用删除API
        const res = await deleteUser(currentUser.id);
        if (res.code === 200) {
        message.success("删除成功");
          getUserData();
        } else {
          message.error(res.message);
        }
      } catch (error: unknown) {
        console.error(error);
        message.error("删除失败");
      }
    }
    setIsDeleteModalVisible(false);
  };

  const handleAdd = async () => {
    try {
      // 新增用户逻辑
      console.log("新增用户");
      const data = {
        ...newUser,
      }
      const res = await register(data);
      if (res.code === 200) {
        message.success("新增成功");
      } else {
        message.error(res.message);
      }
      setIsAddModalVisible(false);
      setNewUser({
        username: "",
        password: "",
        email: "",
      });
      getUserData();
    } catch (e) {
      console.log("error", e);
    }
  };

  const handleUpdate = async () => {
    try {
      const data = {
        ...currentUser,
      }
      const res = await updateUserInfo(data);
      if (res.code === 200) {
        message.success("更新成功");
        setIsEditModalVisible(false);
        getUserData();
      } else {
        message.error(res.message);
      }
    } catch (e) {
      console.log("error", e);
    }
  }

  // 处理文件选择
  const handleFileChange = (info: UploadChangeParam) => {
    const { fileList } = info;
    if (fileList.length > 0 && fileList[0].originFileObj) {
      setSelectedFile(fileList[0].originFileObj);
    }
  };

  // 处理导入
  const handleImport = async () => {
    if (!selectedFile) {
      message.error("请先选择要导入的文件");
      return;
    }
    
    try {
      // 这里添加文件上传逻辑
      console.log("导入文件:", selectedFile.name);
      console.log("更新已存在数据:", updateExisting);
      message.success("导入成功");
      setIsImportModalVisible(false);
      setSelectedFile(null);
      setUpdateExisting(false);
      // 重新获取用户数据
      getUserData();
    } catch (error) {
      console.error("导入失败:", error);
      message.error("导入失败");
    }
  };

  // 下载模板
  const downloadTemplate = () => {
    // 这里添加下载模板逻辑
    console.log("下载模板");
    message.info("模板下载功能待实现");
    // 下载文件
    const a = document.createElement("a");
    // a.href = "/template/user_template.xlsx";
    a.href = "http://localhost:3001/uploads/templates/用户模板.xlsx";
    a.download = "用户模板.xlsx";
    document.body.appendChild(a)
    a.click();
    a.remove();
  };

  // 导出
  const handleExport = (data: UserData[]) => {
    try {
      console.log('data', data);
      
      exportToExcel(data);
    } catch (e) {
      console.log("error", e);
    }
  }

  // 处理部门选择
  const handleDepartmentSelect = (selectedKeys: React.Key[], departmentName?: string) => {
    console.log('选中的部门:', selectedKeys, departmentName);
    if (departmentName) {
      setSelectedDepartment(departmentName);
      // 这里可以根据选中的部门过滤用户数据
      // 重新获取该部门的用户数据
      getUserData();
    }
  };



  useEffect(() => {
    getUserData();
  }, [getUserData]);

  // 左侧部门树面板
  const leftPanel = (
    <DepartmentTree onSelect={handleDepartmentSelect} />
  );

  // 右侧用户列表面板
  const rightPanel = (
    <Card 
      title={`用户管理 - ${selectedDepartment}`}
      size="small"
      style={{ height: '100%', border: 'none' }}
      bodyStyle={{ height: 'calc(100% - 57px)', overflow: 'auto' }}
    >
      <Form layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="用户名" name="username">
          <Input
            style={{ width: 200 }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchParams({
                ...searchParams,
                username: e.target.value,
              });
            }}
            value={searchParams?.username}
          />
        </Form.Item>
        <Form.Item label="手机号" name="phone">
          <Input
            style={{ width: 200 }}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchParams({
                ...searchParams,
                phone: e.target.value,
              });
            }}
            value={searchParams?.phone}
          />
        </Form.Item>
        <Form.Item label="角色" name="role">
          <Select
            style={{ width: 200 }}
            options={[
              { label: "管理员", value: "admin" },
              { label: "用户", value: "user" },
            ]}
            onChange={(value) => {
              setSearchParams({
                ...searchParams,
                role: value,
              });
            }}
            value={searchParams?.role}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              getUserData();
            }}
            style={{ marginRight: 20 }}
          >
            搜索
          </Button>
          <Button
            onClick={() => {
              setSearchParams({
                username: "",
                phone: "",
                role: "",
              });
            }}
          >
            重置
          </Button>
        </Form.Item>
      </Form>
      
      <TableComponent<UserData>
        data={userData}
        toolbarRender={(_, selectedRows) => (
          <div className={styles.tableHeader} style={{width: '100%', textAlign: 'left', marginTop: '20px'}}>
            <Button type="primary" onClick={() => setIsAddModalVisible(true)}>
              + 新增
            </Button>
            <Button onClick={() => handleEdit(selectedRows[0])} disabled={selectedRows.length !== 1}>编辑</Button>
            <Button onClick={() => handleDelete(selectedRows[0])} disabled={selectedRows.length !== 1}>删除</Button>
            <Button onClick={() => handleExport(selectedRows)} disabled={selectedRows.length !== 0}>导出</Button>
            <Button onClick={() => setIsImportModalVisible(true)}>导入</Button>
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
        <Column title="用户名" dataIndex="username" key="username" />
        <Column
          title="头像"
          key="avatarUrl"
          render={(_, record: UserData) =>
            record.avatarUrl && (
              <Avatar src={`http://${record.avatarUrl}`} size={40} />
            )
          }
        />
        <Column title="昵称" dataIndex="nickname" key="nickname" />
        <Column title="手机号" dataIndex="phone" key="phone" />
        <Column title="角色" dataIndex="role" key="role" />
        <Column
          title="操作"
          key="action"
          render={(_, record: UserData) => (
            <Space>
              <Button type="link" onClick={() => handleEdit(record)}>
                编辑
              </Button>
              <Button type="link" danger onClick={() => handleDelete(record)}>
                删除
              </Button>
            </Space>
          )}
        />
      </TableComponent>
    </Card>
  );

  return (
    <div style={{ height: 'calc(100vh - 120px)' }}>
      <ResizableSplitPane
        left={leftPanel}
        right={rightPanel}
        initialLeftWidth={280}
        minLeft={200}
        minRight={600}
        storageKey="user-list-layout"
        style={{ 
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          border: '1px solid #f0f0f0'
        }}
      />

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户星信息"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => {
          // 处理保存逻辑
          console.log("保存用户信息:", currentUser);
          setIsEditModalVisible(false);
          handleUpdate();
        }}
      >
        {currentUser && (
          <Form layout="vertical">
            <Form.Item label="昵称">
              <Input
                value={currentUser.nickname}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, nickname: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="手机号">
              <Input
                value={currentUser.phone}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, phone: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="角色">
              <Select
                value={currentUser.role}
                onChange={(value) =>
                  setCurrentUser({ ...currentUser, role: value })
                }
                options={[
                  { label: "管理员", value: "admin" },
                  { label: "用户", value: "user" },
                ]}
              />
            </Form.Item>
            <Form.Item label="邮箱">
              <Input
                value={currentUser?.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="地址">
              <Input
                value={currentUser?.address}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, address: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="头像">
              <Input
                value={currentUser?.avatarUrl}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, avatarUrl: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="角色">
              <Select
                value={currentUser?.role}
                onChange={(value) =>
                  setCurrentUser({ ...currentUser, role: value })
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
        <p>确定要删除用户 {currentUser?.username} 吗？</p>
      </Modal>

      {/* 新增用户模态框 */}
      <Modal
        title="新增用户"
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          setNewUser({
            username: "",
            password: "",
            email: "",
          });
        }}
        onOk={handleAdd}
      >
        <Form layout="vertical">
          <Form.Item label="用户名">
            <Input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
          </Form.Item>
          <Form.Item label="密码">
            <Input.Password value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
          </Form.Item>
          <Form.Item label="邮箱">
            <Input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 用户导入模态框 */}
      <Modal
        title="用户导入"
        open={isImportModalVisible}
        onCancel={() => setIsImportModalVisible(false)}
        onOk={handleImport}
        width={600}
        okText="确定"
        cancelText="取消"
      >
        <div style={{ padding: '20px 0' }}>
          <Upload.Dragger
            accept=".xls,.xlsx"
            maxCount={1}
            beforeUpload={() => false} // 阻止自动上传
            onChange={handleFileChange}
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">将文件拖到此处，或<span style={{ color: '#1890ff' }}>点击上传</span></p>
            <p className="ant-upload-hint">
              仅允许导入xls、xlsx格式文件。
            </p>
                      </Upload.Dragger>
          
          {/* 已选择的文件显示 */}
          {selectedFile && (
            <div style={{ marginTop: 16, padding: 12, border: '1px solid #d9d9d9', borderRadius: 6, backgroundColor: '#fafafa' }}>
              <FileExcelOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              {selectedFile.name}
            </div>
          )}
          
          {/* 选项和下载模板 */}
          <div style={{ marginTop: 16 }}>
            <Checkbox 
              checked={updateExisting} 
              onChange={(e) => setUpdateExisting(e.target.checked)}
            >
              是否更新已经存在的用户数据
            </Checkbox>
            
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#666' }}>仅允许导入xls、xlsx格式文件。</span>
              <Button 
                type="link" 
                icon={<DownloadOutlined />}
                onClick={downloadTemplate}
              >
                下载模板
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserList;
