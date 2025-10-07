import service from "../request";
import type {
    LoginRequest,
    LoginResponse,
    RegisterRequest,
    RegisterResponse,
    UserInfo,
    GetUserInfoResponse,
    UpdateUserRequest,
    ChangePasswordRequest,
    ApiResponse,
    PageRequest,
    UserListResponse,
    UploadAvatarResponse,
    CaptchaInfo
} from "./user.type";

/**
 * 用户登录
 * @param data 登录参数
 * @returns Promise<LoginResponse>
 */
export const login = (data: LoginRequest): Promise<LoginResponse> => {
    return service.post('/user/login', data);
};

/**
 * 用户注册
 * @param data 注册参数
 * @returns Promise<RegisterResponse>
 */
export const register = (data: RegisterRequest): Promise<RegisterResponse> => {
    return service.post('/user/create', data);
};

/**
 * 获取用户信息
 * @returns Promise<GetUserInfoResponse>
 */
export const getUserInfo = (id: string | number): Promise<GetUserInfoResponse> => {
    return service.get('/user/info?id=' + id);
};

/**
 * 更新用户信息
 * @param data 更新参数
 * @returns Promise<ApiResponse<UserInfo>>
 */
export const updateUserInfo = (data: UpdateUserRequest): Promise<ApiResponse<UserInfo>> => {
    return service.post('/user/edit', data);
};

/**
 * 上传头像
 * @param data 更新参数
 * @returns Promise<ApiResponse<UserInfo>>
 */
export const uploadAvatar = (data:FormData) :Promise<ApiResponse<UploadAvatarResponse>> => {
    return service.post('/upload/single', data)
}

/**
 * 修改密码
 * @param data 密码参数
 * @returns Promise<ApiResponse<string>>
 */
export const changePassword = (data: ChangePasswordRequest): Promise<ApiResponse<string>> => {
    return service.put('/user/password', data);
};

/**
 * 用户登出
 * @returns Promise<ApiResponse<string>>
 */
export const logout = (): Promise<ApiResponse<string>> => {
    return service.post('/user/logout');
};

/**
 * 获取用户列表（管理员功能）
 * @param params 分页参数
 * @returns Promise<PageResponse<UserInfo>>
 */
export const getUserList = (params: PageRequest): Promise<UserListResponse> => {
    return service.get('/user/list', { params });
};

/**
 * 删除用户（管理员功能）
 * @param userId 用户ID
 * @returns Promise<ApiResponse<string>>
 */
export const deleteUser = (userId: number): Promise<ApiResponse<string>> => {
    return service.delete(`/user/${userId}`);
};

/**
 * 重置用户密码（管理员功能）
 * @param userId 用户ID
 * @returns Promise<ApiResponse<string>>
 */
export const resetUserPassword = (userId: number): Promise<ApiResponse<string>> => {
    return service.post(`/user/${userId}/reset-password`);
};

/**
 * 获取登录验证信息
 */

export const getCaptcha = (): Promise<ApiResponse<CaptchaInfo>> => {
    return service.get('/captcha/generate');
};