import { useState, useRef } from "react";
import { Button, Space, message, Modal, Form } from "antd";
import { SaveOutlined, EyeOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
// @ts-expect-error fr-generator 没有 TypeScript 类型定义
import Generator from "fr-generator";
// @ts-expect-error form-render 没有 TypeScript 类型定义
import FormRender from "form-render";
import styles from "./index.module.scss";

interface FormSchema {
  type: string;
  properties: Record<string, unknown>;
  [key: string]: unknown;
}

const Build = () => {
  const [form] = Form.useForm();
  const [schema, setSchema] = useState<FormSchema>({
    type: "object",
    properties: {
      input1: {
        title: "输入框",
        type: "string",
        placeholder: "请输入内容"
      },
      select1: {
        title: "下拉选择",
        type: "string",
        enum: ["选项1", "选项2", "选项3"],
        enumNames: ["选项一", "选项二", "选项三"]
      }
    }
  });
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理schema变化
  const handleSchemaChange = (newSchema: FormSchema) => {
    setSchema(newSchema);
    console.log("Schema updated:", newSchema);
  };

  // 保存配置
  const handleSave = () => {
    const formConfig = {
      schema: schema,
      formData: formData,
      timestamp: new Date().toISOString()
    };
    console.log("保存表单配置:", formConfig);
    
    // 保存到本地存储
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
      schema: schema,
      formData: formData,
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
        
        if (config.schema) {
          setSchema(config.schema);
          if (config.formData) {
            setFormData(config.formData);
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
    
    // 清空input值，允许重复导入同一文件
    event.target.value = '';
  };

  // 预览表单提交
  const onPreviewFinish = (values: Record<string, unknown>) => {
    console.log("预览表单提交:", values);
    message.success("表单提交成功！");
    setFormData(values);
  };

  return (
    <div className={styles.buildContainer}>
      <div className={styles.header}>
        <h2>表单构建器</h2>
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
      
      <div className={styles.generatorContainer}>
        <Generator
          schema={schema}
          onChange={(newSchema) => {
            console.log("Generator onChange called with:", newSchema);
            if (newSchema && typeof newSchema === 'object') {
              handleSchemaChange(newSchema);
            }
          }}
          onSchemaChange={(newSchema) => {
            console.log("Generator onSchemaChange called with:", newSchema);
            if (newSchema && typeof newSchema === 'object') {
              handleSchemaChange(newSchema);
            }
          }}
        />
      </div>

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
        <div className={styles.previewContainer}>
          <FormRender
            schema={schema as any}
            form={form}
            onFinish={onPreviewFinish}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Build;