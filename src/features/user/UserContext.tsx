/**
 * User Context Module
 *
 * Provides React Context for managing global user state throughout the application.
 * Includes a context provider and hook for accessing user data.
 *
 * @module UserContext
 */

import type { User } from "@/features/user/user.ts";
import { createContext, useContext, useEffect, useState } from "react";
import { aboutMe, refreshToken } from "@/api/auth.ts";
import { jwtDecode } from "jwt-decode";
/**
 * Interface for the user context value
 * @interface UserContextType
 * @property {User | null} user - The current user object or null if not authenticated
 * @property {(user: User | null) => void} setUser - Function to update the user state
 */
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
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

/**
 * Provider component for the user context
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to wrap with the provider
 * @returns {JSX.Element} Provider component with children
 */
export let UserProvider = ({ children }: { children: React.ReactNode }) => {
  let [user, setUser] = useState<User | null>(null);
  let [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let getUser = async () => {
      try {
        // let resRefresh = await refreshToken();
        // if (!resRefresh) {
        //   setUser(null);
        //   setLoading(false);
        //   return;
        // }
        let resUser = await aboutMe();
        // let payload = jwtDecode<{ role: string[] }>(resRefresh.accessToken);
        setUser({
          name: resUser.name,
          surname: resUser.surname,
          teacher: true, //payload.role.includes("teacher"),
          student: true, //payload.role.includes("student"),
        });
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};
