import axios from "axios";
import { jwtDecode } from "jwt-decode";

let api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    ContentType: "application/json",
  },
  withCredentials: true,
});

//storing access token in RAM
let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

//adding access token to all request going through
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//refreshing token when expired
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    let original = err.config;
    if (err.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      try {
        let res = await api.post("/api/security/refresh"); //refresh token doklejany przez cookies(?)
        setAccessToken(res.data.accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (e) {
        setAccessToken(null);
        console.error(e);
      }
    }
    return Promise.reject(err);
  },
);

interface JwtPayload {
  unique_name: string;
  nameid: string;
  roles: string[];
  nbf: number;
  exp: number;
  iat: number;
}

//additional method to get roles from access token
export function getRoles() {
  if (!accessToken) return { student: false, teacher: false };
  let decoded = jwtDecode<JwtPayload>(accessToken);
  return {
    student: decoded?.roles.includes("student"),
    teacher: decoded?.roles.includes("teacher"),
  };
}

export default api;
