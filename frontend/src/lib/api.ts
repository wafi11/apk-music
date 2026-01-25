import axios, { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  API_RESPONSE,
  ApiError,
  BackendResponse,
  RequestConfig,
} from "./types";

export class Api {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        // Authorization: `Bearer ${authStore.getAccessToken()}`,
        "Content-Type": "application/json",
        Branchname: process.env.NEXT_PUBLIC_BRANCH_NAME,
        Branchcode: process.env.NEXT_PUBLIC_BRANCH_CODE,
      },
    });

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return {
          ...response,
          data: {
            data: response.data,
            status: response.status,
            message: response.data.message,
          },
        };
      },
      async (error: AxiosError) => {
        if (error.response) {
          const errorData = error.response.data as BackendResponse<any>;
          throw {
            code: error.response.status,
            message: errorData.message || error.message,
            error: errorData.error,
            success: false,
          } as ApiError;
        } else if (error.request) {
          throw {
            code: 0,
            message: "Network error - no response received",
            error: error.message,
            success: false,
          } as ApiError;
        } else {
          throw {
            code: -1,
            message: error.message,
            error: error.message,
            success: false,
          } as ApiError;
        }
      },
    );
  }

  private formatData(data: unknown, isMultipart: boolean = false): unknown {
    if (!isMultipart) return data;

    const formData = new FormData();
    if (data && typeof data === "object") {
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (item instanceof File) {
              formData.append(`${key}[${index}]`, item);
            } else {
              formData.append(`${key}[${index}]`, String(item));
            }
          });
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
    }
    return formData;
  }

  private getHeaders(config?: RequestConfig) {
    if (config?.isMultipart) {
      return {
        ...config?.headers,
      };
    }

    return {
      "Content-Type": "application/json",
      ...config?.headers,
    };
  }

  async get<T>(url: string, config?: RequestConfig): Promise<API_RESPONSE<T>> {
    try {
      const response = await this.instance.get(url, {
        headers: this.getHeaders(config),
      });

      return response.data as API_RESPONSE<T>;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<API_RESPONSE<T>> {
    try {
      const formattedData =
        data instanceof FormData
          ? data
          : this.formatData(data, config?.isMultipart);

      const response = await this.instance.post(url, formattedData, {
        headers: this.getHeaders(config),
      });

      return response.data as API_RESPONSE<T>;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<API_RESPONSE<T>> {
    try {
      const formattedData =
        data instanceof FormData
          ? data
          : this.formatData(data, config?.isMultipart);

      const response = await this.instance.put(url, formattedData, {
        headers: this.getHeaders(config),
      });

      return response.data as API_RESPONSE<T>;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  async patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<API_RESPONSE<T>> {
    try {
      const formattedData = this.formatData(data, config?.isMultipart);
      const response = await this.instance.patch(url, formattedData, {
        headers: this.getHeaders(config),
      });

      return response.data as API_RESPONSE<T>;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  async delete<T>(
    url: string,
    config?: RequestConfig,
  ): Promise<API_RESPONSE<T>> {
    try {
      const response = await this.instance.delete(url, {
        headers: this.getHeaders(config),
      });

      return response.data as API_RESPONSE<T>;
    } catch (error) {
      throw this.handleError(error as ApiError);
    }
  }

  private handleError(error: ApiError): ApiError {
    return {
      code: error.code || -1,
      message: error.message || "Unknown error occurred",
      success: false,
      error: error.error || error.message,
    };
  }
}

export const api = new Api();
