import service from "../request";
import type { ApiResponse, CerateDepartmentRequest, CerateDepartmentResponse } from "./department.type";

/**
 * 创建部门
 */
export const createDepartment = (data: CerateDepartmentRequest): Promise<ApiResponse<CerateDepartmentResponse>> => {
    return service.post('/department/create', data);
}