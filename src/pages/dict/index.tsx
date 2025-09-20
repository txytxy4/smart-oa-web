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
  InputNumber,
  Tag,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ExportOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import TableComponent from "@/components/Table";
import styles from "./index.module.scss";

// 字典数据接口
interface DictData {
  id: number;
  dictName: string;
  dictType: string;
  dictLabel: string;
  dictValue: string;
  dictSort: number;
  cssClass?: string;
  listClass?: string;
  isDefault: boolean;
  status: boolean;
  createTime: string;
  remark?: string;
}

// 搜索参数接口
interface SearchParams {
  dictName?: string;
  dictType?: string;
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

// 模拟字典数据
const mockDictData: DictData[] = [
  {
    id: 1,
    dictName: "用户性别",
    dictType: "sys_user_sex",
    dictLabel: "男",
    dictValue: "0",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:13",
    remark: "用户性别男选择",
  },
  {
    id: 2,
    dictName: "显示状态",
    dictType: "sys_show_hide",
    dictLabel: "显示",
    dictValue: "0",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:13",
    remark: "显示菜单状选择",
  },
  {
    id: 3,
    dictName: "系统开关",
    dictType: "sys_normal_disable",
    dictLabel: "正常",
    dictValue: "0",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:14",
    remark: "系统正常状选择",
  },
  {
    id: 4,
    dictName: "任务状态",
    dictType: "sys_job_status",
    dictLabel: "正常",
    dictValue: "0",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:14",
    remark: "任务状态正选择",
  },
  {
    id: 5,
    dictName: "任务分组",
    dictType: "sys_job_group",
    dictLabel: "默认",
    dictValue: "DEFAULT",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:15",
    remark: "任务分组默选择",
  },
  {
    id: 6,
    dictName: "系统是否",
    dictType: "sys_yes_no",
    dictLabel: "是",
    dictValue: "Y",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:16",
    remark: "系统是否是选择",
  },
  {
    id: 7,
    dictName: "通知类型",
    dictType: "sys_notice_type",
    dictLabel: "通知",
    dictValue: "1",
    dictSort: 1,
    cssClass: "",
    listClass: "warning",
    isDefault: false,
    status: true,
    createTime: "2025-05-26 10:09:16",
    remark: "通知类型通选择",
  },
  {
    id: 8,
    dictName: "通知状态",
    dictType: "sys_notice_status",
    dictLabel: "正常",
    dictValue: "0",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:16",
    remark: "通知状态正选择",
  },
  {
    id: 9,
    dictName: "操作类型",
    dictType: "sys_oper_type",
    dictLabel: "新增",
    dictValue: "1",
    dictSort: 1,
    cssClass: "",
    listClass: "info",
    isDefault: false,
    status: true,
    createTime: "2025-05-26 10:09:17",
    remark: "操作类型新选择",
  },
  {
    id: 10,
    dictName: "系统状态",
    dictType: "sys_common_status",
    dictLabel: "正常",
    dictValue: "0",
    dictSort: 1,
    cssClass: "",
    listClass: "primary",
    isDefault: true,
    status: true,
    createTime: "2025-05-26 10:09:17",
    remark: "登录状态正选择",
  },
];

// 获取标签颜色
const getTagColor = (listClass?: string) => {
  const colorMap: Record<string, string> = {
    primary: 'blue',
    success: 'green',
    info: 'cyan',
    warning: 'orange',
    danger: 'red',
    secondary: 'default',
  };
  return colorMap[listClass || 'primary'] || 'default';
};

const DictManagement = () => {
  // 字典数据
  const [dictData, setDictData] = useState<DictData[]>([]);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    dictName: "",
    dictType: "",
    status: "",
    createTime: null,
  });
  const [pageData, setPageData] = useState<PageData>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // 模态框状态
  const [currentDict, setCurrentDict] = useState<DictData | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  // 新增字典数据
  const [newDict, setNewDict] = useState({
    dictName: "",
    dictType: "",
    dictLabel: "",
    dictValue: "",
    dictSort: 0,
    cssClass: "",
    listClass: "primary",
    isDefault: false,
    status: true,
    remark: "",
  });

  // 获取字典数据
  const getDictData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 过滤数据
      let filteredData = [...mockDictData];
      
      if (searchParams.dictName) {
        filteredData = filteredData.filter(item => 
          item.dictName.includes(searchParams.dictName!)
        );
      }
      
      if (searchParams.dictType) {
        filteredData = filteredData.filter(item => 
          item.dictType.includes(searchParams.dictType!)
        );
      }
      
      if (searchParams.status) {
        const statusBool = searchParams.status === 'true';
        filteredData = filteredData.filter(item => item.status === statusBool);
      }
      
      // 分页处理
      const startIndex = (pageData.page - 1) * pageData.pageSize;
      const endIndex = startIndex + pageData.pageSize;
      const paginatedData = filteredData.slice(startIndex, endIndex);
      
      setDictData(paginatedData);
      setPageData(prev => ({ ...prev, total: filteredData.length }));
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取字典数据失败:", e);
      message.error("获取字典数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams]);

  // 处理编辑按钮点击
  const handleEdit = (record: DictData) => {
    setCurrentDict(record);
    setIsEditModalVisible(true);
    console.log("编辑字典:", record);
  };

  // 处理删除按钮点击
  const handleDelete = (record: DictData) => {
    setCurrentDict(record);
    setIsDeleteModalVisible(true);
    console.log("删除字典:", record);
  };

  // 确认删除
  const confirmDelete = async () => {
    if (currentDict?.id) {
      try {
        // 这里调用删除API
        console.log("删除字典 ID:", currentDict.id);
        message.success("删除成功");
        // 重新获取数据
        getDictData();
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
      console.log("新增字典:", newDict);
      message.success("新增成功");
      setIsAddModalVisible(false);
      // 重置表单
      setNewDict({
        dictName: "",
        dictType: "",
        dictLabel: "",
        dictValue: "",
        dictSort: 0,
        cssClass: "",
        listClass: "primary",
        isDefault: false,
        status: true,
        remark: "",
      });
      // 重新获取数据
      getDictData();
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      console.log("保存字典信息:", currentDict);
      message.success("保存成功");
      setIsEditModalVisible(false);
      // 重新获取数据
      getDictData();
    } catch (e) {
      console.log("保存失败:", e);
      message.error("保存失败");
    }
  };

  // 重置搜索条件
  const handleReset = () => {
    setSearchParams({
      dictName: "",
      dictType: "",
      status: "",
      createTime: null,
    });
    setPageData(prev => ({ ...prev, page: 1 }));
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      console.log(`切换字典 ${id} 状态为:`, status);
      // 这里应该调用API更新状态
      message.success("状态更新成功");
      // 重新获取数据
      getDictData();
    } catch (e) {
      console.log("状态更新失败:", e);
      message.error("状态更新失败");
    }
  };

  // 导出功能
  const handleExport = async () => {
    try {
      console.log("导出字典数据");
      // 模拟导出逻辑
      const dataStr = JSON.stringify(dictData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = `字典数据_${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      message.success("导出成功");
    } catch (e) {
      console.log("导出失败:", e);
      message.error("导出失败");
    }
  };

  // 刷新缓存
  const handleRefreshCache = async () => {
    try {
      console.log("刷新字典缓存");
      // 模拟刷新缓存逻辑
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success("刷新缓存成功");
    } catch (e) {
      console.log("刷新缓存失败:", e);
      message.error("刷新缓存失败");
    }
  };

  // 分页改变处理
  const handlePageChange = (page: number, pageSize?: number) => {
    setPageData(prev => ({
      ...prev,
      page,
      pageSize: pageSize || prev.pageSize,
    }));
  };

  useEffect(() => {
    getDictData();
  }, [getDictData]);

  return (
    <div className={styles.dictManagement}>
      {/* 搜索表单 */}
      <Form layout="inline" className={styles.searchForm}>
        <Form.Item label="字典名称" name="dictName">
          <Input
            placeholder="请输入字典名称"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                dictName: e.target.value,
              });
            }}
            value={searchParams?.dictName}
          />
        </Form.Item>
        <Form.Item label="字典类型" name="dictType">
          <Input
            placeholder="请输入字典类型"
            style={{ width: 200 }}
            onChange={(e) => {
              setSearchParams({
                ...searchParams,
                dictType: e.target.value,
              });
            }}
            value={searchParams?.dictType}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            placeholder="数据状态"
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
              setPageData(prev => ({ ...prev, page: 1 }));
              getDictData();
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
      <TableComponent<DictData>
        data={dictData}
        toolbarRender={() => (
          <div className={styles.tableHeader}>
            <Space>
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsAddModalVisible(true)}
              >
                新增
              </Button>
              <Button 
                icon={<EditOutlined />}
                onClick={() => {
                  if (dictData.length > 0) {
                    handleEdit(dictData[0]);
                  } else {
                    message.warning("请先选择要修改的数据");
                  }
                }}
              >
                修改
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  if (dictData.length > 0) {
                    handleDelete(dictData[0]);
                  } else {
                    message.warning("请先选择要删除的数据");
                  }
                }}
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
                icon={<SyncOutlined />}
                onClick={handleRefreshCache}
              >
                刷新缓存
              </Button>
            </Space>
          </div>
        )}
        pagination={{
          current: pageData.page,
          pageSize: pageData.pageSize,
          total: pageData.total,
          onChange: handlePageChange,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `显示 ${range[0]}-${range[1]} 条记录，共 ${total} 条记录`,
        }}
      >
        <Column 
          title="字典编号" 
          dataIndex="id" 
          key="id"
          width={100}
        />
        <Column 
          title="字典名称" 
          dataIndex="dictName" 
          key="dictName"
          width={150}
        />
        <Column 
          title="字典类型" 
          dataIndex="dictType" 
          key="dictType" 
          width={180}
          render={(text: string) => (
            <span className={styles.dictType}>{text}</span>
          )}
        />
        <Column 
          title="字典标签" 
          dataIndex="dictLabel" 
          key="dictLabel" 
          width={120}
          render={(text: string, record: DictData) => (
            <Tag color={getTagColor(record.listClass)}>
              {text}
            </Tag>
          )}
        />
        <Column 
          title="字典键值" 
          dataIndex="dictValue" 
          key="dictValue" 
          width={120}
          render={(text: string) => (
            <span className={styles.dictValue}>{text}</span>
          )}
        />
        <Column 
          title="字典排序" 
          dataIndex="dictSort" 
          key="dictSort" 
          width={100}
        />
        <Column
          title="状态"
          key="status"
          width={100}
          render={(_, record: DictData) => (
            <Switch
              checked={record.status}
              onChange={(checked) => handleStatusChange(record.id, checked)}
              checkedChildren="正常"
              unCheckedChildren="停用"
            />
          )}
        />
        <Column 
          title="备注" 
          dataIndex="remark" 
          key="remark" 
          width={150}
          render={(text: string) => text || '-'}
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
          render={(_, record: DictData) => (
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

      {/* 新增字典模态框 */}
      <Modal
        title="添加字典数据"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        onOk={handleAdd}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="字典类型" required>
            <Input
              placeholder="请输入字典类型"
              value={newDict.dictType}
              onChange={(e) => setNewDict({ ...newDict, dictType: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="数据标签" required>
            <Input
              placeholder="请输入数据标签"
              value={newDict.dictLabel}
              onChange={(e) => setNewDict({ ...newDict, dictLabel: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="数据键值" required>
            <Input
              placeholder="请输入数据键值"
              value={newDict.dictValue}
              onChange={(e) => setNewDict({ ...newDict, dictValue: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="显示排序">
            <InputNumber
              placeholder="请输入显示排序"
              value={newDict.dictSort}
              onChange={(value) => setNewDict({ ...newDict, dictSort: value || 0 })}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="样式属性">
            <Input
              placeholder="请输入样式属性"
              value={newDict.cssClass}
              onChange={(e) => setNewDict({ ...newDict, cssClass: e.target.value })}
            />
          </Form.Item>
          <Form.Item label="表格回显样式">
            <Select
              value={newDict.listClass}
              onChange={(value) => setNewDict({ ...newDict, listClass: value })}
              options={[
                { label: "主要", value: "primary" },
                { label: "成功", value: "success" },
                { label: "信息", value: "info" },
                { label: "警告", value: "warning" },
                { label: "危险", value: "danger" },
                { label: "次要", value: "secondary" },
              ]}
            />
          </Form.Item>
          <Form.Item label="是否默认">
            <Select
              value={newDict.isDefault}
              onChange={(value) => setNewDict({ ...newDict, isDefault: value })}
              options={[
                { label: "是", value: true },
                { label: "否", value: false },
              ]}
            />
          </Form.Item>
          <Form.Item label="状态">
            <Select
              value={newDict.status}
              onChange={(value) => setNewDict({ ...newDict, status: value })}
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
              value={newDict.remark}
              onChange={(e) => setNewDict({ ...newDict, remark: e.target.value })}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 编辑字典模态框 */}
      <Modal
        title="修改字典数据"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSave}
        width={600}
      >
        {currentDict && (
          <Form layout="vertical">
            <Form.Item label="字典类型" required>
              <Input
                placeholder="请输入字典类型"
                value={currentDict.dictType}
                onChange={(e) =>
                  setCurrentDict({ ...currentDict, dictType: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="数据标签" required>
              <Input
                placeholder="请输入数据标签"
                value={currentDict.dictLabel}
                onChange={(e) =>
                  setCurrentDict({ ...currentDict, dictLabel: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="数据键值" required>
              <Input
                placeholder="请输入数据键值"
                value={currentDict.dictValue}
                onChange={(e) =>
                  setCurrentDict({ ...currentDict, dictValue: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="显示排序">
              <InputNumber
                placeholder="请输入显示排序"
                value={currentDict.dictSort}
                onChange={(value) =>
                  setCurrentDict({ ...currentDict, dictSort: value || 0 })
                }
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item label="样式属性">
              <Input
                placeholder="请输入样式属性"
                value={currentDict.cssClass}
                onChange={(e) =>
                  setCurrentDict({ ...currentDict, cssClass: e.target.value })
                }
              />
            </Form.Item>
            <Form.Item label="表格回显样式">
              <Select
                value={currentDict.listClass}
                onChange={(value) =>
                  setCurrentDict({ ...currentDict, listClass: value })
                }
                options={[
                  { label: "主要", value: "primary" },
                  { label: "成功", value: "success" },
                  { label: "信息", value: "info" },
                  { label: "警告", value: "warning" },
                  { label: "危险", value: "danger" },
                  { label: "次要", value: "secondary" },
                ]}
              />
            </Form.Item>
            <Form.Item label="是否默认">
              <Select
                value={currentDict.isDefault}
                onChange={(value) =>
                  setCurrentDict({ ...currentDict, isDefault: value })
                }
                options={[
                  { label: "是", value: true },
                  { label: "否", value: false },
                ]}
              />
            </Form.Item>
            <Form.Item label="状态">
              <Select
                value={currentDict.status}
                onChange={(value) =>
                  setCurrentDict({ ...currentDict, status: value })
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
                value={currentDict.remark}
                onChange={(e) =>
                  setCurrentDict({ ...currentDict, remark: e.target.value })
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
        <p>确定要删除字典 "{currentDict?.dictLabel}" 吗？</p>
      </Modal>
    </div>
  );
};

export default DictManagement;
