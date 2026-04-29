import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { store } from "@/store/store";
import { logoutUser, setAccessToken } from "@/features/auth/authSlice";

export const API_BASE_URL = "https://enbackend.ampecportal.com/api";

type ApiErrorResponse = {
  status: "error";
  message: string;
  code: number;
  errors: unknown;
};

type RefreshResponse = {
  status: "success";
  message: string;
  code: number;
  results: {
    access: string;
  };
};

type RetryConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiKit = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiKit.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiKit.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as RetryConfig;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.getState().auth.refreshToken
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = store.getState().auth.refreshToken;

        const refreshResponse = await axios.post<RefreshResponse>(
          `${API_BASE_URL}/auth/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const newAccessToken = refreshResponse.data.results.access;

        store.dispatch(setAccessToken(newAccessToken));

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiKit(originalRequest);
      } catch {
        store.dispatch(logoutUser());

        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  return "Something went wrong";
}