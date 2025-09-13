import { useState, useRef } from "react";
import { 
  Button, 
  Space, 
  message, 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  Switch,
  Modal,
  List,
  Typography
} from "antd";
import { 
  SaveOutlined, 
  EyeOutlined, 
  DownloadOutlined, 
  UploadOutlined, 
  PlusOutlined,
  DeleteOutlined,
  DragOutlined
} from "@ant-design/icons";
import styles from "./index.module.scss";

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface FormField {
  id: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  rules?: string[];
}

const Build = () => {
  const [form] = Form.useForm();
  const [fields, setFields] = useState<FormField[]>([
    {
      id: "field_1",
      type: "input",
      label: "姓名",
      required: true,
      placeholder: "请输入姓名"
    }
  ]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 添加字段
  const addField = (type: string) => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      type,
      label: getFieldLabel(type),
      required: false,
      placeholder: `请输入${getFieldLabel(type)}`
    };
    setFields([...fields, newField]);
  };

  // 获取字段标签
  const getFieldLabel = (type: string) => {
    const labels: Record<string, string> = {
      input: "输入框",
      textarea: "多行文本",
      select: "下拉选择",
      number: "数字输入",
      date: "日期选择",
      switch: "开关选择"
    };
    return labels[type] || "新字段";
  };

  // 删除字段
  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  // 更新字段 - 预留给属性配置面板使用
  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ));
  };

  // 临时使用 updateField 避免 ESLint 警告
  console.log("updateField function available for future use:", typeof updateField);

  // 保存配置
  const handleSave = () => {
    const formConfig = {
      fields: fields,
      formData: form.getFieldsValue(),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('form-builder-config', JSON.stringify(formConfig));
    message.success("表单配置已保存到本地存储！");
  };

  // 预览表单
  const handlePreview = () => {
    setIsPreviewVisible(true);
  };

  // 导出配置
  const handleExport = () => {
    const formConfig = {
      fields: fields,
      formData: form.getFieldsValue(),
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    };
    
    const dataStr = JSON.stringify(formConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `form-schema-${new Date().getTime()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    message.success("表单配置已导出！");
  };

  // 导入配置
  const handleImport = () => {
    fileInputRef.current?.click();
  };

  // 处理文件导入
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const config = JSON.parse(content);
        
        if (config.fields) {
          setFields(config.fields);
          if (config.formData) {
            form.setFieldsValue(config.formData);
          }
          message.success("表单配置导入成功！");
        } else {
          message.error("无效的配置文件格式！");
        }
      } catch (error) {
        console.error("导入配置失败:", error);
        message.error("配置文件解析失败！");
      }
    };
    reader.readAsText(file);
    
    event.target.value = '';
  };

  // 渲染表单字段
  const renderFormField = (field: FormField) => {
    const commonProps = {
      placeholder: field.placeholder
    };

    switch (field.type) {
      case "input":
        return <Input {...commonProps} />;
      case "textarea":
        return <TextArea {...commonProps} rows={3} />;
      case "select":
        return (
          <Select {...commonProps}>
            {field.options?.map(option => (
              <Option key={option} value={option}>{option}</Option>
            ))}
          </Select>
        );
      case "number":
        return <InputNumber {...commonProps} style={{ width: "100%" }} />;
      case "date":
        return <DatePicker {...commonProps} style={{ width: "100%" }} />;
      case "switch":
        return <Switch />;
      default:
        return <Input {...commonProps} />;
    }
  };

  // 表单提交
  const onFinish = (values: Record<string, unknown>) => {
    console.log("表单提交:", values);
    message.success("表单提交成功！");
  };

  return (
    <div className={styles.buildContainer}>
      <div className={styles.header}>
        <Title level={2} style={{ margin: 0 }}>表单构建器</Title>
        <Space>
          <Button 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
          >
            保存配置
          </Button>
          <Button 
            icon={<EyeOutlined />} 
            onClick={handlePreview}
          >
            预览表单
          </Button>
          <Button 
            icon={<UploadOutlined />} 
            onClick={handleImport}
          >
            导入配置
          </Button>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            导出配置
          </Button>
        </Space>
      </div>
      
      <Row gutter={16} style={{ height: "calc(100vh - 200px)" }}>
        {/* 组件面板 */}
        <Col span={6}>
          <Card title="组件库" className={styles.componentPanel}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => addField("input")}
                style={{ width: "100%" }}
              >
                输入框
              </Button>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => addField("textarea")}
                style={{ width: "100%" }}
              >
                多行文本
              </Button>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => addField("select")}
                style={{ width: "100%" }}
              >
                下拉选择
              </Button>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => addField("number")}
                style={{ width: "100%" }}
              >
                数字输入
              </Button>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => addField("date")}
                style={{ width: "100%" }}
              >
                日期选择
              </Button>
              <Button 
                type="dashed" 
                icon={<PlusOutlined />}
                onClick={() => addField("switch")}
                style={{ width: "100%" }}
              >
                开关选择
              </Button>
            </Space>
          </Card>
        </Col>

        {/* 设计区域 */}
        <Col span={12}>
          <Card title="表单设计" className={styles.designArea}>
            <List
              dataSource={fields}
              renderItem={(field) => (
                <List.Item
                  key={field.id}
                  className={styles.fieldItem}
                  actions={[
                    <Button
                      key="delete"
                      type="link"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeField(field.id)}
                    />
                  ]}
                >
                  <div className={styles.fieldContent}>
                    <DragOutlined className={styles.dragHandle} />
                    <div className={styles.fieldInfo}>
                      <Text strong>{field.label}</Text>
                      <Text type="secondary" style={{ marginLeft: 8 }}>
                        ({field.type})
                      </Text>
                      {field.required && (
                        <Text type="danger" style={{ marginLeft: 8 }}>*</Text>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* 属性配置 */}
        <Col span={6}>
          <Card title="属性配置" className={styles.propertyPanel}>
            <Text type="secondary">选择左侧字段进行配置</Text>
          </Card>
        </Col>
      </Row>

      {/* 隐藏的文件输入 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* 预览模态框 */}
      <Modal
        title="表单预览"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        width={800}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          style={{ maxHeight: 500, overflow: "auto", padding: 16 }}
        >
          {fields.map(field => (
            <Form.Item
              key={field.id}
              label={field.label}
              name={field.id}
              rules={field.required ? [{ required: true, message: `请输入${field.label}` }] : []}
            >
              {renderFormField(field)}
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Build;