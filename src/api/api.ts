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

/**
 * Extracts the user ID (GUID) from the stored access token.
 *
 * The method safely decodes the JWT, retrieves the `nameid` claim,
 * and additionally validates whether the extracted value is a valid GUID format.
 *
 * @returns {string | null} The user ID if present and valid, otherwise null.
 */

export function getUserId(): string | null {
  try {
    if (!accessToken) return null;

    const decoded = jwtDecode<JwtPayload>(accessToken);
    if (decoded?.nameid && /^[0-9a-fA-F-]{36}$/.test(decoded.nameid)) {
      return decoded.nameid;
    }
    return null;
  } catch (err) {
    console.error("Failed to decode user ID from token:", err);
    return null;
  }
}

export default api;
