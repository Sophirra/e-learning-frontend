/**
 * User Context Module
 *
 * Provides React Context for managing global user state throughout the application.
 * Includes a context provider and hook for accessing user data.
 *
 * @module UserContext
 */

import type { Role, User } from "@/features/user/user.ts";
import { createContext, useContext, useEffect, useState } from "react";
import { aboutMe } from "@/api/auth.ts";
import { getRoles } from "@/api/api.ts";
import Cookies from "js-cookie";
import {clearPersistedRole, persistRole} from "@/features/user/RolePersistence.ts";
/**
 * Interface for the user context value
 * @interface UserContextType
 * @property {User | null} user - The current user object or null if not authenticated
 * @property {(user: User | null) => void} setUser - Function to update the user state
 */
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  changeRole: (role: Role) => void;
  loading: boolean;
}

/**
 * React context for managing user state
 * @type {React.Context<UserContextType | undefined>}
 */
let UserContext = createContext<UserContextType | undefined>(undefined);

/**
 * Hook to access the user context
 * @returns {UserContextType} The user context value
 * @throws {Error} When used outside of UserProvider
 */
export let useUser = (): UserContextType => {
  let context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};


const readPersistedRole = (): Role | undefined => {
  const r = Cookies.get("activeRole");
  return r as Role | undefined;
};

/**
 * Provider component for the user context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap with the provider
 * @returns {JSX.Element} Provider component with children
 */
export let UserProvider = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = useState<User | null>(null);
  let [loading, setLoading] = useState<boolean>(true);

  //effect for retaining session
  // - get user info from about me and roles from access token
  useEffect(() => {
    const getUser = async () => {
      try {
        // let resRefresh = await refreshToken();
        // if (!resRefresh) {
        //   setUser(null);
        //   setLoading(false);
        //   return;
        // }
        const resUser = await aboutMe();
        //roles are gotten from access token - hence the api method
        const resRoles = getRoles();
        const fromCookie = readPersistedRole();
        const activeRole =
            (fromCookie && resRoles.includes(fromCookie) && fromCookie) ||
            resRoles[0];
        setUser({
          name: resUser.name,
          surname: resUser.surname,
          roles: resRoles,
          activeRole,
        });
        console.log(user);
      } catch {
        setUser(null);
        clearPersistedRole();
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  function changeRole(role: Role) {
    setUser((prev) => {
      if (!prev) return prev;
      if (prev.activeRole === role) return prev; // no-op
      // opcjonalnie: upewnij się, że rola należy do użytkownika
      if (!prev.roles.includes(role)) return prev;
      const updated = { ...prev, activeRole: role };
      persistRole(role);
      return updated;
    });
  }

  const setUserWithCookie = (u: User | null) => {
    setUser(u);
    if (!u) clearPersistedRole();
  };

  return (
      <UserContext.Provider
          value={{ user, setUser: setUserWithCookie, loading, changeRole }}
      >
        {children}
      </UserContext.Provider>
  );
};
