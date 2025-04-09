import useAuth from "./PrivateContext"
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import menuHam from "../../assets/menuhamburguesas.png"
import logo from "../../assets/DeepDev Logo.png"
import wp from "../../../src/assets/wp.png"
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
                <img className="logo-nav" src={logo} alt="Logo-DeepDev" />  
            
                <button className="logout" onClick={handleLogout}>Cerrar sesión</button>
                <button onClick={toogleMenu}><img className="menu-hamburguesa" src={menuHam} alt="menu-icon" /></button>
                
                <div className={`menu-desplegable ${menu ? `open-${theme}` : ""}`}>
                    <ul className={`ul-menu`}>
                        <button onClick={toogleMenu}><img className="menu-hamburguesa" src={menuHam} alt="menu-icon" /></button>
                        <button ><li><strong>Temas</strong></li></button>
                        <button onClick={() => themeSelector("default")}><li>Default</li></button>
                        <button onClick={() => themeSelector("dark")}><li>Dark</li></button>
                        <button onClick={() => themeSelector("light")}><li>Light</li></button>
                        <button onClick={() => themeSelector("blue")}><li>Blue</li></button>
                        <button onClick={() => themeSelector("purple")}><li>Purple</li></button>
                        <button onClick={() => themeSelector("green")}><li>Green</li></button>
                    </ul>
                </div>
            </nav>

            <div className="mainContainer">
                <div className="taskContainer">
                    <h1>Bienvenido al Dashboard</h1>

                    
                </div>
                <footer className="footer-dashboard">© 2025 DeepDev. Todos los derechos reservados. Valencia - España</footer>
                <Link to={import.meta.env.VITE_WHATSAPP} target="_blank"><img className="logo-wp" src={wp} alt="logo-whatsApp"/></Link>
            </div>    
        </>
        
    )
}

export default Dashboard