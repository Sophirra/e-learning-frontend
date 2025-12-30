import type {
  FileBrief,
  FileData,
  FileFilter,
  FileOwner,
  FileTag,
  PagedResult,
} from "@/types.ts";
import Api, {getUserId} from "@/api/api.ts";
import type {ErrorResponse} from "react-router-dom";

/**
 * Uploads a file for the currently authenticated user.
 *
 * The API endpoint `/api/user/files` accepts a multipart/form-data POST request
 * containing the file to be uploaded. The backend associates the file with the
 * authenticated user (based on their JWT identity) and stores it under `/uploads/users/{userId}/files/`.
 *
 * Request body (multipart/form-data):
 * - `file`   the file to upload.


 * @param {File} file - The file object selected by the user (from an `<input type="file">`).
 * @returns {Promise<any>} Resolves with the uploaded file metadata returned by the backend.
 */
export const uploadUserFile = async (file: File): Promise<FileBrief> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await Api.post("/api/user/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (response.status === 201 || response.status === 200)
    return response.data as FileBrief;
  else throw response.data as ErrorResponse;
};
/**
 * Fetches a filtered list of files from the backend.
 *
 * Supports multiple optional filters. Each provided filter
 * will be converted into a query parameter and appended to the request URL.
 * ```
 *
 * @param filters - Optional filtering parameters.
 * @returns Promise resolving to an array of Course objects.
 */
export const getFiles = async (
  filter?: FileFilter,
): Promise<PagedResult<FileData>> => {
  const params = new URLSearchParams();
  if (filter?.studentId) params.append("studentId", filter.studentId);
  if (filter?.courseId) params.append("courseId", filter.courseId);

  filter?.createdBy?.forEach((id) => params.append("createdBy", id));
  filter?.type?.forEach((t) => params.append("types", t));
  filter?.tagIds?.forEach((id) => params.append("tags", id));

  if (filter?.page) params.append("page", String(filter.page));
  if (filter?.pageSize) params.append("pageSize", String(filter.pageSize));

  const res = await Api.get<PagedResult<FileData>>(
    `/api/user/files?${params.toString()}`,
  );

  return res.data;
};

/**
 * Updates the file data in the database.
 * @param fileId id of the file to update
 * @param data new file name and tags
 */
export async function updateFileData(
  fileId: string,
  data: { fileName: string; tags: FileTag[] },
) {
  const res = await Api.put(`/api/user/files/${fileId}`, data);
  if (res.status === 200 || res.status === 201) return res.data;
  else return res.data as ErrorResponse;
}

/**
 * Gets the available tags for the current user.
 * @returns {Promise<FileTag[]>} A promise that resolves to an array of available tags.
 */
export async function getAvailableTags(): Promise<FileTag[]> {
  const userId = getUserId();
  const { data } = await Api.get(`/api/tags/by-user/${userId}`);
  return data;
}

export async function createNewTag(name: string) {
  const res = await Api.post("/api/tags", { name });
  if (res.status === 201 || res.status === 200 || res.status === 204)
    return res.data;
  else return res.data as ErrorResponse;
}

export async function deleteFile(fileId: string) {
  await Api.delete(`/api/user/files?fileId=${fileId}`);
}

export async function getUserFileTags(): Promise<FileTag[]> {
  const { data } = await Api.get<FileTag[]>("/api/user/files/tags");
  return data ?? [];
}

export async function getUserFileExtensions(): Promise<string[]> {
  const { data } = await Api.get<string[]>("/api/user/files/extensions");
  return data ?? [];
}

export async function getUserFileOwners(): Promise<FileOwner[]> {
  const { data } = await Api.get<FileOwner[]>("/api/user/files/owners");
  return data ?? [];
}