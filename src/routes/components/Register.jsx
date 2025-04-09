import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import imgRegister from "../../assets/sin-fondo-register-2p.m..png"
import logo from "../../assets/DeepDev Logo.png"
import "../../../src/Register.css"

const Register = () => {
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await axios.post("http://localhost:2105/register", { email, password })

            if(response.data.success){
                navigate("/")
            } else {
                alert("Error al Registrar Usuario!")
            }

        } catch (error) {
            setError(true)
        } finally {
            setLoading(false)
        }
    }

    if(error) return <h1>Request Error</h1>
    if(loading) return <h1>Registering User...</h1>

    return(

            <div className="register-view">

                <div className="div-img">
                    <img className="image-register" src={imgRegister} alt="image-register" />
                </div>

                <div className="login-register-div">
                <img className="logo" src={logo} alt="Logo-DeepDev" />
                    <h1>Registrá tu Nuevo Perfil</h1>

                    <form onSubmit={handleSubmit} className="login-register-form">

                        <input type="email" value={email} id="email" onChange={(e) => setEmail(e.target.value) } placeholder="email" required/>
                        <input type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value) } placeholder="password" required/>

                        <button className="register-button" type="submit">Register</button>

                    </form>

                    <div>
                        <Link to="/"><h2>¿Ya Estás Registrado?</h2> </Link> 
                    </div>    
                    <footer>© 2025 DeepDev. Todos los derechos reservados. Valencia - España</footer>
                </div>
            </div>
    )
}

export default Register