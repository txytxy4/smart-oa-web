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
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import styles from "./index.module.scss";

// 定时任务数据接口
interface JobData {
  id: number;
  jobName: string;
  jobGroup: string;
  invokeTarget: string;
  cronExpression: string;
  status: boolean;
  remark?: string;
  createTime?: string;
}

// 搜索参数接口
interface SearchParams {
  jobName?: string;
  jobGroup?: string;
  status?: string;
}

// 分页数据接口
interface PageData {
  page: number;
  pageSize: number;
  total: number;
}

const { Column } = Table;
const { Option } = Select;

// 模拟定时任务数据
const mockJobData: JobData[] = [
  {
    id: 1,
    jobName: "系统默认（无参）",
    jobGroup: "默认",
    invokeTarget: "ryTask.ryNoParams",
    cronExpression: "0/10 * * * * ?",
    status: false,
    remark: "系统默认无参任务",
    createTime: "2025-09-13 15:30:00",
  },
  {
    id: 2,
    jobName: "系统默认（有参）",
    jobGroup: "默认",
    invokeTarget: "ryTask.ryParams('ry')",
    cronExpression: "0/15 * * * * ?",
    status: false,
    remark: "系统默认有参任务",
    createTime: "2025-09-13 15:30:00",
  },
  {
    id: 3,
    jobName: "系统默认（多参）",
    jobGroup: "默认",
    invokeTarget: "ryTask.ryMultipleParams('ry', true, 2000L, 316.50D, 100)",
    cronExpression: "0/20 * * * * ?",
    status: false,
    remark: "系统默认多参任务",
    createTime: "2025-09-13 15:30:00",
  },
];

