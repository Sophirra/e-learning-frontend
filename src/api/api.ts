import axios from "axios";

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
        console.error(e);
      }
    }
    return Promise.reject(err);
  },
);

export default api;
