import { useContext, createContext, useState } from "react";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null) // aca guardamos el usuario autenticado

    const login = (userData) => {
        setUser(userData)
    }

    const logout = () => {
        setUser(null)
    }

    return( // Proveemos con user, y las funciones de login y logout
        <>
            <AuthContext.Provider value={{ user, login, logout }}> 
                {children}
            </AuthContext.Provider>
        </>
    )
}

const useAuth = () => useContext(AuthContext)

export default useAuth
