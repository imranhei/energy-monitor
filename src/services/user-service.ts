import { apiKit } from "@/lib/api-kit";
import type { Role, User } from "@/types";

export type UserPayload = {
  email: string;
  password?: string;
  full_name: string;
  role: Role;
};

type UserResponse = {
  status: "success";
  message: string;
  code: number;
  results: User;
};

type UserListResponse = {
  status: "success";
  message: string;
  code: number;
  results: User[];
};

type DeleteUserResponse = {
  status: "success";
  message: string;
  code: number;
  results: null;
};

export const userService = {
  create: (payload: Required<UserPayload>) =>
    apiKit.post<UserResponse>("/auth/users/", payload),

  list: () => apiKit.get<UserListResponse>("/auth/users/"),

  update: (id: number, payload: UserPayload) =>
    apiKit.patch<UserResponse>(`/auth/users/${id}/`, payload),

  delete: (id: number) =>
    apiKit.delete<DeleteUserResponse>(`/auth/users/${id}/`),
};
