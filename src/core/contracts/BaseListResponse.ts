interface BaseListResponse<T> {
    items: T[];
    totalPages: number;
    totalItems: number;
    page: number;
    pageSize: number;
}

export default BaseListResponse;
