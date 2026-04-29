import { apiKit } from "@/lib/api-kit";
import type { Role, User } from "@/types";

export type CreateUserPayload = {
  email: string;
  password: string;
  full_name: string;
  role: Role;
};

type CreateUserResponse = {
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

export const userService = {
  create: (payload: CreateUserPayload) =>
    apiKit.post<CreateUserResponse>("/auth/register/", payload),

  list: () => apiKit.get<UserListResponse>("/auth/users/"),
};