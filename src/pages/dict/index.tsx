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
import { exportToExcel } from "@/hooks/exportToExcel";
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
  const [allDictData, setAllDictData] = useState<DictData[]>([]); // 存储所有数据
  const [filteredData, setFilteredData] = useState<DictData[]>([]);
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

  // 过滤数据的通用函数
  const applyFilter = useCallback((data: DictData[]) => {
    let filtered = [...data];

    // 字典名称过滤
    if (searchParams.dictName) {
      filtered = filtered.filter(item => 
        item.dictName.toLowerCase().includes(searchParams.dictName!.toLowerCase())
      );
    }

    // 字典类型过滤
    if (searchParams.dictType) {
      filtered = filtered.filter(item => 
        item.dictType.toLowerCase().includes(searchParams.dictType!.toLowerCase())
      );
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
    const filtered = applyFilter(allDictData);
    setFilteredData(filtered);
    
    // 分页处理
    const startIndex = (pageData.page - 1) * pageData.pageSize;
    const endIndex = startIndex + pageData.pageSize;
    const paginatedData = filtered.slice(startIndex, endIndex);
    
    setDictData(paginatedData);
    setPageData(prev => ({ ...prev, total: filtered.length }));
  }, [allDictData, applyFilter, pageData.page, pageData.pageSize]);

  // 获取字典数据
  const getDictData = useCallback(async () => {
    try {
      // 模拟API调用
      console.log("搜索参数:", searchParams);
      console.log("分页参数:", { page: pageData.page, pageSize: pageData.pageSize });
      
      // 如果allDictData为空，才使用mockDictData初始化
      if (allDictData.length === 0) {
        setAllDictData(mockDictData);
        // 初始化时应用过滤和分页
        const filtered = applyFilter(mockDictData);
        setFilteredData(filtered);
        
        const startIndex = (pageData.page - 1) * pageData.pageSize;
        const endIndex = startIndex + pageData.pageSize;
        const paginatedData = filtered.slice(startIndex, endIndex);
        
        setDictData(paginatedData);
        setPageData(prev => ({ ...prev, total: filtered.length }));
      } else {
        // 应用搜索过滤和分页
        filterAndPaginateData();
      }
      
      message.success("数据加载成功");
    } catch (e) {
      console.log("获取字典数据失败:", e);
      message.error("获取字典数据失败");
    }
  }, [pageData.page, pageData.pageSize, searchParams, allDictData.length, applyFilter, filterAndPaginateData]);

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
        // 从本地数据中删除字典
        const updatedData = allDictData.filter(dict => dict.id !== currentDict.id);
        setAllDictData(updatedData);
        
        // 重新应用过滤和分页
        filterAndPaginateData();
        
        console.log("删除字典 ID:", currentDict.id);
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
      if (!newDict.dictType || !newDict.dictLabel || !newDict.dictValue) {
        message.error("字典类型、数据标签和数据键值不能为空");
        return;
      }

      // 检查字典键值是否重复
      const isDuplicate = allDictData.some(dict => 
        dict.dictType === newDict.dictType && dict.dictValue === newDict.dictValue
      );
      if (isDuplicate) {
        message.error("该字典类型下的键值已存在，请使用其他键值");
        return;
      }

      // 创建新字典对象
      const newDictWithId: DictData = {
        ...newDict,
        id: Math.max(...allDictData.map(d => d.id), 0) + 1,
        dictName: newDict.dictName || newDict.dictType, // 如果没有提供dictName，使用dictType作为默认值
        createTime: new Date().toLocaleString(),
      };

      // 更新本地数据
      const updatedData = [...allDictData, newDictWithId];
      setAllDictData(updatedData);
      
      // 重新应用过滤和分页
      filterAndPaginateData();
      
      console.log("新增字典:", newDictWithId);
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
    } catch (e) {
      console.log("新增失败:", e);
      message.error("新增失败");
    }
  };

  // 处理编辑保存
  const handleEditSave = async () => {
    try {
      if (!currentDict) return;
      
      // 验证必填字段
      if (!currentDict.dictType || !currentDict.dictLabel || !currentDict.dictValue) {
        message.error("字典类型、数据标签和数据键值不能为空");
        return;
      }

      // 检查字典键值是否重复（排除当前编辑的记录）
      const isDuplicate = allDictData.some(dict => 
        dict.id !== currentDict.id && 
        dict.dictType === currentDict.dictType && 
        dict.dictValue === currentDict.dictValue
      );
      if (isDuplicate) {
        message.error("该字典类型下的键值已存在，请使用其他键值");
        return;
      }

      // 更新本地数据
      const updatedData = allDictData.map(dict => 
        dict.id === currentDict.id ? currentDict : dict
      );
      setAllDictData(updatedData);
      
      // 重新应用过滤和分页
      filterAndPaginateData();
      
      console.log("保存字典信息:", currentDict);
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
      dictName: "",
      dictType: "",
      status: "",
      createTime: null,
    };
    setSearchParams(resetParams);
    setPageData(prev => ({ ...prev, page: 1 }));
    
    // 重置后显示全部数据
    setFilteredData(allDictData);
    const startIndex = 0;
    const endIndex = pageData.pageSize;
    const paginatedData = allDictData.slice(startIndex, endIndex);
    setDictData(paginatedData);
    setPageData(prev => ({ ...prev, total: allDictData.length }));
  };

  // 处理状态切换
  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      // 更新本地数据中的状态
      const updatedData = allDictData.map(dict => 
        dict.id === id ? { ...dict, status } : dict
      );
      setAllDictData(updatedData);
      
      // 重新应用过滤和分页
      filterAndPaginateData();
      
      console.log(`切换字典 ${id} 状态为:`, status);
      message.success("状态更新成功");
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
        "字典编号": item.id,
        "字典名称": item.dictName,
        "字典类型": item.dictType,
        "字典标签": item.dictLabel,
        "字典键值": item.dictValue,
        "字典排序": item.dictSort,
        "样式属性": item.cssClass || "",
        "表格回显样式": item.listClass,
        "是否默认": item.isDefault ? "是" : "否",
        "状态": item.status ? "正常" : "停用",
        "创建时间": item.createTime,
        "备注": item.remark || "",
      }));

      const fileName = `字典管理-${new Date().toLocaleDateString()}.xlsx`;
      
      exportToExcel(exportData, fileName);
      message.success(`成功导出 ${dataToExport.length} 条数据`);
      
      console.log("导出数据:", dataToExport);
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

  // 监听搜索参数变化，自动过滤数据
  useEffect(() => {
    if (allDictData.length > 0) {
      setPageData(prev => ({ ...prev, page: 1 })); // 重置到第一页
      filterAndPaginateData();
    }
  }, [searchParams, filterAndPaginateData]);

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
                  message.info("请在表格中点击具体行的修改按钮进行编辑");
                }}
              >
                修改
              </Button>
              <Button 
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  message.info("请在表格中点击具体行的删除按钮进行删除");
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
          <Form.Item label="字典名称">
            <Input
              placeholder="请输入字典名称"
              value={newDict.dictName}
              onChange={(e) => setNewDict({ ...newDict, dictName: e.target.value })}
            />
          </Form.Item>
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
            <Form.Item label="字典名称">
              <Input
                placeholder="请输入字典名称"
                value={currentDict.dictName}
                onChange={(e) =>
                  setCurrentDict({ ...currentDict, dictName: e.target.value })
                }
              />
            </Form.Item>
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
