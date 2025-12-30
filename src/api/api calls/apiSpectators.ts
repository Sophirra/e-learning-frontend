import Api, { getUserId } from "@/api/api.ts";
import type { Spectator } from "@/components/complex/popups/spectators/spectatorListPopup.tsx";
import type { StudentBrief } from "@/types.ts";

/**
 * Fetches all spectators for the currently authenticated student from the API.
 *
 * The API endpoint `/api/spectators` returns users who are currently spectating
 * the logged-in student based on the JWT identity of the request.
 *
 * Each item includes:
 * - `id`   the unique identifier of the spectator.
 * - `email`   the email address of the spectator.
 * - `status`   optional spectatorship status (may be `null` if not specified).
 *
 * @returns {Promise<Spectator[]>} A promise that resolves to a list of spectators.
 */
export const getSpectators = async (): Promise<Spectator[]> => {
  const { data } = await Api.get<Spectator[]>("/api/spectators");
  return data;
};
/**
 * Removes a spectator relationship for the currently authenticated user.
 *
 * The API endpoint `/api/spectators` reads the **spectated user's ID** directly
 * from the JWT token (the logged-in user) and removes the specified spectator
 * identified by the provided `spectatorId` in the request body.
 *
 * On success, the API responds with:
 * - `204 No Content`   spectatorship successfully removed.
 *
 * On failure, it may respond with:
 * - `400 Bad Request`   when the `spectatorId` is missing or invalid.
 * - `401 Unauthorized`   when the token is invalid or expired.
 * - `404 Not Found`   when the spectatorship does not exist.
 *
 * @param {string} spectatorId - The unique identifier of the spectator (observer) to be removed.
 * @returns {Promise<void>} A promise that resolves when the operation completes successfully.
 */
export const removeSpectator = async (spectatorId: string): Promise<void> => {
  await Api.delete("/api/spectators", {
    data: { spectatorId },
  });
};
/**
 * Sends a request to add a new spectator for the currently authenticated student.
 *
 * The API endpoint `/api/spectators` creates a spectatorship relationship
 * between the logged-in student (derived from the JWT token) and the specified spectator.
 *
 * The request body must contain:
 * - `spectatorId`   the unique identifier of the user who will become a spectator.
 *
 * Possible server responses:
 * - **201 Created**   spectatorship successfully created.
 * - **400 Bad Request**   missing or invalid `spectatorId`.
 * - **401 Unauthorized**   JWT token is invalid or missing.
 * - **403 Forbidden**   the user is not a student.
 * - **404 Not Found**   spectator not found or relationship already exists.
 *
 * @returns {Promise<void>} Resolves when the spectator is successfully added.
 * @param spectatorEmail
 */
export const apiSpectators = async (spectatorEmail: string): Promise<void> => {
  await Api.post("/api/spectators", { spectatorEmail });
};
/**
 * Sends a request to accept a pending spectator invitation using its unique token.
 *
 * The API endpoint `/api/spectators/invites/accept` validates the provided invitation token,
 * ensures the current user is the invited spectator, and finalizes the spectatorship relationship.
 *
 * The request body must contain:
 * - `token`   the secure invitation token received via email link.
 *
 * Possible server responses:
 * - **204 No Content**   invitation successfully accepted.
 * - **400 Bad Request**   missing or invalid `token` value.
 * - **401 Unauthorized**   user is not authenticated or JWT token is invalid.
 * - **403 Forbidden**   current user is not the invited spectator.
 * - **404 Not Found**   invitation not found.
 * - **409 Conflict**   invitation already accepted or expired.
 * - **500 Internal Server Error**   unexpected server error while accepting the invitation.
 *
 * @param {string} token - The secure token associated with the spectator invitation.
 * @returns {Promise<void>} Resolves when the invitation has been successfully accepted.
 */
export const acceptSpectatorInvite = async (token: string): Promise<void> => {
  await Api.post("/api/spectators/invites/accept", { token });
};

export async function getSpectated(): Promise<StudentBrief> {
  const userId = getUserId();
  const { data } = await Api.get(`/api/spectators/${userId}/spectated`);
  return data;
}
