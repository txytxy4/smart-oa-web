import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// // 定义响应格式接口
// interface ApiResponse<T = unknown> {
//   code: number;
//   message: string;
//   data: T;
// }

// 扩展配置类型以支持metadata
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime: Date;
  };
}

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.104:3001', // 修正baseURL
  timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});

// 请求拦截器
service.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    // 添加请求时间戳，用于调试
    config.metadata = { startTime: new Date() };
    
    // 获取并添加token
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 添加请求ID，用于追踪
    config.headers['X-Request-ID'] = Date.now().toString();
    
    // 打印请求信息（开发环境）
    // if (import.meta.env.DEV) {
    //   console.log('域名', import.meta.env.VITE_API_BASE_URL);
    //   console.log('🚀 发送请求:', {
    //     url: config.url,
    //     method: config.method?.toUpperCase(),
    //     data: config.data,
    //     params: config.params
    //   });
    // }
    
    return config;
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    const config = response.config as CustomAxiosRequestConfig;
    
    // 计算请求耗时
    if (config.metadata?.startTime) {
      const endTime = new Date();
      const duration = endTime.getTime() - config.metadata.startTime.getTime();
      console.log(`⏱️ 请求耗时: ${duration}ms`);
    }
    
    // 打印响应信息（开发环境）
    if (import.meta.env.DEV) {
      console.log('✅ 收到响应:', {
        url: config.url,
        status: response.status,
        data: res
      });
    }
    
    // 处理业务状态码
    if (res.code !== 200) {
      // 统一错误处理
      const errorMessage = res.message || '请求失败';
      console.error('❌ 业务错误:', errorMessage);
      
      // 特殊状态码处理
      if (res.code === 401) {
        // token过期，清除本地存储并跳转到登录页
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      return Promise.reject(new Error(errorMessage));
    }
    console.log('response', response);
    

    return res
  },
  (error) => {
    // 网络错误处理
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;
      console.error(`❌ HTTP错误 ${status}:`, data);
      
      switch (status) {
        case 401:
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          console.error('权限不足');
          break;
        case 404:
          console.error('请求的资源不存在');
          break;
        case 500:
          console.error('服务器内部错误');
          break;
        default:
          console.error(`未知错误: ${status}`);
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('❌ 网络错误: 无法连接到服务器');
    } else {
      // 请求配置有误
      console.error('❌ 请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default service;
