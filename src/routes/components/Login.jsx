import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"

const Login = () => {
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState(null);
    const [ loading, setLoading ] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await axios.post("http://localhost:2105/login", { email, password })

            if(response.data.success){
                navigate("/dashboard")
            } else {
                alert("Error in Login!")
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
            <div className="login-register-div">
                <h1>Please log in to go to the Dashboard</h1>

                <form onSubmit={handleSubmit} className="login-register-form">

                    <input type="email" value={email} id="email" onChange={(e) => setEmail(e.target.value) } placeholder="email" required/>
                    <input type="password" value={password} id="password" onChange={(e) => setPassword(e.target.value) } placeholder="password" required/>

                    <button type="submit">Login</button>

                </form>
                <div>
                    <Link to="/register"><h2>Not Registered?</h2> </Link> 
                </div>
            </div>
    )
}

export default Login