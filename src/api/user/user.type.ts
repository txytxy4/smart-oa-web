// 用户登录请求参数
export interface LoginRequest {
    username: string;
    password: string;
    captchaId: string;
    captchaCode: string;
}

// 用户注册请求参数
export interface RegisterRequest {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    captchaId?: string;
    captchaCode?: string;
}

// 用户信息
export interface UserInfo {
    id?: number;
    username?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    avatar?: string;
    avatarUrl?: string;
    role?: string;
    status?: number;
    createTime?: string;
    updateTime?: string;
    token?: string;
    profile?: object;
    points?: string;
    address?: string;
}

export interface UserList {
    list: UserInfo[];
    pagination: {
        total: number;
        page: number;
        pageSize: number;
    }
}

export interface UploadInfo {
    filename?: string,
    originalname?: string,
    path?: string
}

// 登录响应数据
export interface LoginResponse {
    message: string;
    data: UserInfo;
    code: number;
}

// 注册响应数据
export interface RegisterResponse {
    message: string;
    data: UserInfo;
    code: number;
}

// 获取用户信息响应
export interface GetUserInfoResponse {
    message: string;
    data: UserInfo;
    code: number;
}

export interface UserListResponse {
    message: string;
    data: UserList;
    code: number;
}

// 更新用户信息请求参数
export interface UpdateUserRequest {
    id?: number;
    username?: string;
    nickname?: string;
    address?: string;
    role?: string;
    avatarUrl?: string;
    email?: string;
    phone?: string;
}

// 修改密码请求参数
export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}

export interface UploadAvatarResponse {
    filename?: string,
    originalname?: string,
    path?: string
}

// 通用API响应格式
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
}

// 分页请求参数
export interface PageRequest {
    page: number;
    pageSize: number;
    username?: string;
    phone?: string;
    role?: string;
    nickname?: string;
    email?: string;
}

// 分页响应数据
export interface PageResponse<T = unknown> {
    list: T[];
    total: number;
    page: number;
    pageSize: number;
}

// 验证信息
export interface CaptchaInfo {
    captchaSvg: string;
    captchaId: string;
}





