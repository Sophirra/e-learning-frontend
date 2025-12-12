import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "sonner";

import { acceptSpectatorInvite } from "@/api/api calls/apiSpectators.ts";

/**
 * React page component responsible for handling spectator invitation acceptance.
 *
 * When a user visits a URL containing an invitation token (e.g. `/accept?token=...`),
 * this component automatically sends a request to the backend to accept the invitation.
 *
 * Flow:
 * 1. Extracts the `token` from the query string.
 * 2. If the token is missing or invalid, redirects the user to the home page with an error toast.
 * 3. Sends a POST request to the `/api/spectators/invites/accept` endpoint via `acceptSpectatorInvite()`.
 * 4. Displays appropriate notifications based on the API response:
 *    - **204 No Content** → Invitation successfully accepted.
 *    - **401 Unauthorized** → User must log in first (token saved temporarily in a cookie).
 *    - **403 Forbidden** → Invitation does not belong to the current user.
 *    - **404 Not Found** → Invitation not found.
 *    - **409 Conflict** → Invitation already accepted.
 *    - **410 Gone** → Invitation expired.
 *    - Other errors → Generic  Could not accept invitation.  message.
 * 5. After handling any outcome, the user is redirected to the home page.
 *
 * Additional notes:
 * - A `useRef` guard (`ran.current`) prevents duplicate POST requests that may occur
 *   due to React Strict Mode or multiple re-renders.
 * - Uses `sonner` for toast notifications and `js-cookie` for persisting temporary tokens.
 *
 * @component
 * @returns {JSX.Element} The loading screen that displays while the invitation is being processed.
 */
const SpectatorAcceptPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const ran = useRef(false);
  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      toast.error("Invalid or missing invitation token.");
      navigate("/", { replace: true });
      return;
    }
    (async () => {
      if (ran.current) return; // nie pozwól odpalić drugi raz
      ran.current = true;
      try {
        await acceptSpectatorInvite(token); // backend sam widzi Twoje cookie (refresh/access) i zwróci 401 jeśli trzeba
        toast.success("Invitation accepted successfully!");
        navigate("/", { replace: true });
      } catch (err: any) {
        const s = err?.response?.status;
        const msg = err?.response?.data ?? "Could not accept invitation.";

        if (s === 401) {
          // brak ważnej sesji → zapisz token i przenieś na login
          Cookies.set("spectatorInviteToken", token, {
            expires: 1,
            sameSite: "Lax",
          });
          toast.error("You need to log in first.");
          navigate("/", { replace: true });
          return;
        }
        if (s === 410) toast.error("Invitation expired.");
        else if (s === 404) toast.error("Invitation not found.");
        else if (s === 403) toast.error("Not allowed to accept this invite.");
        else if (s === 409) toast.info("Invitation already accepted.");
        else toast.error(msg);

        navigate("/", { replace: true });
      }
    })();
  }, [params, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h2 className="text-xl font-semibold mb-2">Processing invitation...</h2>
      <p className="text-gray-500">Please wait a moment.</p>
    </div>
  );
};

export default SpectatorAcceptPage;
