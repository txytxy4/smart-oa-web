import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 检查用户登录状态
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    
    if (userId && token) {
      // 已登录，重定向到首页
      navigate('/index/home', { replace: true });
    } else {
      // 未登录，重定向到登录页
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // 显示加载状态或者空内容
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>
      正在跳转...
    </div>
  );
};

export default RedirectToHome;
