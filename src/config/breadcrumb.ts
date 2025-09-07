// 路由面包屑配置
export interface BreadcrumbItem {
  title: string;
  path?: string;
}

export interface RouteConfig {
  path: string;
  title: string;
  breadcrumbs: BreadcrumbItem[];
  parentPath?: string;
}

// 路由配置映射
export const routeConfig: Record<string, RouteConfig> = {
  '/index/home': {
    path: '/index/home',
    title: '首页',
    breadcrumbs: [
      { title: '首页', path: '/index/home' }
    ]
  },
  '/index/userList': {
    path: '/index/userList',
    title: '用户管理',
    breadcrumbs: [
      { title: '系统管理' },
      { title: '用户管理', path: '/index/userList' }
    ],
    parentPath: '/index'
  },
  '/index/role': {
    path: '/index/role',
    title: '角色管理',
    breadcrumbs: [
      { title: '系统管理' },
      { title: '角色管理', path: '/index/role' }
    ],
    parentPath: '/index'
  },
  '/index/department': {
    path: '/index/department',
    title: '部门管理',
    breadcrumbs: [
      { title: '系统管理' },
      { title: '部门管理', path: '/index/department' }
    ],
    parentPath: '/index'
  },
  '/index/position': {
    path: '/index/position',
    title: '岗位管理',
    breadcrumbs: [
      { title: '系统管理' },
      { title: '岗位管理', path: '/index/position' }
    ],
    parentPath: '/index'
  },
  '/index/about': {
    path: '/index/about',
    title: '关于',
    breadcrumbs: [
      { title: '关于', path: '/index/about' }
    ]
  },
  '/index/goods': {
    path: '/index/goods',
    title: '商品管理',
    breadcrumbs: [
      { title: '商品管理', path: '/index/goods' }
    ]
  },
  '/index/user': {
    path: '/index/user',
    title: '个人主页',
    breadcrumbs: [
      { title: '个人主页', path: '/index/user' }
    ]
  }
};

// 根据路径获取面包屑
export const getBreadcrumbByPath = (pathname: string): BreadcrumbItem[] => {
  const config = routeConfig[pathname];
  if (config) {
    return config.breadcrumbs;
  }
  
  // 如果没有找到精确匹配，尝试模糊匹配
  const matchedKey = Object.keys(routeConfig).find(key => 
    pathname.startsWith(key)
  );
  
  if (matchedKey) {
    return routeConfig[matchedKey].breadcrumbs;
  }
  
  // 默认面包屑
  return [{ title: '未知页面' }];
};

// 根据路径获取页面标题
export const getTitleByPath = (pathname: string): string => {
  const config = routeConfig[pathname];
  if (config) {
    return config.title;
  }
  
  // 如果没有找到精确匹配，尝试模糊匹配
  const matchedKey = Object.keys(routeConfig).find(key => 
    pathname.startsWith(key)
  );
  
  if (matchedKey) {
    return routeConfig[matchedKey].title;
  }
  
  return '未知页面';
};
