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
} from "antd";
import {
  PlusOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import styles from "./index.module.scss";
import { createDepartment, getDepartmentList } from "@/api/department/department";
import { DepartmentInfo } from "@/api/department/department.type";

// 部门数据接口
interface DepartmentData {
  id: number;
  deptName: string;
  parentId: number;
  orderNum: number;
  leader?: string;
  phone?: string;
  email?: string;
  status: boolean;
  createTime: string;
  children?: DepartmentData[];
}

// 搜索参数接口
interface SearchParams {
  name?: string;
  status?: false;
  createTime?: string;
  startTime?: string;
  endTime?: string;
}

// 分页数据接口
interface PageData {
  page: number;
  pageSize: number;
  total: number;
}

const { Column } = Table;
const { RangePicker } = DatePicker;

// 模拟部门数据
const mockDepartmentData: DepartmentData[] = [
  {
    id: 1,
    deptName: "吉沃科技",
    parentId: 0,
    orderNum: 0,
    leader: "张三",
    phone: "15888888888",
    email: "admin@jivo.com",
    status: true,
    createTime: "2025-05-26 10:07:40",
    children: [
      {
        id: 2,
        deptName: "深圳公司",
        parentId: 1,
        orderNum: 1,
        leader: "李四",
        phone: "15888888889",
        email: "shenzhen@jivo.com",
        status: true,
        createTime: "2025-05-26 10:07:40",
        children: [
          {
            id: 3,
            deptName: "研发部门",
            parentId: 2,
            orderNum: 1,
            leader: "王五",
            phone: "15888888890",
            email: "dev@jivo.com",
            status: true,
            createTime: "2025-05-26 10:07:41",
          },
          {
            id: 4,
            deptName: "市场部门",
            parentId: 2,
            orderNum: 2,
            leader: "赵六",
            phone: "15888888891",
            email: "market@jivo.com",
            status: true,
            createTime: "2025-05-26 10:07:42",
          },
          {
            id: 5,
            deptName: "测试部门",
            parentId: 2,
            orderNum: 3,
            leader: "孙七",
            phone: "15888888892",
            email: "test@jivo.com",
            status: true,
            createTime: "2025-05-26 10:07:42",
          },
          {
            id: 6,
            deptName: "财务部门",
            parentId: 2,
            orderNum: 4,
            leader: "周八",
            phone: "15888888893",
            email: "finance@jivo.com",
            status: true,
            createTime: "2025-05-26 10:07:42",
          },
          {
            id: 7,
            deptName: "运维部门",
            parentId: 2,
            orderNum: 5,
            leader: "吴九",
            phone: "15888888894",
            email: "ops@jivo.com",
            status: true,
            createTime: "2025-05-26 10:07:43",
          }
        ]
      },
      {
        id: 8,
        deptName: "长沙公司",
        parentId: 1,
        orderNum: 2,
        leader: "陈十",
        phone: "15888888895",
        email: "changsha@jivo.com",
        status: true,
        createTime: "2025-05-26 10:07:41",
        children: [
          {
            id: 9,
            deptName: "市场部门",
            parentId: 8,
            orderNum: 1,
            leader: "刘十一",
            phone: "15888888896",
            email: "cs-market@jivo.com",
            status: true,
            createTime: "2025-05-26 10:07:43",
          },
          {
            id: 10,
            deptName: "财务部门",
            parentId: 8,
            orderNum: 2,
            leader: "张十二",
            phone: "15888888897",
            email: "cs-finance@jivo.com",
            status: true,
            createTime: "2025-05-26 10:07:43",
          }
        ]
      }
    ]
  }
];

// 为表格数据添加key和层级信息
const processTreeData = (data: DepartmentData[]): DepartmentData[] => {
  const processNode = (node: DepartmentData): DepartmentData => {
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

// 构建部门树选择器数据
interface TreeSelectNode {
  value: number;
  title: string;
  children?: TreeSelectNode[];
}

const buildTreeSelectData = (data: DepartmentData[]): TreeSelectNode[] => {
  return data.map(item => ({
    value: item.id,
    title: item.deptName,
    children: item.children && item.children.length > 0 ? buildTreeSelectData(item.children) : undefined
  }));
};

// 获取树形数据中的最大ID
// const getMaxId = (data: DepartmentData[]): number => {
//   let maxId = 0;
//   const traverse = (nodes: DepartmentData[]) => {
//     nodes.forEach(node => {
//       if (node.id > maxId) {
//         maxId = node.id;
//       }
//       if (node.children && node.children.length > 0) {
//         traverse(node.children);
//       }
//     });
//   };
//   traverse(data);
//   return maxId;
// };

// // 在树形数据中添加新节点
// const addNodeToTree = (data: DepartmentData[], newNode: DepartmentData, parentId: number): DepartmentData[] => {
//   if (parentId === 0) {
//     // 添加到根级
//     return [...data, newNode];
//   }
  
//   return data.map(node => {
//     if (node.id === parentId) {
//       // 找到父节点，添加到children中
//       return {
//         ...node,
//         children: node.children ? [...node.children, newNode] : [newNode]
//       };
//     } else if (node.children && node.children.length > 0) {
//       // 递归查找父节点
//       return {
//         ...node,
//         children: addNodeToTree(node.children, newNode, parentId)
//       };
//     }
//     return node;
//   });
// };

// 在树形数据中更新节点
const updateNodeInTree = (data: DepartmentData[], updatedNode: DepartmentData): DepartmentData[] => {
  return data.map(node => {
    if (node.id === updatedNode.id) {
      return { ...updatedNode, children: node.children };
    } else if (node.children && node.children.length > 0) {
      return {
        ...node,
        children: updateNodeInTree(node.children, updatedNode)
      };
    }
    return node;
  });
};

// 在树形数据中删除节点
const deleteNodeFromTree = (data: DepartmentData[], nodeId: number): DepartmentData[] => {
  return data.filter(node => {
    if (node.id === nodeId) {
      return false; // 删除该节点
    }
    if (node.children && node.children.length > 0) {
      node.children = deleteNodeFromTree(node.children, nodeId);
    }
    return true;
  });
};

const DepartmentManagement = () => {
  // 部门数据
  const [departmentData, setDepartmentData] = useState<DepartmentInfo[]>([]);
  const [processedData, setProcessedData] = useState<DepartmentData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    name: "",
    status: undefined,
    startTime: "",
    endTime: "",
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const [expandedRowKeys, setExpandedRowKeys] = useState<React.Key[]>([]);

  // 模态框状态
  const [currentDept, setCurrentDept] = useState<DepartmentData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 新增部门数据
  const [newDept, setNewDept] = useState({
    name: "",
    parentId: 0,
    orderNum: 0,
    status: true,
    level: 1,
  });

  // 获取部门数据
  const getDepartmentData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
    
      const res = await getDepartmentList({
        page: pageData.page,
        pageSize: pageData.pageSize,
        ...searchParams,
      });
      if (res.code === 200) {
        console.log("data", res.data);
        setDepartmentData(res.data.list);
        setPageData({
          page: res.data.page,
          pageSize: res.data.pageSize,
          total: res.data.total,
        });
      }
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取部门数据失败:", e);
      message.error("获取部门数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理展开/收起
  const handleExpand = (expanded: boolean, record: DepartmentData) => {
    const key = record.id.toString();
    if (expanded) {
      setExpandedRowKeys(prev => [...prev, key]);
    } else {
      setExpandedRowKeys(prev => prev.filter(k => k !== key));
    }
  };

  // 展开/收起所有
  const handleExpandAll = () => {
    const getAllKeys = (data: DepartmentData[]): string[] => {
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
      const allKeys = getAllKeys(mockDepartmentData);
      setExpandedRowKeys(allKeys);
    }
  };

  // 处理编辑按钮点击
  const handleEdit = (record: DepartmentData) => {
    setCurrentDept(record);
    setIsEditModalVisible(true);
    console.log("编辑部门:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: DepartmentData) => {
    setCurrentDept(record);
    setIsDeleteModalVisible(true);
    console.log("删除部门:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentDept?.id) {
      try {
        // 检查是否有子部门
        const hasChildren = (data: DepartmentData[], nodeId: number): boolean => {
          for (const node of data) {
            if (node.id === nodeId && node.children && node.children.length > 0) {
              return true;
            }
            if (node.children && node.children.length > 0) {
              if (hasChildren(node.children, nodeId)) {
                return true;
              }
            }
          }
          return false;
        };

        if (hasChildren(departmentData, currentDept.id)) {
          message.error("该部门下还有子部门，无法删除");
          setIsDeleteModalVisible(false);
          return;
        }

        // 从本地数据中删除部门
        const updatedData = deleteNodeFromTree(departmentData, currentDept.id);
        setDepartmentData(updatedData);
        
        // 更新处理后的数据用于表格显示
        const processedTreeData = processTreeData(updatedData);
        setProcessedData(processedTreeData);
        
        console.log("删除部门 ID:", currentDept.id);
        message.success("删除成功");
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
      // 验证必填字段
      if (!newDept.name) {
        message.error("部门名称不能为空");
        return;
      }
      const response = await createDepartment({
        name: newDept.name,
        parentId: newDept.parentId ? newDept.parentId : undefined,
        order: newDept.orderNum,
        lelvel: newDept.level,
        status: newDept.status,
      });
      if (response.code === 200) {
        message.success("新增成功");
      } else {
        message.error("新增失败");
      }

      message.success("新增成功");
      setIsAddModalVisible(false);
      
      // 重置表单
      setNewDept({
        name: "",
        parentId: 0,
        orderNum: 0,
        level: 1,
        status: true,
      });
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      if (!currentDept) return;
      
      // 验证必填字段
      if (!currentDept.deptName) {
        message.error("部门名称不能为空");
        return;
      }

      // 更新本地数据
      const updatedData = updateNodeInTree(departmentData, currentDept);
      setDepartmentData(updatedData);
      
      // 更新处理后的数据用于表格显示
      const processedTreeData = processTreeData(updatedData);
      setProcessedData(processedTreeData);
      
      console.log("保存部门信息:", currentDept);
      message.success("保存成功");
      setIsEditModalVisible(false);
    } catch (e) {
      console.log("保存失败:", e);
      message.error("保存失败");
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      deptName: "",
      status: "",
      createTime: null,
    });
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      // 在树形数据中更新状态
      const updateStatus = (data: DepartmentData[]): DepartmentData[] => {
        return data.map(node => {
          if (node.id === id) {
            return { ...node, status };
          } else if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: updateStatus(node.children)
            };
          }
          return node;
        });
      };

      const updatedData = updateStatus(departmentData);
      setDepartmentData(updatedData);
      
      // 更新处理后的数据用于表格显示
      const processedTreeData = processTreeData(updatedData);
      setProcessedData(processedTreeData);
      
      console.log(`切换部门 ${id} 状态为:`, status);
      message.success("状态更新成功");
    } catch (e) {
      console.log("状态更新失败:", e);
      message.error("状态更新失败");
    }
  };

  useEffect(() => {
    getDepartmentData();
  }, [getDepartmentData]);

  return (
    <div className={styles.departmentManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="部门名称" name="deptName">
          <Input
            placeholder="请输入部门名称"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                name: e.target.value,
              });
            }}
            value={searchParams?.name}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            placeholder="部门状态"
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
                startTime: dates ? dateStrings[0] : undefined,
                endTime: dates ? dateStrings[1] : undefined
              });
            }}
            placeholder={["开始日期", "结束日期"]}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              getDepartmentData();
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
      <TableComponent<DepartmentInfo>
        data={departmentData}
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
          title="部门名称" 
          dataIndex="name" 
          key="name"
          width={300}
        />
        <Column 
          title="排序" 
          dataIndex="order" 
          key="order" 
          width={80}
        />
        <Column
          title="状态"
          key="status"
          width={100}
          render={(_, record: DepartmentData) => (
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
          dataIndex="createdAt" 
          key="createdAt"
          width={180}
        />
        <Column
          title="操作"
          key="action"
          width={180}
          render={(_, record: DepartmentData) => (
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
                  setNewDept({ ...newDept, parentId: record.id });
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

      {/* 新增部门模态框 */}
      <Modal
        title="添加部门"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="上级部门">
            <TreeSelect
              value={newDept.parentId === 0 ? undefined : newDept.parentId}
              onChange={(value) => setNewDept({ ...newDept, parentId: value || 0 })}
              treeData={[
                { value: 0, title: "主类目" },
                departmentData.map(el => {
                  return {
                    value: el.parentId,
                    title: el.name
                  }
                })
              ]}
              placeholder="选择上级部门"
              allowClear
            />
          </Form.Item>
          <Form.Item label="部门名称" required>
            <Input
              placeholder="请输入部门名称"
              value={newDept.name}
              onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="显示排序">
            <Input
              type="number"
              placeholder="请输入显示排序"
              value={newDept.orderNum}
              onChange={(e) => setNewDept({ ...newDept, orderNum: Number(e.target.value) })}
            />
          </Form.Item>
          <Form.Item label="部门状态">
            <Select
              value={newDept.status}
              onChange={(value) => setNewDept({ ...newDept, status: value })}
              options={[
                { label: "正常", value: true },
                { label: "停用", value: false },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑部门模态框 */}
      <Modal
        title="修改部门"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={600}
      >
        {currentDept && (
          <Form layout="vertical">
            <Form.Item label="上级部门">
              <TreeSelect
                value={currentDept.parentId === 0 ? undefined : currentDept.parentId}
                onChange={(value) => setCurrentDept({ ...currentDept, parentId: value || 0 })}
                treeData={[
                  { value: 0, title: "主类目" },
                  ...buildTreeSelectData(departmentData)
                ]}
                placeholder="选择上级部门"
                allowClear
              />
            </Form.Item>
            <Form.Item label="部门名称" required>
              <Input
                placeholder="请输入部门名称"
                value={currentDept.deptName}
                onChange={(e) =>
                  setCurrentDept({ ...currentDept, deptName: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="显示排序">
              <Input
                type="number"
                placeholder="请输入显示排序"
                value={currentDept.orderNum}
                onChange={(e) =>
                  setCurrentDept({ ...currentDept, orderNum: Number(e.target.value) })
                }
              />
            </Form.Item>
            <Form.Item label="负责人">
              <Input
                placeholder="请输入负责人"
                value={currentDept.leader}
                onChange={(e) =>
                  setCurrentDept({ ...currentDept, leader: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="联系电话">
              <Input
                placeholder="请输入联系电话"
                value={currentDept.phone}
                onChange={(e) =>
                  setCurrentDept({ ...currentDept, phone: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="邮箱">
              <Input
                placeholder="请输入邮箱"
                value={currentDept.email}
                onChange={(e) =>
                  setCurrentDept({ ...currentDept, email: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="部门状态">
              <Select
                value={currentDept.status}
                onChange={(value) =>
                  setCurrentDept({ ...currentDept, status: value })
                }
                options={[
                  { label: "正常", value: true },
                  { label: "停用", value: false },
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
        <p>确定要删除部门 "{currentDept?.deptName}" 吗？</p>
      </Modal>
    </div>
  );
};

export default DepartmentManagement;
