export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
}

export interface CerateDepartmentRequest {
    name: string;
    parentId?: number;
    order: number;
    lelvel: number;
    status: boolean;
}

export interface CerateDepartmentResponse {
    name: string;
    parentId?: number;
    order: number;
    lelvel: number;
    status: boolean;
}