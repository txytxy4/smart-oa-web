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
import { exportToExcel } from "@/hooks/exportToExcel";
import styles from "./index.module.scss";

// 岗位数据接口
interface PositionData {
  id: number;
  postId: string;
  postName: string;
  postSort: number;
  status: boolean;
  createTime: string;
  remark?: string;
}

// 搜索参数接口
interface SearchParams {
  postId?: string;
  postName?: string;
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

// 模拟岗位数据
const mockPositionData: PositionData[] = [
  {
    id: 1,
    postId: "ceo",
    postName: "董事长",
    postSort: 1,
    status: true,
    createTime: "2025-05-26 10:07:50",
    remark: "公司最高管理岗位",
  },
  {
    id: 2,
    postId: "se",
    postName: "项目经理",
    postSort: 2,
    status: true,
    createTime: "2025-05-26 10:07:50",
    remark: "负责项目管理和协调",
  },
  {
    id: 3,
    postId: "hr",
    postName: "人力资源",
    postSort: 3,
    status: true,
    createTime: "2025-05-26 10:07:50",
    remark: "负责人力资源管理",
  },
  {
    id: 4,
    postId: "user",
    postName: "普通员工",
    postSort: 4,
    status: true,
    createTime: "2025-05-26 10:07:51",
    remark: "一般员工岗位",
  },
];

const PositionManagement = () => {
  // 岗位数据
  const [positionData, setPositionData] = useState<PositionData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    postId: "",
    postName: "",
    status: "",
    createTime: null,
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框状态
  const [currentPosition, setCurrentPosition] = useState<PositionData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 新增岗位数据
  const [newPosition, setNewPosition] = useState({
    postId: "",
    postName: "",
    postSort: 0,
    status: true,
    remark: "",
  });

  // 获取岗位数据
  const getPositionData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 如果positionData为空，才使用mockPositionData初始化
      if (positionData.length === 0) {
        setPositionData(mockPositionData);
        setPageData(prev => ({ ...prev, total: mockPositionData.length }));
      }
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取岗位数据失败:", e);
      message.error("获取岗位数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams, positionData.length]);

  // 处理编辑按钮点击
  const handleEdit = (record: PositionData) => {
    setCurrentPosition(record);
    setIsEditModalVisible(true);
    console.log("编辑岗位:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: PositionData) => {
    setCurrentPosition(record);
    setIsDeleteModalVisible(true);
    console.log("删除岗位:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentPosition?.id) {
      try {
        // 从本地数据中过滤掉要删除的岗位
        const filteredPositionData = positionData.filter(position => position.id !== currentPosition.id);
        setPositionData(filteredPositionData);
        setPageData(prev => ({ ...prev, total: prev.total - 1 }));
        
        console.log("删除岗位 ID:", currentPosition.id);
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
      if (!newPosition.postId || !newPosition.postName) {
        message.error("岗位编码和岗位名称不能为空");
        return;
      }

      // 检查岗位编码是否重复
      const isDuplicate = positionData.some(pos => pos.postId === newPosition.postId);
      if (isDuplicate) {
        message.error("岗位编码已存在，请使用其他编码");
        return;
      }

      // 创建新岗位对象
      const newPositionWithId: PositionData = {
        ...newPosition,
        id: Math.max(...positionData.map(p => p.id), 0) + 1,
        createTime: new Date().toLocaleString(),
      };

      // 更新本地数据
      setPositionData([...positionData, newPositionWithId]);
      setPageData(prev => ({ ...prev, total: prev.total + 1 }));
      
      console.log("新增岗位:", newPositionWithId);
      message.success("新增成功");
      setIsAddModalVisible(false);
      
      // 重置表单
      setNewPosition({
        postId: "",
        postName: "",
        postSort: 0,
        status: true,
        remark: "",
      });
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      if (!currentPosition) return;
      
      // 验证必填字段
      if (!currentPosition.postId || !currentPosition.postName) {
        message.error("岗位编码和岗位名称不能为空");
        return;
      }

      // 检查岗位编码是否重复（排除当前编辑的岗位）
      const isDuplicate = positionData.some(pos => 
        pos.postId === currentPosition.postId && pos.id !== currentPosition.id
      );
      if (isDuplicate) {
        message.error("岗位编码已存在，请使用其他编码");
        return;
      }

      // 直接更新本地数据
      const updatedPositionData = positionData.map(position => 
        position.id === currentPosition.id ? currentPosition : position
      );
      
      setPositionData(updatedPositionData);
      console.log("保存岗位信息:", currentPosition);
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
      postId: "",
      postName: "",
      status: "",
      createTime: null,
    });
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      console.log(`切换岗位 ${id} 状态为:`, status);
      // 更新本地数据
      setPositionData(prev => 
        prev.map(position => 
          position.id === id ? { ...position, status } : position
        )
      );
      message.success("状态更新成功");
    } catch (e) {
      console.log("状态更新失败:", e);
      message.error("状态更新失败");
    }
  };

  // 处理导出功能
  const handleExport = (selectedRows: PositionData[]) => {
    try {
      const dataToExport = selectedRows.length > 0 ? selectedRows : positionData;
      
      if (dataToExport.length === 0) {
        message.warning("没有数据可以导出");
        return;
      }

      // 格式化导出数据
      const exportData = dataToExport.map(item => ({
        "岗位编号": item.id,
        "岗位编码": item.postId,
        "岗位名称": item.postName,
        "岗位排序": item.postSort,
        "状态": item.status ? "正常" : "停用",
        "创建时间": item.createTime,
        "备注": item.remark || "",
      }));

      const fileName = selectedRows.length > 0 
        ? `岗位管理-选中数据-${new Date().toLocaleDateString()}.xlsx`
        : `岗位管理-全部数据-${new Date().toLocaleDateString()}.xlsx`;
      
      exportToExcel(exportData, fileName);
      message.success(`成功导出 ${dataToExport.length} 条数据`);
      
      console.log("导出数据:", dataToExport);
    } catch (e) {
      console.log("导出失败:", e);
      message.error("导出失败");
    }
  };

  useEffect(() => {
    getPositionData();
  }, [getPositionData]);

  return (
    <div className={styles.positionManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="岗位编码" name="postId">
          <Input
            placeholder="请输入岗位编码"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                postId: e.target.value,
              });
            }}
            value={searchParams?.postId}
          />
        </Form.Item>
        <Form.Item label="岗位名称" name="postName">
          <Input
            placeholder="请输入岗位名称"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                postName: e.target.value,
              });
            }}
            value={searchParams?.postName}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            placeholder="岗位状态"
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
              getPositionData();
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
      <TableComponent<PositionData>
        data={positionData}
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
              onClick={() => handleExport(selectedRows)}
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
          title="岗位编号" 
          dataIndex="id" 
          key="id" 
          width={100}
        />
        <Column 
          title="岗位编码" 
          dataIndex="postId" 
          key="postId"
          render={(text) => <Tag color="blue">{text}</Tag>}
        />
        <Column 
          title="岗位名称" 
          dataIndex="postName" 
          key="postName" 
        />
        <Column 
          title="岗位排序" 
          dataIndex="postSort" 
          key="postSort" 
          width={100}
        />
        <Column
          title="状态"
          key="status"
          width={100}
          render={(_, record: PositionData) => (
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
          width={150}
          render={(_, record: PositionData) => (
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

      {/* 新增岗位模态框 */}
      <Modal
        title="添加岗位"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="岗位编码" required>
            <Input
              placeholder="请输入岗位编码"
              value={newPosition.postId}
              onChange={(e) => setNewPosition({ ...newPosition, postId: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="岗位名称" required>
            <Input
              placeholder="请输入岗位名称"
              value={newPosition.postName}
              onChange={(e) => setNewPosition({ ...newPosition, postName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="岗位排序">
            <Input
              type="number"
              placeholder="请输入岗位排序"
              value={newPosition.postSort}
              onChange={(e) => setNewPosition({ ...newPosition, postSort: Number(e.target.value) })}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={newPosition.status}
              onChange={(value) => setNewPosition({ ...newPosition, status: value })}
              options={[
                { label: "正常", value: true },
                { label: "停用", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea
              placeholder="请输入备注"
              value={newPosition.remark}
              onChange={(e) => setNewPosition({ ...newPosition, remark: e.target.value })}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑岗位模态框 */}
      <Modal
        title="修改岗位"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={600}
      >
        {currentPosition && (
          <Form layout="vertical">
            <Form.Item label="岗位编码" required>
              <Input
                placeholder="请输入岗位编码"
                value={currentPosition.postId}
                onChange={(e) =>
                  setCurrentPosition({ ...currentPosition, postId: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="岗位名称" required>
              <Input
                placeholder="请输入岗位名称"
                value={currentPosition.postName}
                onChange={(e) =>
                  setCurrentPosition({ ...currentPosition, postName: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="岗位排序">
              <Input
                type="number"
                placeholder="请输入岗位排序"
                value={currentPosition.postSort}
                onChange={(e) =>
                  setCurrentPosition({ ...currentPosition, postSort: Number(e.target.value) })
                }
              />
            </Form.Item>
            <Form.Item label="状态">
              <Select
                value={currentPosition.status}
                onChange={(value) =>
                  setCurrentPosition({ ...currentPosition, status: value })
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
                value={currentPosition.remark}
                onChange={(e) =>
                  setCurrentPosition({ ...currentPosition, remark: e.target.value })
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
        <p>确定要删除岗位 "{currentPosition?.postName}" 吗？</p>
      </Modal>
    </div>
  );
};

export default PositionManagement;
