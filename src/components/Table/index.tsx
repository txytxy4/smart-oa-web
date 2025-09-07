import { Table, Space } from "antd";
import type { TablePaginationConfig, ExpandableConfig } from "antd";
import type { TableRowSelection } from "antd/es/table/interface";
import React, { useState } from "react";

// 定义props类型
interface TableProps<T = unknown> {
    data: T[];
    pagination?: TablePaginationConfig;
    children?: React.ReactNode;
    showCheckbox?: boolean;
    onSelectChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    toolbarRender?: (selectedRowKeys: React.Key[], selectedRows: T[]) => React.ReactNode;
    expandable?: ExpandableConfig<T>;
}

const TableComponent = <T extends object>(props: TableProps<T>) => {
    // 这里可以添加其他逻辑和属性处理
    const { 
        data, 
        pagination, 
        children, 
        showCheckbox = true, 
        onSelectChange, 
        toolbarRender,
        expandable
    } = props;
    
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedRows, setSelectedRows] = useState<T[]>([]);
    
    // 配置行选择
    const rowSelection: TableRowSelection<T> | undefined = showCheckbox ? {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[], selectedRows: T[]) => {
            setSelectedRowKeys(selectedKeys);
            setSelectedRows(selectedRows);
            onSelectChange?.(selectedKeys, selectedRows);
        }
    } : undefined;

    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
             {/* 操作栏按钮区 */}
             {toolbarRender?.(selectedRowKeys, selectedRows)}
            <Table 
                dataSource={data} 
                pagination={pagination}
                rowSelection={rowSelection}
                expandable={expandable}
                rowKey={(record) => {
                    // 使用类型安全的方式检查id属性
                    const recordWithId = record as { id?: string | number };
                    return recordWithId.id ? String(recordWithId.id) : Math.random().toString();
                }}
            >
                {children}
            </Table>
        </Space>
    );
};

export default TableComponent;
