/**
 * User Context Module
 *
 * Provides React Context for managing global user state throughout the application.
 * Includes a context provider and hook for accessing user data.
 *
 * @module UserContext
 */

import type {User} from "@/types/user.ts";
import {createContext, useContext, useState} from "react";

/**
 * Interface for the user context value
 * @interface UserContextType
 * @property {User | null} user - The current user object or null if not authenticated
 * @property {(user: User | null) => void} setUser - Function to update the user state
 */
interface UserContextType {
    user: User | null
    setUser: (user: User | null) => void
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
export let useUser = () => {
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
export let UserProvider = ({children}: { children: React.ReactNode}) => {
    let [user, setUser] = useState<User | null>(null);
    return (<UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>)
}