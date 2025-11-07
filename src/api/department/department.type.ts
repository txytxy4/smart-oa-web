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

export interface DepartmentListRequest {
    page: number;
    pageSize: number;
    name?: string;
    status?: boolean;
    startTime?: string;
    endTime?: string;
}

export interface DepartmentInfo {
    id: number;
    name: string;
    parentId: number;
    order: number;
    level: number;
    status: boolean;
    createTime?: string;
    children?: DepartmentInfo[];
    user?: unknown;
    parent?: unknown;
}

export interface DepartmentListResponse {
    list: DepartmentInfo[];
    total: number;
    page: number;
    pageSize: number;
}