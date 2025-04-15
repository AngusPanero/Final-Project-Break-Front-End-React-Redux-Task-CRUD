import useAuth from "./PrivateContext"
import { useNavigate, Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import menuHam from "../../assets/menuhamburguesas.png"
import logo from "../../assets/DeepDev Logo.png"
import wp from "../../../src/assets/wp.png"
import "../../../src/dashboard.css"
import useTheme from "../../../themeContext/ThemeContext"
import { postTask } from "../../../src/redux/taskSlice"

const Dashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { tasks } = useSelector(state => state.taskSelector)
    const { logout, password } = useAuth()
    const { theme, themeSelector } = useTheme()

    const [ menu, setMenu ] = useState(false)
    const [ containers, setConteiner ] = useState([])
    const [ containerName, setContainerName ] = useState("")
    const [ modal, setModal ] = useState(null)

    const titleRef = useRef();
    const descriptionRef = useRef();
    const dateRef = useRef();
    const emailRef = useRef();

    const openModal = (id) => {
        setModal(id) // le doy el id para que abra el modal del div correspondiente
    }

    const closeModal = () => {
        setModal(null) // le doy el id para que abra el modal del div correspondiente
    }

    const handleSubmitTask = (e) => {
        e.preventDefault()

        const newTask = {
            title: titleRef.current.value,
            description: descriptionRef.current.value || null, // Si está vacío, pon null
            limitDate: dateRef.current.value || null,
            email: emailRef.current.value || null,
            completed: false,
            comments: null
        }
        console.log("NEW TASK", newTask);
        console.log("TASKS", tasks);
        
        dispatch(postTask(newTask))
        closeModal()
    }

    useEffect(() => {
        console.log("TASKS USE-EFFECT", tasks);
        
    }, [tasks])

    const deleteContainer = (id) => {
        const userPassword = prompt("Por favor, Ingrese el email registrado para eliminar este contenedor:");

        if (userPassword === password) { 
            setConteiner(containers.filter((container) => container.id !== id));
            alert("Contenedor eliminado correctamente");
        } else {
            alert("Email incorrecto. No tienes permiso para eliminar este contenedor.");
        }
    };

    const createContainer = (name) => {
        setConteiner([...containers, {id: Date.now(), name: name, tasks: []}])
    }

    const handleInputName = (e) => {
        setContainerName(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(containerName){
            createContainer(containerName)
            setContainerName("")
        }
    }

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

                <form className="container-form" onSubmit={handleSubmit}>
                    <input className="input-container" type="text" onChange={handleInputName} value={containerName} placeholder="Nombrá la Columna" />
                    <button type="submit" className="addTask-button">Crear Nueva Columna</button>
                </form>
                
            
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
                        
                        {containers.map((container) => 
                            <>
                                <div className="taskContainer-ind" key={container.id}>
                                    <h2>{container.name}</h2>
                                    <button onClick={openModal}>Agregar Tarea</button>
                                    {tasks.length > 0 ? (
                                        tasks.map((taskObject) => (
                                            <div key={taskObject.task._id}>
                                                <h3>{taskObject.task.title}</h3>
                                            </div>
                                        ))
                                    ) : <p>Aún No Hay Tareas</p>}

                                    <h4>{container.id}</h4>
                                    <button onClick={() => deleteContainer(container.id)} className="delete-container">Eliminar Contenedor</button>
                                </div>

                                { modal ? <div key={`modal-${container.id}`}>
                                    <form className="open-modal" onSubmit={handleSubmitTask}>
                                        <input className="input-task-form" ref={titleRef} placeholder="Nombre de la Tarea" type="text" required/>
                                        <input className="input-task-form" ref={descriptionRef} placeholder="Descripción" type="text" />
                                        <input className="input-task-form" ref={dateRef} placeholder="Fecha Limite" type="date" />
                                        <input className="input-task-form" ref={emailRef} placeholder="Email" type="email" />
                                        <button type="submit">Crear Tarea</button>
                                        <button onClick={closeModal}>Cancelar</button>
                                    </form>
                                </div> : "" } 
                                </>   
                            )}    
                </div>
                <footer className="footer-dashboard">© 2025 DeepDev. Todos los derechos reservados. Valencia - España</footer>
                <Link to={import.meta.env.VITE_WHATSAPP} target="_blank"><img className="logo-wp" src={wp} alt="logo-whatsApp"/></Link>
            </div>    
        </>
        
    )
}

export default Dashboard