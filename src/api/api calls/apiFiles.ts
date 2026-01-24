import type {
  FileBrief,
  FileData,
  FileFilter,
  FileOwner,
  FileTag,
  PagedResult,
} from "@/types.ts";
import Api, { getUserId } from "@/api/api.ts";

/**
 * Uploads a file for a logged-in user.
 *
 * @param {File} file - The file object selected by the user.
 * @returns {Promise<any>} Resolves with the uploaded file metadata.
 */
export const uploadUserFile = async (file: File): Promise<FileBrief> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await Api.post("/api/user/files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data as FileBrief;
};

/**
 * Fetches a filtered list of files.
 *
 * Supports multiple optional filters.
 *
 * @param filter - Optional filtering parameters.
 * @returns Promise resolving to an array of FileData objects in a paged result.
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
 * @param fileId id of the file.
 * @param content new file name and tags.
 */
export async function updateFileData(
  fileId: string,
  content: { fileName: string; tags: FileTag[] },
) {
  const { data } = await Api.put(`/api/user/files/${fileId}`, content);
  return data;
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

/**
 * Creates a new tag with the specified name by making a POST request to the API.
 *
 * @param {string} name - The name of the tag to be created.
 * @return {Promise<object>} A promise that resolves to the created tag data.
 */
export async function createNewTag(name: string): Promise<object> {
  const { data } = await Api.post("/api/tags", { name });
  return data;
}

/**
 * Deletes a file.
 *
 * @param {string} fileId - The unique identifier of the file.
 * @return {Promise<void>} A promise that resolves when the file is successfully deleted.
 */
export async function deleteFile(fileId: string): Promise<void> {
  await Api.delete(`/api/user/files?fileId=${fileId}`);
}

/**
 * Fetches and returns the list of file tags associated with the user.
 *
 * @return {Promise<FileTag[]>} A promise that resolves to an array of file tag objects.
 */
export async function getUserFileTags(): Promise<FileTag[]> {
  const { data } = await Api.get<FileTag[]>("/api/user/files/tags");
  return data ?? [];
}

/**
 * Fetches and returns a list of file extensions associated with the user.
 *
 * @return {Promise<string[]>} A promise that resolves to an array of strings with extensions.
 */
export async function getUserFileExtensions(): Promise<string[]> {
  const { data } = await Api.get<string[]>("/api/user/files/extensions");
  return data ?? [];
}

/**
 * Retrieves the list of file owners associated with the user.
 *
 * @return {Promise<FileOwner[]>} A promise that resolves to an array of file owner objects.
 */
export async function getUserFileOwners(): Promise<FileOwner[]> {
  const { data } = await Api.get<FileOwner[]>("/api/user/files/owners");
  return data ?? [];
}

/**
 * Adds a file to a specific class by its ID.
 *
 * @param {string} fileId - The unique identifier of the file.
 * @param {string} classId - The unique identifier of the class .
 * @return {Promise<object[]>} A promise that resolves to an array of objects representing the updated list of files for the class.
 */
export async function addFileToClass(
  fileId: string,
  classId: string,
): Promise<object[]> {
  const { data } = await Api.post(`/api/classes/${classId}/files/`, fileId);
  return data ?? [];
}
