import { Button, Form, Input } from "antd";
import React, { useState, useEffect } from "react";
import { login, register, getCaptcha } from "@/api/user/user";
import type { LoginRequest, RegisterRequest } from "@/api/user/user.type";
import styles from "./login.module.scss";
import { useNavigate } from 'react-router-dom';

type FieldType = {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
};

const Login = () => {
  const navigate = useNavigate();
  // rules
  const nameRules = [
    {
      required: true,
      message: "请输入用户名!",
    },
  ];
  const passwordRules = [
    {
      required: true,
      message: "请输入密码!",
    },
  ];

  //表单内容
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>("");
  const [email, setEmail] = useState("");
  const [isResigter, setIsResigter] = useState(false);

  // 验证信息
  const [captchaInfoSvg, setCaptchaInfoSvg] = useState<string>("");
  const [captchaId, setCaptchaId] = useState<string>("");

  const save = async () => {
    try {
      if (isResigter) {
        // 注册请求
        const data: RegisterRequest = {
          username,
          password,
          email,
          captchaId: captchaId || '',
          captchaCode: captcha || '',
        };
        const res = await register(data);
        console.log("res", res);
        if (res.code === 200) {
          localStorage.setItem("token", res.data.token || '');
          localStorage.setItem("userId", String(res.data.id));
          navigate("/index/home");
        } else {
          console.log("message", res.message);
          // 注册失败后刷新验证码
          getCaptchaInfo();
        }
      } else {
        // 登录请求
        const data: LoginRequest = {
          username,
          password,
          captchaId: captchaId || '',
          captchaCode: captcha || '',
        };
        const res = await login(data);
        console.log("res", res);
        if (res.code === 200) {
          localStorage.setItem("token", res.data.token || '');
          localStorage.setItem("userId", String(res.data.id));
          navigate("/index/home");
        } else {
          console.log("message", res.message);
          // 登录失败后刷新验证码
          getCaptchaInfo();
        }
      }
    } catch (e) {
      console.log("err", e);
      // 出错后也刷新验证码
      getCaptchaInfo();
    }
  };

  const getCaptchaInfo = async () => {
    try {
        const res = await getCaptcha();
        if (res.code === 200) {
          // 将SVG字符串转换为Data URL格式
          const svgDataUrl = `data:image/svg+xml;base64,${btoa(res.data?.captchaSvg || '')}`;
          setCaptchaInfoSvg(svgDataUrl);
          setCaptchaId(res.data?.captchaId);
        } else {
          console.log("message", res.message);
        }
    } catch (e) {
      console.log("err", e);
    }
  };

  useEffect(() => {
    getCaptchaInfo();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.bgWrap}></div>
      <div className={styles.formWrap}>
        <Form
          className={styles.formContainer}
          layout="vertical"
          initialValues={{username: '', password: ''}}
        >
          <p className={styles.formTitle}>{isResigter ? "注册" : "登录"}</p>
          <Form.Item<FieldType>
            label="用户名"
            name="username"
            rules={nameRules}
          >
            <Input
              placeholder="请输入用户名或邮箱"
              value={username}
              style={{width: '250px'}}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="password"
            rules={passwordRules}
          >
            <Input
              placeholder="请输入密码"
              value={password}
              style={{width: '250px'}}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
          </Form.Item>

          {isResigter && (
            <Form.Item<FieldType> label="邮箱" name="email">
              <Input
                placeholder="请输入邮箱"
                value={email}
                style={{width: '250px'}}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(e.target.value)
                }
              />
            </Form.Item>
          )}
          {captchaId && (
            <Form.Item<FieldType> label="验证码">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                  placeholder="请输入验证码"
                  value={captcha}
                  style={{ width: '150px' }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCaptcha(e.target.value)
                  }
                />
                <img 
                  src={captchaInfoSvg} 
                  alt="验证码" 
                  style={{ 
                    cursor: 'pointer', 
                    border: '1px solid #d9d9d9', 
                    borderRadius: '4px',
                    height: '32px'
                  }}
                  onClick={getCaptchaInfo}
                  title="点击刷新验证码"
                />
              </div>
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" block onClick={save}>{isResigter ? "注册" : "登录"}</Button>
          </Form.Item>
          <div className={styles.formFooter}>
            {isResigter ? "已有账号？" : "还没有账号？"}
            <span
              className={styles.formFooterTips}
              onClick={() => setIsResigter(!isResigter)}
            >
              {isResigter ? "登录" : "注册用户"}
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
