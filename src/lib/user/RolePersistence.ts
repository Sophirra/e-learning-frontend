
import Cookies from "js-cookie";

import type {Role} from "@/types.ts";

const COOKIE_KEY = "activeRole";


/**
 * Utility module for managing the user's active role in cookies.
 *
 * Provides helper functions to persist, read, and clear the `activeRole` value,
 * ensuring the selected role is remembered across sessions.
 */

export const persistRole = (role: Role): void => {
    Cookies.set(COOKIE_KEY, role, {
        expires: 1,
        sameSite: "strict",
        path: "/",
        // secure: true,
    });
};

export const readPersistedRole = (): Role | undefined => {
    const r = Cookies.get(COOKIE_KEY);
    return r as Role | undefined;
};

export const clearPersistedRole = (): void => {
    Cookies.remove(COOKIE_KEY, { path: "/" });
};
