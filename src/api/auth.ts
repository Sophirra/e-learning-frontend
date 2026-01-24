import api, { setAccessToken } from "./api";
import type {
  RegisterUserDto,
  LoginUserDto,
  AuthResponse,
  aboutUser,
} from "../types.ts";
import { clearPersistedRole } from "@/lib/user/RolePersistence.ts";

export const registerUser = async (
  userData: RegisterUserDto,
): Promise<void> => {
  await api.post<void>("/api/security/register", userData);
};

//get access token - roles are passed in access token
export const loginUser = async (
  userData: LoginUserDto,
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/security/login", userData);
  setAccessToken(res.data.accessToken);
  return res.data;
};

//calling logout so backend will clear refresh token from browser
export const logoutUser = async (): Promise<void> => {
  await api.post("/api/security/logout");
  setAccessToken(null);
  clearPersistedRole();
};

//might be optional since api wrapper already refreshes when access is denied
export const refreshToken = async (): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>("/api/security/refresh");
  setAccessToken(res.data.accessToken);
  return res.data;
};

//get information about the user
export const aboutMe = async (): Promise<aboutUser> => {
  const res = await api.get<aboutUser>("/api/users/aboutMe");
  return res.data;
};
