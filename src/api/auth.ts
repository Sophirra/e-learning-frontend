import api, { setAccessToken } from "./api";
import type {
  RegisterUserDto,
  LoginUserDto,
  AuthResponse,
  aboutUser,
} from "./types";

export let registerUser = async (userData: RegisterUserDto): Promise<void> => {
  await api.post<void>("/api/security/register", userData);
};

//get access token - roles are passed in access token
export let loginUser = async (
  userData: LoginUserDto,
): Promise<AuthResponse> => {
  let res = await api.post<AuthResponse>("/api/security/login", userData);
  setAccessToken(res.data.accessToken);
  return res.data;
};

//calling logout so backend will clear refresh token from browser
export let logoutUser = async (): Promise<void> => {
  await api.post("/api/security/logout");
  setAccessToken(null);
};

//might be optional since api wrapper already refreshes when access is denied
export let refreshToken = async (): Promise<AuthResponse> => {
  let res = await api.post<AuthResponse>("/api/security/refresh");
  setAccessToken(res.data.accessToken);
  return res.data;
};

//get info about user
export let aboutMe = async (): Promise<aboutUser> => {
  let res = await api.get<aboutUser>("/api/users/aboutMe");
  return res.data;
};
