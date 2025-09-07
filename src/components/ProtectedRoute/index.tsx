import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTabStore } from '@/store/tabs';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { clearTabs } = useTabStore();

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = () => {
      // 检查localStorage中的登录信息
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
      
      // 如果没有登录信息，清除标签并重定向到登录页
      if (!userId || !token) {
        clearTabs();
        navigate('/login', { replace: true });
        return false;
      }
      
      return true;
    };

    checkAuth();
  }, [navigate, clearTabs]);

  // 再次检查登录状态
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  if (!userId || !token) {
    return null; // 或者显示加载状态
  }

  return <>{children}</>;
};

export default ProtectedRoute;
