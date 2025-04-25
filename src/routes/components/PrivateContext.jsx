import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null) // aca guardamos el usuario autenticado
    const [loading, setLoading] = useState(false);

    const login = (userData) => {
        setUser(userData)
        console.log("USER DATA", userData);
    }

    const logout = async () => {
        setUser(null)
        await axios.post("https://final-project-break-back-end-react-redux-na9x.onrender.com/logout", {}, { withCredentials: true });
    }

    if (loading) return <h1>Cargando sesión...</h1>
    return( // Proveemos con user, y las funciones de login y logout
        <>
            <AuthContext.Provider value={{ user, login, logout, loading }}> 
                {children}
            </AuthContext.Provider>
        </>
    )
}

const useAuth = () => useContext(AuthContext)

export default useAuth
