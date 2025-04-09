import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import useAuth from "./PrivateContext";
import imgLogin from "../../assets/sin-fondo-register-2p.m..png"
import logo from "../../assets/DeepDev Logo.png"
import "../../../src/Login.css"
import { app } from "../../firebase/config"

const Login = () => {
    const navigate = useNavigate()
    const { login } = useAuth()
    const auth = getAuth()

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const idToken = await user.getIdToken();

            const response = await axios.post(
                "http://localhost:2105/login",
                { idToken },
                { withCredentials: true }
            )

            if(response.data.success){
                login(user)
                navigate("/dashboard")
            } else {
                alert("Error en el login")
            }

        } catch (error) {
            setError(true)
            console.log("ERROR", error);
            
        } finally {
            setLoading(false)
        }
    }

    if(error) return <h1>Email o Password Incorrectos</h1>
    if(loading) return <h1>Loging In...</h1>

    return(
        <div className="login-view">

            <div className="div-img">
                <img className="image-login" src={imgLogin} alt="image.login" />
            </div>    

            <div className="login-register-div">
                <img className="logo" src={logo} alt="Logo-DeepDev" />
                <h1>Bienvenido! Inicia tu Sesión</h1>
                <form onSubmit={handleSubmit} className="login-register-form">
                    <input type="email" value={email} id="email" onChange={(e) => setEmail(e.target.value) } placeholder="email" required/>
                    <input type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value) } placeholder="password" required/>
                    <button className="login-button" type="submit">Login</button>
                </form>

                <div>
                    <Link to="/register"><h2>¿Nuevo Usuario?</h2> </Link> 
                </div>
                <footer>© 2025 DeepDev. Todos los derechos reservados. Valencia - España</footer>
            </div>

        </div>
            
    )
}

export default Login