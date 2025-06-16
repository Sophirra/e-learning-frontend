// import type {User} from "@/types/user.ts";
// import {createContext, useContext, useState} from "react";
// import * as React from "react";
//
// let AuthContext = createContext<{user: User | null, setUser: (u: User | null) => void} | null>;
//
// export function authProvider({children}: {children: React.ReactNode}) {
//     let [user, setUser] = useState<User | null>(null)
//     return <AuthContext.Provider value={{user, setUser}}>{children}</AuthContext.Provider>
// }
//
// export function useAuth() {
//     let context = useContext(AuthContext)
//     if (!context) throw new Error("useAuth must be used within an AuthProvider")
//     return context
// }