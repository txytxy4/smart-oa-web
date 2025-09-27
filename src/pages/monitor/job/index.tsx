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
  DatePicker,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import { exportToExcel } from "@/hooks/exportToExcel";
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
  createTime?: [string, string] | null;
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
  const [allJobData, setAllJobData] = useState<JobData[]>([]); // 存储所有数据
  const [filteredData, setFilteredData] = useState<JobData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    jobName: "",
    jobGroup: "",
    status: "",
    createTime: null,
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

  // 过滤数据的通用函数
  const applyFilter = useCallback((data: JobData[]) => {
    let filtered = [...data];

    // 任务名称过滤
    if (searchParams.jobName) {
      filtered = filtered.filter(item => 
        item.jobName.toLowerCase().includes(searchParams.jobName!.toLowerCase())
      );
    }

    // 任务组名过滤
    if (searchParams.jobGroup) {
      filtered = filtered.filter(item => item.jobGroup === searchParams.jobGroup);
    }

    // 状态过滤
    if (searchParams.status) {
      const status = searchParams.status === "true";
      filtered = filtered.filter(item => item.status === status);
    }

    // 创建时间过滤
    if (searchParams.createTime && searchParams.createTime.length === 2) {
      const [startDate, endDate] = searchParams.createTime;
      filtered = filtered.filter(item => {
        if (!item.createTime) return false;
        const createTime = new Date(item.createTime);
        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return createTime >= start && createTime <= end;
      });
    }

    return filtered;
  }, [searchParams]);

  // 过滤和分页数据
  const filterAndPaginateData = useCallback(() => {
    const filtered = applyFilter(allJobData);
    setFilteredData(filtered);
    
    // 分页处理
    const startIndex = (pageData.page - 1) * pageData.pageSize;
    const endIndex = startIndex + pageData.pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    setJobData(paginatedData);
    setPageData(prev => ({ ...prev, total: filtered.length }));
  }, [allJobData, applyFilter, pageData.page, pageData.pageSize]);

  // 获取任务数据
  const getJobData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 如果allJobData为空，才使用mockJobData初始化
      if (allJobData.length === 0) {
        setAllJobData(mockJobData);
        // 初始化时应用过滤和分页
        const filtered = applyFilter(mockJobData);
        setFilteredData(filtered);
        
        const startIndex = (pageData.page - 1) * pageData.pageSize;
        const endIndex = startIndex + pageData.pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);
        
        setJobData(paginatedData);
        setPageData(prev => ({ ...prev, total: filtered.length }));
      } else {
        // 应用搜索过滤和分页
        filterAndPaginateData();
      }
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取任务数据失败:", e);
      message.error("获取任务数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams, allJobData.length, applyFilter, filterAndPaginateData]);

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
        // 从本地数据中删除任务
        const updatedData = allJobData.filter(job => job.id !== currentJob.id);
        setAllJobData(updatedData);
        
        // 重新应用过滤和分页
        filterAndPaginateData();
        
        console.log("删除任务 ID:", currentJob.id);
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
      if (!newJob.jobName || !newJob.jobGroup || !newJob.invokeTarget || !newJob.cronExpression) {
        message.error("任务名称、任务组名、调用目标字符串和cron表达式不能为空");
        return;
      }

      // 验证cron表达式格式（简单验证）
      const cronRegex = /^(\S+\s+){5}\S+$/;
      if (!cronRegex.test(newJob.cronExpression)) {
        message.error("cron表达式格式不正确，请输入正确的cron表达式");
        return;
      }

      // 创建新任务对象
      const newJobWithId: JobData = {
        ...newJob,
        id: Math.max(...allJobData.map(j => j.id), 0) + 1,
        createTime: new Date().toLocaleString(),
      };

      // 更新本地数据
      const updatedData = [...allJobData, newJobWithId];
      setAllJobData(updatedData);
      
      // 重新应用过滤和分页
      filterAndPaginateData();
      
      console.log("新增任务:", newJobWithId);
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
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      if (!currentJob) return;
      
      // 验证必填字段
      if (!currentJob.jobName || !currentJob.jobGroup || !currentJob.invokeTarget || !currentJob.cronExpression) {
        message.error("任务名称、任务组名、调用目标字符串和cron表达式不能为空");
        return;
      }

      // 验证cron表达式格式（简单验证）
      const cronRegex = /^(\S+\s+){5}\S+$/;
      if (!cronRegex.test(currentJob.cronExpression)) {
        message.error("cron表达式格式不正确，请输入正确的cron表达式");
        return;
      }

      // 更新本地数据
      const updatedData = allJobData.map(job => 
        job.id === currentJob.id ? currentJob : job
      );
      setAllJobData(updatedData);
      
      // 重新应用过滤和分页
      filterAndPaginateData();
      
      console.log("保存任务信息:", currentJob);
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
      jobName: "",
      jobGroup: "",
      status: "",
      createTime: null,
    };
    setSearchParams(resetParams);
    setPageData(prev => ({ ...prev, page: 1 }));
    
    // 重置后显示全部数据
    setFilteredData(allJobData);
    const startIndex = 0;
    const endIndex = pageData.pageSize;
    const paginatedData = allJobData.slice(startIndex, endIndex);
    setJobData(paginatedData);
    setPageData(prev => ({ ...prev, total: allJobData.length }));
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      // 更新本地数据中的状态
      const updatedData = allJobData.map(job => 
        job.id === id ? { ...job, status } : job
      );
      setAllJobData(updatedData);
      
      // 重新应用过滤和分页
      filterAndPaginateData();
      
      console.log(`切换任务 ${id} 状态为:`, status);
      message.success(status ? "任务已启用" : "任务已停用");
    } catch (e) {
      console.log("状态更新失败:", e);
      message.error("状态更新失败");
    }
  };

  // 导出功能
  const handleExport = () => {
    try {
      // 使用过滤后的数据进行导出
      const dataToExport = filteredData;
      
      if (dataToExport.length === 0) {
        message.warning("没有数据可以导出");
        return;
      }

      const exportData = dataToExport.map(item => ({
        "任务编号": item.id,
        "任务名称": item.jobName,
        "任务组名": item.jobGroup,
        "调用目标字符串": item.invokeTarget,
        "cron执行表达式": item.cronExpression,
        "状态": item.status ? "正常" : "暂停",
        "创建时间": item.createTime || "",
        "备注": item.remark || "",
      }));

      const fileName = `定时任务管理-${new Date().toLocaleDateString()}.xlsx`;
      
      exportToExcel(exportData, fileName);
      message.success(`成功导出 ${dataToExport.length} 条数据`);
      
      console.log("导出数据:", dataToExport);
    } catch (e) {
      console.log("导出失败:", e);
      message.error("导出失败");
    }
  };

  useEffect(() => {
    getJobData();
  }, [getJobData]);

  // 监听搜索参数变化，自动过滤数据
  useEffect(() => {
    if (allJobData.length > 0) {
      setPageData(prev => ({ ...prev, page: 1 })); // 重置到第一页
      filterAndPaginateData();
    }
  }, [searchParams, filterAndPaginateData]);

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
        <Form.Item label="创建时间" name="createTime">
          <DatePicker.RangePicker
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
          title="创建时间" 
          dataIndex="createTime" 
          key="createTime" 
          width={180}
          render={(text: string) => text || '-'}
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
