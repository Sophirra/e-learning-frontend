import Api, { getUserId } from "@/api/api.ts";
import type { Spectator } from "@/components/complex/popups/spectators/spectatorListPopup.tsx";
import type { StudentBrief } from "@/types.ts";

/**
 * Fetches all spectators for the current user.
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
 * @param {string} spectatorId - The unique identifier of the spectator.
 * @returns {Promise<void>} A promise that resolves when the operation completes successfully.
 */
export const removeSpectator = async (spectatorId: string): Promise<void> => {
  await Api.delete("/api/spectators", {
    data: { spectatorId },
  });
};

/**
 * Sends a request for a spectator for the current user.
 *
 * @param spectatorEmail An email of the new spectator.
 * @returns {Promise<void>} Resolves when the spectator is successfully added.
 */
export const apiSpectators = async (spectatorEmail: string): Promise<void> => {
  await Api.post("/api/spectators", { spectatorEmail });
};

/**
 * Sends a request to accept a pending spectator invitation.
 *
 * @param {string} token - The secure token associated with the spectator invitation.
 * @returns {Promise<void>} Resolves when the invitation has been successfully accepted.
 */
export const acceptSpectatorInvite = async (token: string): Promise<void> => {
  await Api.post("/api/spectators/invites/accept", { token });
};

/**
 * Retrieves the spectators for current user.
 *
 * @return {Promise<StudentBrief>} A promise that resolves to the brief details of the spectated student.
 */
export async function getSpectated(): Promise<StudentBrief> {
  const userId = getUserId();
  const { data } = await Api.get(`/api/spectators/${userId}/spectated`);
  return data;
}
