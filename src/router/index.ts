import { createBrowserRouter } from 'react-router-dom';
// import Home from '../pages/Home';
// import About from '../pages/About';
// import Goods from '../pages/goods';
// import Login from '@/pages/Login/login';
// import Unknow from '@/pages/404/index';
// import User from '@/pages/User/index';
// import UserList from '@/pages/User/List/index';
// import RoleManagement from '@/pages/role/index';
// import DepartmentManagement from '@/pages/department/index';
// import PositionManagement from '@/pages/position/index';
// import ParameterManagement from '@/pages/parameter/index';
// import AnnouncementManagement from '@/pages/announcement/index';
// import Build from '@/pages/tool/build/index';
// import OnlineUserManagement from '@/pages/monitor/online/index';
// import JobManagement from '@/pages/monitor/job/index';
// import CacheManagement from '@/pages/monitor/cache/index';
// import MenuManagement from '@/pages/menu/index';
// import DictManagement from '@/pages/dict/index';
// import OperLogManagement from '@/pages/log/operlog/index';
// import LoginInforManagement from '@/pages/log/logininfor/index';
import ProtectedLayout from '@/components/ProtectedLayout';
import RedirectToHome from '@/components/RedirectToHome';
import RedirectToIndexHome from '@/components/RedirectToIndexHome';
import { lazy } from 'react';

const Home = lazy(() => import('../pages/Home'));
const About = lazy(() => import('../pages/About'));
const Goods = lazy(() => import('../pages/goods'));
const Login = lazy(() => import('@/pages/Login/login'));
const Unknow = lazy(() => import('@/pages/404/index'));
const User = lazy(() => import('@/pages/User/index'));
const UserList = lazy(() => import('@/pages/User/List/index'));
const RoleManagement = lazy(() => import('@/pages/role/index'));
const DepartmentManagement = lazy(() => import('@/pages/department/index'));
const PositionManagement = lazy(() => import('@/pages/position/index'));
const ParameterManagement = lazy(() => import('@/pages/parameter/index'));
const AnnouncementManagement = lazy(() => import('@/pages/announcement/index'));
const Build = lazy(() => import('@/pages/tool/build/index'));
const OnlineUserManagement = lazy(() => import('@/pages/monitor/online/index'));
const JobManagement = lazy(() => import('@/pages/monitor/job/index'));
const CacheManagement = lazy(() => import('@/pages/monitor/cache/index'));
const MenuManagement = lazy(() => import('@/pages/menu/index'));
const DictManagement = lazy(() => import('@/pages/dict/index'));
const OperLogManagement = lazy(() => import('@/pages/log/operlog/index'));
const LoginInforManagement = lazy(() => import('@/pages/log/logininfor/index'));

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
            },
            {
                path: 'monitor/cache',
                Component: CacheManagement,
            },
            {
                path: 'menu',
                Component: MenuManagement,
            },
            {
                path: 'dict',
                Component: DictManagement,
            },
            {
                path: 'log/operlog',
                Component: OperLogManagement,
            },
            {
                path: 'log/logininfor',
                Component: LoginInforManagement,
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
