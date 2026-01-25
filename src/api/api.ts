import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { jwtDecode } from "jwt-decode";
import type { Role } from "@/features/user/user.ts";

// W trybie dev używaj pustego baseURL - ścieżki w apiCalls.ts już mają /api/
// Nginx przekieruje /api/* do backendu
const apiBaseURL = import.meta.env.DEV
    ? "http://localhost:5249"
    : (import.meta.env.VITE_API_URL || "");

console.log("API Base URL:", apiBaseURL, "VITE_API_URL:", import.meta.env.VITE_API_URL);

let api = axios.create({
    baseURL: apiBaseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

//storing access token in RAM
/**
 * The access token used for authentication and API requests is stored in RAM, set during the login.
 * It is a string that may be null if no authentication has been performed or the token is unavailable.
 */
let accessToken: string | null = null;

/**
 * Sets the access token for authentication or API requests.
 *
 * @param {string | null} token The access token to be set (or removed in case of null). .
 * @return {void}
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/**
 * A global flag indicating whether a refresh is currently in progress.
 */

let isRefreshing = false;

/**
 * Represents a queued API request that can be resolved or rejected at a later time.
 *
 * @property {Function} resolve - A function to call when the request is successfully fulfilled.
 * @property {Function} reject - A function to call when the request fails or is explicitly rejected.
 * @property {AxiosRequestConfig & { _retry?: boolean }} config - The configuration for the Axios request.
 *     Includes an optional `_retry` flag to indicate if the request is being retried.
 */
type QueuedRequest = {
  resolve: (val: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig & { _retry?: boolean };
};

/**
 * Queue of requests waiting for refresh to complete.
 */
let queue: QueuedRequest[] = [];

// Put a failed (401) request into the queue.
// Resolves by re-sending the request after refresh, or rejects if refresh fails.
/**
 * Put a failed (401) request into the queue.
 * Resolves by re-sending the request after refresh, or rejects if refresh fails.
 *
 * @param {AxiosRequestConfig & { _retry?: boolean }} config - The Axios request configuration.
 * @return {Promise} A promise that resolves when the request is processed.
 */
function enqueueRequest(
  config: AxiosRequestConfig & { _retry?: boolean },
): Promise<any> {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject, config });
  });
}

// Replay all queued requests after a successful refresh.
// Note: Authorization header will be injected by the request interceptor with the latest token.
/**
 *
 * Replay all queued requests after a successful refresh.
 * Note: Authorization header will be injected by the request interceptor with the latest token.
 *
 * @return {void} This method does not return a value.
 */
function replayQueuedRequests(): void {
  const q = [...queue];
  queue = [];
  q.forEach(({ resolve, config }) => resolve(api(config)));
}

/**
 * Rejects all requests in the queue if the refresh fails.
 *
 * @param {any} err - The error to reject the queued requests with.
 * @return {void} No value is returned by this method.
 */
function rejectQueuedRequests(err: any): void {
  const q = [...queue];
  queue = [];
  q.forEach(({ reject }) => reject(err));
}

// Separate client for refresh (no interceptors) to avoid refresh loops.
/**
 * Separate client for refresh (no interceptors) to avoid refresh loops.
 */
const refreshClient = axios.create({
    baseURL: apiBaseURL,
    withCredentials: true,
});

/**
 * Perform the actual refresh call; store the new access token in RAM.
 *
 * @throws {Error} If the refresh response does not contain an access token.
 * @return {Promise<void>} Resolves when the access token is successfully updated.
 */
async function doRefresh(): Promise<void> {
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
    const original = err.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
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
  },
);

/**
 * Represents the payload of a JSON Web Token (JWT).
 *
 * Properties:
 * - `unique_name`: A unique identifier for the user.
 * - `nameid`: A secondary identifier for the user, often used for lookup or reference.
 * - `roles`: An array of roles assigned to the user.
 * - `nbf`: The "Not Before" timestamp, in seconds since Unix epoch, indicating when the token becomes valid.
 * - `exp`: The "Expiration" timestamp, in seconds since Unix epoch, indicating when the token expires.
 * - `iat`: The "Issued At" timestamp, in seconds since Unix epoch, indicating when the token was created.
 */
interface JwtPayload {
    unique_name: string;
    nameid: string;
    roles: string[];
    nbf: number;
    exp: number;
    iat: number;
}

/**
 * Additional method to get roles from the access token.
 *
 * @return {Role[]} An array of roles extracted from the JWT token. Returns an empty array if no access token is present.
 */
export function getRoles(): Role[] {
  if (!accessToken) return [];
  const decoded = jwtDecode<JwtPayload>(accessToken);
  const output: Role[] = [];
  decoded.roles.forEach((role) => {
    output.push(role as Role);
  });
  return output;
}

/**
 * Extracts and returns the user ID from the provided access token.
 *
 * @return {string | null} The user ID as a string
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
