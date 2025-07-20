import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Layout from '../layout';
import Goods from '../pages/goods';
import Login from '@/pages/Login/login';
import Unknow from '@/pages/404/index';
import User from '@/pages/User/index';
import UserList from '@/pages/User/List/index';

const router = createBrowserRouter([
    {
        path: '/index',
        Component: Layout, // 父路由
        children: [
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
