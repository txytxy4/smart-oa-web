import React, { useState } from 'react';
import { Tree, Input, Card } from 'antd';
import { SearchOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import type { TreeDataNode } from 'antd';

const { Search } = Input;

// 部门树数据
const departmentTreeData: TreeDataNode[] = [
  {
    title: '深圳科技有限公司',
    key: 'company',
    icon: <TeamOutlined />,
    children: [
      {
        title: '技术部',
        key: 'tech',
        icon: <TeamOutlined />,
        children: [
          {
            title: '前端开发组',
            key: 'frontend',
            icon: <UserOutlined />,
          },
          {
            title: '后端开发组',
            key: 'backend',
            icon: <UserOutlined />,
          },
          {
            title: '移动端开发组',
            key: 'mobile',
            icon: <UserOutlined />,
          },
          {
            title: '测试组',
            key: 'test',
            icon: <UserOutlined />,
          },
        ],
      },
      {
        title: '产品部',
        key: 'product',
        icon: <TeamOutlined />,
        children: [
          {
            title: '产品设计组',
            key: 'product-design',
            icon: <UserOutlined />,
          },
          {
            title: 'UI/UX设计组',
            key: 'ui-design',
            icon: <UserOutlined />,
          },
        ],
      },
      {
        title: '市场部',
        key: 'marketing',
        icon: <TeamOutlined />,
        children: [
          {
            title: '市场推广组',
            key: 'marketing-promotion',
            icon: <UserOutlined />,
          },
          {
            title: '商务合作组',
            key: 'business',
            icon: <UserOutlined />,
          },
        ],
      },
      {
        title: '人事部',
        key: 'hr',
        icon: <TeamOutlined />,
        children: [
          {
            title: '招聘组',
            key: 'recruitment',
            icon: <UserOutlined />,
          },
          {
            title: '培训组',
            key: 'training',
            icon: <UserOutlined />,
          },
        ],
      },
      {
        title: '财务部',
        key: 'finance',
        icon: <TeamOutlined />,
        children: [
          {
            title: '会计组',
            key: 'accounting',
            icon: <UserOutlined />,
          },
          {
            title: '出纳组',
            key: 'cashier',
            icon: <UserOutlined />,
          },
        ],
      },
      {
        title: '行政部',
        key: 'admin',
        icon: <TeamOutlined />,
        children: [
          {
            title: '行政管理组',
            key: 'admin-management',
            icon: <UserOutlined />,
          },
          {
            title: '后勤保障组',
            key: 'logistics',
            icon: <UserOutlined />,
          },
        ],
      },
    ],
  },
];

interface DepartmentTreeProps {
  onSelect?: (selectedKeys: React.Key[], selectedDepartment?: string) => void;
}

const DepartmentTree: React.FC<DepartmentTreeProps> = ({ onSelect }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['company', 'tech']);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>(['company']);
  const [searchValue, setSearchValue] = useState('');

  // 处理树节点选择
  const handleSelect = (selectedKeys: React.Key[], info: any) => {
    setSelectedKeys(selectedKeys);
    
    // 获取选中节点的标题作为部门名称
    const selectedDepartment = info.node?.title || '';
    
    onSelect?.(selectedKeys, selectedDepartment);
  };

  // 处理树节点展开
  const handleExpand = (expandedKeys: React.Key[]) => {
    setExpandedKeys(expandedKeys);
  };

  // 搜索功能（简单实现）
  const handleSearch = (value: string) => {
    setSearchValue(value);
    // 这里可以实现搜索逻辑，过滤树节点
  };

  return (
    <Card 
      title="组织架构" 
      size="small" 
      style={{ height: '100%', border: 'none' }}
      bodyStyle={{ padding: '12px', height: 'calc(100% - 57px)', overflow: 'auto' }}
    >
      <Search
        placeholder="搜索部门"
        allowClear
        prefix={<SearchOutlined />}
        style={{ marginBottom: 12 }}
        onChange={(e) => handleSearch(e.target.value)}
      />
      
      <Tree
        showIcon
        expandedKeys={expandedKeys}
        selectedKeys={selectedKeys}
        treeData={departmentTreeData}
        onSelect={handleSelect}
        onExpand={handleExpand}
        style={{ 
          background: 'transparent',
          fontSize: '14px'
        }}
      />
    </Card>
  );
};

export default DepartmentTree;
