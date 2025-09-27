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
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import { exportToExcel } from "@/hooks/exportToExcel";
import styles from "./index.module.scss";

// 公告数据接口
interface AnnouncementData {
  id: number;
  announcementTitle: string;
  announcementType: string;
  status: string;
  creator: string;
  createTime: string;
  content?: string;
}

// 搜索参数接口
interface SearchParams {
  announcementTitle?: string;
  operator?: string;
  announcementType?: string;
}

// 分页数据接口
interface PageData {
  page: number;
  pageSize: number;
  total: number;
}

const { Column } = Table;

// 模拟公告数据
const mockAnnouncementData: AnnouncementData[] = [
  {
    id: 1,
    announcementTitle: "温馨提醒:2018-07-01 若依新版本发布啦",
    announcementType: "公告",
    status: "正常",
    creator: "admin",
    createTime: "2025-05-26",
    content: "若依新版本发布，包含多项功能更新和性能优化。",
  },
  {
    id: 2,
    announcementTitle: "维护通知:2018-07-01 若依系统凌晨维护",
    announcementType: "通知",
    status: "正常",
    creator: "admin",
    createTime: "2025-05-26",
    content: "系统将于凌晨进行维护，预计维护时间2小时。",
  },
];

const AnnouncementManagement = () => {
  // 公告数据
  const [announcementData, setAnnouncementData] = useState<AnnouncementData[]>([]);
  const [filteredData, setFilteredData] = useState<AnnouncementData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    announcementTitle: "",
    operator: "",
    announcementType: "",
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框状态
  const [currentAnnouncement, setCurrentAnnouncement] = useState<AnnouncementData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 新增公告数据
  const [newAnnouncement, setNewAnnouncement] = useState({
    announcementTitle: "",
    announcementType: "",
    status: "正常",
    content: "",
  });

  // 过滤数据的通用函数
  const applyFilter = useCallback((data: AnnouncementData[]) => {
    let filtered = [...data];

    // 公告标题过滤
    if (searchParams.announcementTitle) {
      filtered = filtered.filter(item => 
        item.announcementTitle.toLowerCase().includes(searchParams.announcementTitle!.toLowerCase())
      );
    }

    // 操作人员过滤（对应创建者字段）
    if (searchParams.operator) {
      filtered = filtered.filter(item => 
        item.creator.toLowerCase().includes(searchParams.operator!.toLowerCase())
      );
    }

    // 公告类型过滤
    if (searchParams.announcementType) {
      filtered = filtered.filter(item => item.announcementType === searchParams.announcementType);
    }

    return filtered;
  }, [searchParams]);

  // 过滤数据
  const filterData = useCallback(() => {
    const filtered = applyFilter(announcementData);
    setFilteredData(filtered);
    setPageData(prev => ({ ...prev, total: filtered.length, page: 1 }));
  }, [announcementData, applyFilter]);

  // 获取公告数据
  const getAnnouncementData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 如果announcementData为空，才使用mockAnnouncementData初始化
      if (announcementData.length === 0) {
        setAnnouncementData(mockAnnouncementData);
        // 初始化时显示全部数据
        setFilteredData(mockAnnouncementData);
        setPageData(prev => ({ ...prev, total: mockAnnouncementData.length }));
      } else {
        // 应用搜索过滤
        filterData();
      }
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取公告数据失败:", e);
      message.error("获取公告数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams, announcementData.length, filterData]);

  // 处理编辑按钮点击
  const handleEdit = (record: AnnouncementData) => {
    setCurrentAnnouncement(record);
    setIsEditModalVisible(true);
    console.log("编辑公告:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: AnnouncementData) => {
    setCurrentAnnouncement(record);
    setIsDeleteModalVisible(true);
    console.log("删除公告:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentAnnouncement?.id) {
      try {
        // 从本地数据中过滤掉要删除的公告
        const filteredAnnouncementData = announcementData.filter(announcement => announcement.id !== currentAnnouncement.id);
        setAnnouncementData(filteredAnnouncementData);
        
        // 应用过滤到删除后的数据
        const filtered = applyFilter(filteredAnnouncementData);
        setFilteredData(filtered);
        setPageData(prev => ({ ...prev, total: filtered.length }));
        
        console.log("删除公告 ID:", currentAnnouncement.id);
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
      if (!newAnnouncement.announcementTitle || !newAnnouncement.announcementType) {
        message.error("公告标题和公告类型不能为空");
        return;
      }

      // 创建新公告对象
      const newAnnouncementWithId: AnnouncementData = {
        ...newAnnouncement,
        id: Math.max(...announcementData.map(a => a.id), 0) + 1,
        creator: "admin", // 实际项目中应该从用户信息中获取
        createTime: new Date().toLocaleDateString(),
      };

      // 更新本地数据
      const updatedData = [...announcementData, newAnnouncementWithId];
      setAnnouncementData(updatedData);
      
      // 应用过滤到新数据
      const filtered = applyFilter(updatedData);
      setFilteredData(filtered);
      setPageData(prev => ({ ...prev, total: filtered.length }));
      
      console.log("新增公告:", newAnnouncementWithId);
      message.success("新增成功");
      setIsAddModalVisible(false);
      
      // 重置表单
      setNewAnnouncement({
        announcementTitle: "",
        announcementType: "",
        status: "正常",
        content: "",
      });
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      if (!currentAnnouncement) return;
      
      // 验证必填字段
      if (!currentAnnouncement.announcementTitle || !currentAnnouncement.announcementType) {
        message.error("公告标题和公告类型不能为空");
        return;
      }

      // 直接更新本地数据
      const updatedAnnouncementData = announcementData.map(announcement => 
        announcement.id === currentAnnouncement.id ? currentAnnouncement : announcement
      );
      
      setAnnouncementData(updatedAnnouncementData);
      
      // 应用过滤到更新后的数据
      const filtered = applyFilter(updatedAnnouncementData);
      setFilteredData(filtered);
      setPageData(prev => ({ ...prev, total: filtered.length }));
      
      console.log("保存公告信息:", currentAnnouncement);
      message.success("保存成功");
      setIsEditModalVisible(false);
    } catch (e) {
      console.log("保存失败:", e);
      message.error("保存失败");
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    const resetParams = {
      announcementTitle: "",
      operator: "",
      announcementType: "",
    };
    setSearchParams(resetParams);
    // 重置后显示全部数据
    setFilteredData(announcementData);
    setPageData(prev => ({ ...prev, total: announcementData.length, page: 1 }));
  };

  // 获取公告类型标签颜色
  const getTypeTagColor = (type: string) => {
    switch (type) {
      case "公告":
        return "green";
      case "通知":
        return "orange";
      case "提醒":
        return "blue";
      default:
        return "default";
    }
  };

  // 获取状态标签颜色
  const getStatusTagColor = (status: string) => {
    switch (status) {
      case "正常":
        return "blue";
      case "停用":
        return "red";
      default:
        return "default";
    }
  };

  // 处理导出功能
  const handleExport = (selectedRows: AnnouncementData[]) => {
    try {
      const dataToExport = selectedRows.length > 0 ? selectedRows : filteredData;
      
      if (dataToExport.length === 0) {
        message.warning("没有数据可以导出");
        return;
      }

      // 格式化导出数据
      const exportData = dataToExport.map(item => ({
        "序号": item.id,
        "公告标题": item.announcementTitle,
        "公告类型": item.announcementType,
        "状态": item.status,
        "创建者": item.creator,
        "创建时间": item.createTime,
        "公告内容": item.content || "",
      }));

      const fileName = selectedRows.length > 0 
        ? `公告管理-选中数据-${new Date().toLocaleDateString()}.xlsx`
        : `公告管理-全部数据-${new Date().toLocaleDateString()}.xlsx`;
      
      exportToExcel(exportData, fileName);
      message.success(`成功导出 ${dataToExport.length} 条数据`);
      
      console.log("导出数据:", dataToExport);
    } catch (e) {
      console.log("导出失败:", e);
      message.error("导出失败");
    }
  };

  useEffect(() => {
    getAnnouncementData();
  }, [getAnnouncementData]);

  // 监听搜索参数变化，自动过滤数据
  useEffect(() => {
    if (announcementData.length > 0) {
      filterData();
    }
  }, [searchParams, filterData]);

  return (
    <div className={styles.announcementManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="公告标题" name="announcementTitle">
          <Input
            placeholder="请输入公告标题"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                announcementTitle: e.target.value,
              });
            }}
            value={searchParams?.announcementTitle}
          />
        </Form.Item>
        <Form.Item label="操作人员" name="operator">
          <Input
            placeholder="请输入操作人员"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                operator: e.target.value,
              });
            }}
            value={searchParams?.operator}
          />
        </Form.Item>
        <Form.Item label="类型" name="announcementType">
          <Select
            placeholder="公告类型"
            style={{ width: 200 }}
            options={[
              { label: "公告", value: "公告" },
              { label: "通知", value: "通知" },
              { label: "提醒", value: "提醒" },
            ]}
            onChange={(value) => {
              setSearchParams({
                ...searchParams,
                announcementType: value,
              });
            }}
            value={searchParams?.announcementType}
            allowClear
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              getAnnouncementData();
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
      <TableComponent<AnnouncementData>
        data={filteredData}
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
          title="序号" 
          dataIndex="id" 
          key="id" 
          width={80}
        />
        <Column 
          title="公告标题" 
          dataIndex="announcementTitle" 
          key="announcementTitle"
          ellipsis
        />
        <Column 
          title="公告类型" 
          dataIndex="announcementType" 
          key="announcementType"
          width={120}
          render={(type: string) => (
            <Tag color={getTypeTagColor(type)}>
              {type}
            </Tag>
          )}
        />
        <Column 
          title="状态" 
          dataIndex="status" 
          key="status"
          width={100}
          render={(status: string) => (
            <Tag color={getStatusTagColor(status)}>
              {status}
            </Tag>
          )}
        />
        <Column 
          title="创建者" 
          dataIndex="creator" 
          key="creator"
          width={120}
        />
        <Column 
          title="创建时间" 
          dataIndex="createTime" 
          key="createTime" 
          width={120}
        />
        <Column
          title="操作"
          key="action"
          width={150}
          render={(_, record: AnnouncementData) => (
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

      {/* 新增公告模态框 */}
      <Modal
        title="添加公告"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="公告标题" required>
            <Input
              placeholder="请输入公告标题"
              value={newAnnouncement.announcementTitle}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, announcementTitle: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="公告类型" required>
            <Select
              placeholder="请选择公告类型"
              value={newAnnouncement.announcementType}
              onChange={(value) => setNewAnnouncement({ ...newAnnouncement, announcementType: value })}
              options={[
                { label: "公告", value: "公告" },
                { label: "通知", value: "通知" },
                { label: "提醒", value: "提醒" },
              ]}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={newAnnouncement.status}
              onChange={(value) => setNewAnnouncement({ ...newAnnouncement, status: value })}
              options={[
                { label: "正常", value: "正常" },
                { label: "停用", value: "停用" },
              ]}
            />
          </Form.Item>
          <Form.Item label="公告内容">
            <Input.TextArea
              placeholder="请输入公告内容"
              value={newAnnouncement.content}
              onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
              rows={4}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑公告模态框 */}
      <Modal
        title="修改公告"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={600}
      >
        {currentAnnouncement && (
          <Form layout="vertical">
            <Form.Item label="公告标题" required>
              <Input
                placeholder="请输入公告标题"
                value={currentAnnouncement.announcementTitle}
                onChange={(e) =>
                  setCurrentAnnouncement({ ...currentAnnouncement, announcementTitle: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="公告类型" required>
              <Select
                placeholder="请选择公告类型"
                value={currentAnnouncement.announcementType}
                onChange={(value) =>
                  setCurrentAnnouncement({ ...currentAnnouncement, announcementType: value })
                }
                options={[
                  { label: "公告", value: "公告" },
                  { label: "通知", value: "通知" },
                  { label: "提醒", value: "提醒" },
                ]}
              />
            </Form.Item>
            <Form.Item label="状态">
              <Select
                value={currentAnnouncement.status}
                onChange={(value) =>
                  setCurrentAnnouncement({ ...currentAnnouncement, status: value })
                }
                options={[
                  { label: "正常", value: "正常" },
                  { label: "停用", value: "停用" },
                ]}
              />
            </Form.Item>
            <Form.Item label="公告内容">
              <Input.TextArea
                placeholder="请输入公告内容"
                value={currentAnnouncement.content}
                onChange={(e) =>
                  setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })
                }
                rows={4}
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
        <p>确定要删除公告 "{currentAnnouncement?.announcementTitle}" 吗？</p>
      </Modal>
    </div>
  );
};

export default AnnouncementManagement;
