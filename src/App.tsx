
import "./App.css";
import router from './router';
import { RouterProvider } from 'react-router';
import { useEffect } from 'react';
import { initTheme } from '@/store/theme';

function App() {
  useEffect(() => {
    // 初始化主题
    initTheme();
  }, []);
  
  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
