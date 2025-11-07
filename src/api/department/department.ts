import service from "../request";
import type { ApiResponse, CerateDepartmentRequest, CerateDepartmentResponse, DepartmentListResponse, DepartmentListRequest } from "./department.type";

/**
 * 创建部门
 */
export const createDepartment = (data: CerateDepartmentRequest): Promise<ApiResponse<CerateDepartmentResponse>> => {
    return service.post('/department/create', data);
}

/**
 * 获取部门列表
 */
export const getDepartmentList = (data: DepartmentListRequest): Promise<ApiResponse<DepartmentListResponse>> => {
    return service.get('/department/list', { params: data });
}