import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Input, Table, Select, message, Space, Modal, Avatar } from "antd";
import TableComponent from "@/components/Table";
import { getUserList } from "@/api/user/user";

interface UserData {
  id?: number;
  username?: string;
  nikcname?: string;
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
        setPageData({ ...pageData, total: res.data.pagination.total });
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
    console.log('编辑用户:', record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: UserData) => {
    setCurrentUser(record);
    setIsDeleteModalVisible(true);
    console.log('删除用户:', record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentUser?.id) {
      try {
        // 这里调用删除API
        // const res = await deleteUser(currentUser.id);
        message.success('删除成功');
        // 重新获取数据
        getUserData();
      } catch (error: unknown) {
        console.error(error);
        message.error('删除失败');
      }
    }
    setIsDeleteModalVisible(false);
  };

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <div>
      <Form layout="inline">
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
            style={{marginRight: 20}}
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
      <TableComponent<UserData> data={userData}>
        <Column title="用户名" dataIndex="username" key="username" />
        <Column title="头像" key="avatarUrl" render={(_, record) => (
            record.avatarUrl && <Avatar src={`http://${record.avatarUrl}`} size={40} />
        )} />
        <Column title="昵称" dataIndex="nickname" key="nickname" />
        <Column title="手机号" dataIndex="phone" key="phone" />
        <Column title="角色" dataIndex="role" key="role" />
        <Column title="操作" key="action" render={(_, record) => (
          <Space>
            <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
            <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
          </Space>
        )} />
      </TableComponent>

      {/* 编辑用户模态框 */}
      <Modal
        title="编辑用户"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={() => {
          // 处理保存逻辑
          console.log('保存用户信息:', currentUser);
          setIsEditModalVisible(false);
        }}
      >
        {currentUser && (
          <Form layout="vertical">
            <Form.Item label="用户名">
              <Input 
                value={currentUser.username} 
                onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
              />
            </Form.Item>
            <Form.Item label="手机号">
              <Input 
                value={currentUser.phone} 
                onChange={(e) => setCurrentUser({...currentUser, phone: e.target.value})}
              />
            </Form.Item>
            <Form.Item label="角色">
              <Select
                value={currentUser.role}
                onChange={(value) => setCurrentUser({...currentUser, role: value})}
                options={[
                  { label: "管理员", value: "admin" },
                  { label: "用户", value: "user" },
                ]}
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
    </div>
  );
};

export default UserList;
