import useAuth from "./PrivateContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import menuHam from "../../assets/menuhamburguesas.png"
import "../../../src/dashboard.css"
import useTheme from "../../../themeContext/ThemeContext"

const Dashboard = () => {
    const navigate = useNavigate()
    const { logout } = useAuth()
    const { theme, themeSelector } = useTheme()
    const [ menu, setMenu ] = useState(false)

    const handleLogout = () => {
        logout()
        navigate("/")
    }

    const toogleMenu = () =>{
        setMenu(!menu)
    }

    return (
        <>
            <nav className={`nav-${theme}`}>
                <button className="logout" onClick={handleLogout}>Cerrar sesión</button>
                <button onClick={toogleMenu}><img className="menu-hamburguesa" src={menuHam} alt="menu-icon" /></button>
                
                <div className={`menu-desplegable ${menu ? `open` : ""}`}>
                    <ul className={`ul-menu`}>
                        <button onClick={toogleMenu}><img className="menu-hamburguesa" src={menuHam} alt="menu-icon" /></button>
                        <h4>Temas</h4>
                        <button onClick={() => themeSelector("default")}><li>Default</li></button>
                        <button onClick={() => themeSelector("dark")}><li>Dark</li></button>
                        <button onClick={() => themeSelector("light")}><li>Light</li></button>
                        <button onClick={() => themeSelector("blue")}><li>Blue</li></button>
                        <button onClick={() => themeSelector("purple")}><li>Purple</li></button>
                    </ul>
                </div>
            </nav>

            <div>
                <h1>Bienvenido al Dashboard</h1>

                
            </div>
        </>
        
    )
}

export default Dashboard