export class ApiResponse<T> {
    constructor(
        public data: T | [] | null,
        public statusCode: number,
        public message: string,
    ) {}
}

export const STATUS_CODE = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    AUTHORIZED: 401,
    FORBIDDEN: 403,
    INTERNAL_SERVER_ERROR: 500,
}