import axios, {type AxiosError, type AxiosRequestConfig} from "axios";
import { jwtDecode } from "jwt-decode";
import type { Role } from "@/features/user/user.ts";

let api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

//storing access token in RAM
let accessToken: string | null = null;
export function setAccessToken(token: string | null) {
  accessToken = token;
}

/**
 * There was a problem with logging out a user which was caused by multiple parallel refresh attempts
 * after rapid page reloads. Each request tried to use the same (now-rotated) refresh token, so only the first
 * succeeded while the others failed with "invalid/expired" and triggered a logout. Additionally, the client
 * was manually retrying requests without coordinating refresh, creating a race condition. We fixed it by implementing
 * a single-flight refresh (one refresh at a time), queuing pending requests during refresh, and replaying them once
 * a new access token is issued. The refresh call uses a separate axios instance (no interceptors) and the server
 * always sets the new refresh token cookie on successful refresh.
 */

// Global flag to unsure that only one refresh runs at a time.
let isRefreshing = false;


// We keep the original request configuration and promise handlers so that after
// a successful refresh, we can repeat the suspended requests with a new access token.
type QueuedRequest = {
    resolve: (val: unknown) => void;
    reject: (reason?: any) => void;
    config: AxiosRequestConfig & { _retry?: boolean };
};

// Queue of requests waiting for refresh to complete.
let queue: QueuedRequest[] = [];


// Put a failed (401) request into the queue.
// Resolves by re-sending the request after refresh, or rejects if refresh fails.
function enqueueRequest(config: AxiosRequestConfig & { _retry?: boolean }) {
    return new Promise((resolve, reject) => {
        queue.push({ resolve, reject, config });
    });
}

// Replay all queued requests after a successful refresh.
// Note: Authorization header will be injected by the request interceptor with the latest token.
function replayQueuedRequests() {
    const q = [...queue]; queue = [];
    q.forEach(({ resolve, config }) => resolve(api(config)));
}

// Reject all queued requests if refresh fails.
function rejectQueuedRequests(err: any) {
    const q = [...queue]; queue = [];
    q.forEach(({ reject }) => reject(err));
}

// Separate client for refresh (no interceptors) to avoid refresh loops.
const refreshClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});


// Perform the actual refresh call; store the new access token in RAM.
// Important: use refreshClient (no interceptors) to prevent recursion.
async function doRefresh() {
    const res = await refreshClient.post("/api/security/refresh", null);
    const newAT = res?.data?.accessToken as string | undefined;
    if (!newAT) throw new Error("No accessToken in refresh response.");
    setAccessToken(newAT);
}

// --- Interceptors ---

//adding access token to all request going through
api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers = config.headers ?? {};
        (config.headers as any).Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

//refreshing token when expired
api.interceptors.response.use(
    (res) => res,
    async (err: AxiosError) => {
        const original = err.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
        const status = err.response?.status;

        if (!original || !status) return Promise.reject(err);

        if (status === 401 && !original._retry) {
            original._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await doRefresh();
                    replayQueuedRequests();
                } catch (e) {
                    setAccessToken(null);
                    rejectQueuedRequests(e);
                } finally {
                    isRefreshing = false;
                }
            }

            // Suspend this request until refresh finishes.
            return enqueueRequest(original);
        }

        return Promise.reject(err);
    }
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
  if (!accessToken) return [];
  let decoded = jwtDecode<JwtPayload>(accessToken);
  let output: Role[] = [];
  decoded.roles.forEach((role) => {
    output.push(role as Role);
  });
  return output;
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
