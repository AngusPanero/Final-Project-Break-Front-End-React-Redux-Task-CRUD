import { Navigate } from "react-router-dom" // seria el redirect
import useAuth from "./PrivateContext" // mi contexto de Auth

// ESTE COMPONENTES LE VAMOS A DAR PROP CHILDREN - VA A TENER QUE AFECTAR A TODOS LOS HIJOS QUE ENVUELVA

const PrivateRoute = ({ children }) => {
    const { user } = useAuth() // este es mi contexto de auth
    
    return( user ? children : <Navigate to="/login" />)
}

export default PrivateRoute