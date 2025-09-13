import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Goods from '../pages/goods';
import Login from '@/pages/Login/login';
import Unknow from '@/pages/404/index';
import User from '@/pages/User/index';
import UserList from '@/pages/User/List/index';
import RoleManagement from '@/pages/role/index';
import DepartmentManagement from '@/pages/department/index';
import PositionManagement from '@/pages/position/index';
import ParameterManagement from '@/pages/parameter/index';
import AnnouncementManagement from '@/pages/announcement/index';
import Build from '@/pages/tool/build/index';
import OnlineUserManagement from '@/pages/monitor/online/index';
import JobManagement from '@/pages/monitor/job/index';
import ProtectedLayout from '@/components/ProtectedLayout';
import RedirectToHome from '@/components/RedirectToHome';
import RedirectToIndexHome from '@/components/RedirectToIndexHome';

const router = createBrowserRouter([
    {
        path: '/',
        Component: RedirectToHome, // 根路径重定向
    },
    {
        path: '/index',
        Component: ProtectedLayout,
        children: [
            {
                index: true, // 默认路由
                Component: RedirectToIndexHome
            },
            {
                path: 'home',
                Component: Home, // 子路由
            },
            {
                path: 'about',
                Component: About, // 子路由
            },
            {
                path: 'goods',
                Component: Goods,
            },
            {
                path: 'user',
                Component: User,
            },
            {
                path: 'userList',
                Component: UserList,
            },
            {
                path: 'role',
                Component: RoleManagement,
            },
            {
                path: 'department',
                Component: DepartmentManagement,
            },
            {
                path: 'position',
                Component: PositionManagement,
            },
            {
                path: 'parameter',
                Component: ParameterManagement,
            },
            {
                path: 'announcement',
                Component: AnnouncementManagement,
            },
            {
                path: 'tool/build',
                Component: Build,
            },
            {
                path: 'monitor/online',
                Component: OnlineUserManagement,
            },
            {
                path: 'monitor/job',
                Component: JobManagement,
            }
        ]
    },
    {
        path: '/login',
        Component: Login
    },
    {
        path: '*',
        Component: Unknow
    }
]);

export default router;