const JobManagement = () => {
  // 任务数据
  const [jobData, setJobData] = useState<JobData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    jobName: "",
    jobGroup: "",
    status: "",
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框状态
  const [currentJob, setCurrentJob] = useState<JobData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);

  // 新增任务数据
  const [newJob, setNewJob] = useState({
    jobName: "",
    jobGroup: "默认",
    invokeTarget: "",
    cronExpression: "",
    status: true,
    remark: "",
  });

  // 获取任务数据
  const getJobData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 这里使用模拟数据
      setJobData(mockJobData);
      setPageData(prev => ({ ...prev, total: mockJobData.length }));
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取任务数据失败:", e);
      message.error("获取任务数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理编辑按钮点击
  const handleEdit = (record: JobData) => {
    setCurrentJob(record);
    setIsEditModalVisible(true);
    console.log("编辑任务:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: JobData) => {
    setCurrentJob(record);
    setIsDeleteModalVisible(true);
    console.log("删除任务:", record);
  };

  // 处理日志按钮点击
  const handleViewLog = (record: JobData) => {
    setCurrentJob(record);
    setIsLogModalVisible(true);
    console.log("查看任务日志:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentJob?.id) {
      try {
        // 这里调用删除API
        console.log("删除任务 ID:", currentJob.id);
        message.success("删除成功");
        // 重新获取数据
        getJobData();
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
      console.log("新增任务:", newJob);
      message.success("新增成功");
      setIsAddModalVisible(false);
      // 重置表单
      setNewJob({
        jobName: "",
        jobGroup: "默认",
        invokeTarget: "",
        cronExpression: "",
        status: true,
        remark: "",
      });
      // 重新获取数据
      getJobData();
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      console.log("保存任务信息:", currentJob);
      message.success("保存成功");
      setIsEditModalVisible(false);
      // 重新获取数据
      getJobData();
    } catch (e) {
      console.log("保存失败:", e);
      message.error("保存失败");
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      jobName: "",
      jobGroup: "",
      status: "",
    });
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      console.log(`切换任务 ${id} 状态为:`, status);
      // 更新本地数据
      setJobData(prev => 
        prev.map(job => 
          job.id === id ? { ...job, status } : job
        )
      );
      message.success(status ? "任务已启用" : "任务已停用");
    } catch (e) {
      console.log("状态更新失败:", e);
      message.error("状态更新失败");
    }
  };

  // 导出功能
  const handleExport = () => {
    console.log("导出定时任务数据");
    message.info("导出功能待实现");
  };

  useEffect(() => {
    getJobData();
  }, [getJobData]);

  return (
    <div className={styles.jobManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="任务名称" name="jobName">
          <Input
            placeholder="请输入任务名称"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                jobName: e.target.value,
              });
            }}
            value={searchParams?.jobName}
          />
        </Form.Item>
        <Form.Item label="任务组名" name="jobGroup">
          <Select
            placeholder="请选择任务组名"
            style={{ width: 200 }}
            onChange={(value) => {
              setSearchParams({
                ...searchParams,
                jobGroup: value,
              });
            }}
            value={searchParams?.jobGroup}
            allowClear
          >
            <Option value="默认">默认</Option>
            <Option value="系统">系统</Option>
            <Option value="业务">业务</Option>
          </Select>
        </Form.Item>
        <Form.Item label="任务状态" name="status">
          <Select
            placeholder="请选择任务状态"
            style={{ width: 200 }}
            options={[
              { label: "正常", value: "true" },
              { label: "暂停", value: "false" },
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
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              getJobData();
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
      <TableComponent<JobData>
        data={jobData}
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
              icon={<ExportOutlined />}
              onClick={handleExport}
            >
              导出
            </Button>
            <Button 
              icon={<FileTextOutlined />}
              onClick={() => selectedRows.length === 1 && handleViewLog(selectedRows[0])}
              disabled={selectedRows.length !== 1}
            >
              日志
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
          title="任务编号" 
          dataIndex="id" 
          key="id" 
          width={100}
        />
        <Column 
          title="任务名称" 
          dataIndex="jobName" 
          key="jobName" 
          width={180}
        />
        <Column 
          title="任务组名" 
          dataIndex="jobGroup" 
          key="jobGroup"
          width={100}
          render={(text) => <Tag color="blue">{text}</Tag>}
        />
        <Column 
          title="调用目标字符串" 
          dataIndex="invokeTarget" 
          key="invokeTarget"
          ellipsis
          render={(text) => (
            <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>
              {text}
            </span>
          )}
        />
        <Column 
          title="cron执行表达式" 
          dataIndex="cronExpression" 
          key="cronExpression"
          width={150}
          render={(text) => (
            <Tag color="green" style={{ fontFamily: 'monospace' }}>
              {text}
            </Tag>
          )}
        />
        <Column
          title="状态"
          key="status"
          width={100}
          render={(_, record: JobData) => (
            <Switch
              checked={record.status}
              onChange={(checked) => handleStatusChange(record.id, checked)}
              checkedChildren="正常"
              unCheckedChildren="暂停"
            />
          )}
        />
        <Column
          title="操作"
          key="action"
          width={200}
          render={(_, record: JobData) => (
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
              <Button 
                type="link" 
                size="small"
                onClick={() => handleViewLog(record)}
              >
                更多
              </Button>
            </Space>
          )}
        />
      </TableComponent>

      {/* 新增任务模态框 */}
      <Modal
        title="添加任务"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="任务名称" required>
            <Input
              placeholder="请输入任务名称"
              value={newJob.jobName}
              onChange={(e) => setNewJob({ ...newJob, jobName: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="任务组名" required>
            <Select
              placeholder="请选择任务组名"
              value={newJob.jobGroup}
              onChange={(value) => setNewJob({ ...newJob, jobGroup: value })}
            >
              <Option value="默认">默认</Option>
              <Option value="系统">系统</Option>
              <Option value="业务">业务</Option>
            </Select>
          </Form.Item>
          <Form.Item label="调用目标字符串" required>
            <Input
              placeholder="请输入调用目标字符串"
              value={newJob.invokeTarget}
              onChange={(e) => setNewJob({ ...newJob, invokeTarget: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="cron表达式" required>
            <Input
              placeholder="请输入cron表达式"
              value={newJob.cronExpression}
              onChange={(e) => setNewJob({ ...newJob, cronExpression: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={newJob.status}
              onChange={(value) => setNewJob({ ...newJob, status: value })}
              options={[
                { label: "正常", value: true },
                { label: "暂停", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="备注">
            <Input.TextArea
              placeholder="请输入备注"
              value={newJob.remark}
              onChange={(e) => setNewJob({ ...newJob, remark: e.target.value })}
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑任务模态框 */}
      <Modal
        title="修改任务"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={600}
      >
        {currentJob && (
          <Form layout="vertical">
            <Form.Item label="任务名称" required>
              <Input
                placeholder="请输入任务名称"
                value={currentJob.jobName}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, jobName: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="任务组名" required>
              <Select
                placeholder="请选择任务组名"
                value={currentJob.jobGroup}
                onChange={(value) =>
                  setCurrentJob({ ...currentJob, jobGroup: value })
                }
              >
                <Option value="默认">默认</Option>
                <Option value="系统">系统</Option>
                <Option value="业务">业务</Option>
              </Select>
            </Form.Item>
            <Form.Item label="调用目标字符串" required>
              <Input
                placeholder="请输入调用目标字符串"
                value={currentJob.invokeTarget}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, invokeTarget: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="cron表达式" required>
              <Input
                placeholder="请输入cron表达式"
                value={currentJob.cronExpression}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, cronExpression: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="状态">
              <Select
                value={currentJob.status}
                onChange={(value) =>
                  setCurrentJob({ ...currentJob, status: value })
                }
                options={[
                  { label: "正常", value: true },
                  { label: "暂停", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="备注">
              <Input.TextArea
                placeholder="请输入备注"
                value={currentJob.remark}
                onChange={(e) =>
                  setCurrentJob({ ...currentJob, remark: e.target.value })
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
        <p>确定要删除任务 "{currentJob?.jobName}" 吗？</p>
      </Modal>

      {/* 任务日志模态框 */}
      <Modal
        title="任务日志"
        open={isLogModalVisible}
        onCancel={() => setIsLogModalVisible(false)}
        width={800}
        footer={null}
      >
        <div className={styles.logContainer}>
          <p><strong>任务名称：</strong>{currentJob?.jobName}</p>
          <p><strong>任务组名：</strong>{currentJob?.jobGroup}</p>
          <p><strong>调用目标：</strong>{currentJob?.invokeTarget}</p>
          <p><strong>执行表达式：</strong>{currentJob?.cronExpression}</p>
          <div style={{ marginTop: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
            <p style={{ margin: 0, color: '#666' }}>暂无执行日志记录</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobManagement;
