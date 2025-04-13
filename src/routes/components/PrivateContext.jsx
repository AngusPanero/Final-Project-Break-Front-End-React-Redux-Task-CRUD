import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null) // aca guardamos el usuario autenticado
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");

    const login = (userData) => {
        setUser(userData)
        setPassword(userData.email);
        console.log("USER DATA", userData);
    }

    const logout = async () => {
        setUser(null)
        await axios.post("http://localhost:2105/logout", {}, { withCredentials: true });
    }

 /*    useEffect(() => {
        const validateSession = async () => {
            try {
                setLoading(true)
                const response = await axios.get("http://localhost:2105/validate-session", { withCredentials: true });
                if (response.data.success) {
                    setUser(response.data.user);
                }
            } catch (error) {
                setUser(null); // sesión inválida o expirada
            } finally {
                setLoading(false);
            }
        };

        validateSession();
    }, []); */

    if (loading) return <h1>Cargando sesión...</h1>
    return( // Proveemos con user, y las funciones de login y logout
        <>
            <AuthContext.Provider value={{ user, login, logout, loading, password }}> 
                {children}
            </AuthContext.Provider>
        </>
    )
}

const useAuth = () => useContext(AuthContext)

export default useAuth
