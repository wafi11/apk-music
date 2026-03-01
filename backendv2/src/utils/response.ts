import { Context } from "hono";

export function SuccessResponse(
  c: Context,
  message: string,
  status: number,
  data?: any,
) {
  return c.json({
    message,
    status,
    data,
  });
}

export function ErrorResponse(
  c: Context,
  message: string,
  code: number,
  error?: string,
) {
  return c.json({
    code,
    message,
    error,
  });
}

export interface ErrorResponse {
  code: number;
  error: string;
  message?: string;
}

export type ApiResponse<T> = {
  message: string;
  status: number;
  data: T;
};

export type ApiPagination<T> = {
  data: {
    data: T;
    meta: PaginationResponse;
  };
  message: string;
  statusCode: number;
};

export type PaginationResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type CountResponse = {
  count: number;
};

export interface PaginationParams {
  limit?: string;
  page?: string;
}

export type CursorPagination<T> = {
  data: T;
  metadata: PaginationCursor;
};

export interface PaginationCursor {
  nextCursor?: string | null;
  hasMore: boolean;
  count: number;
}
export type CursorRequest = {
  search?: string;
  cursor?: string;
};
