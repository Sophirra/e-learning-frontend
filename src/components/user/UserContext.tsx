import type {User} from "@/types/user.ts";
import {createContext, useContext, useState} from "react";

interface UserContextType {
    user: User | null
    setUser: (user: User | null) => void
}
let UserContext = createContext<UserContextType | undefined>(undefined);

export let useUser = () => {
    let context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export let UserProvider = ({children}: { children: React.ReactNode}) => {
    let [user, setUser] = useState<User | null>(null);
    return (<UserContext.Provider value={{user, setUser}}>
        {children}
    </UserContext.Provider>)
}