import useAuth from "./PrivateContext"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const { logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    return (
        <div>
            <h1>Bienvenido al Dashboard</h1>

            <button onClick={handleLogout}>Cerrar sesión</button>
        </div>
    )
}

export default Dashboard