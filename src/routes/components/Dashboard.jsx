import useAuth from "./PrivateContext"
import { useNavigate, Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import menuHam from "../../assets/menuhamburguesas.png"
import logo from "../../assets/DeepDev Logo.png"
import wp from "../../../src/assets/wp.png"
import "../../../src/dashboard.css"
import useTheme from "../../../themeContext/ThemeContext"
import { postTask, createContainer } from "../../../src/redux/taskSlice"

const Dashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { tasksArray } = useSelector(state => state.taskSelector)
    const { containersArray } = useSelector(state => state.taskSelector)
    const { logout, password } = useAuth()
    const { theme, themeSelector } = useTheme()

    const [ menu, setMenu ] = useState(false)/* 
    const [ containers, setConteiner ] = useState([]) */
    const [ containerName, setContainerName ] = useState("")
    const [ modal, setModal ] = useState(null)

    //REF CREATE TASKS
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
            description: descriptionRef.current.value || null,
            limitDate: dateRef.current.value || null,
            email: emailRef.current.value || null,
            completed: false,
            comments: null
        }
        console.log("NEW TASK", newTask);
        
        dispatch(postTask(newTask)) // en el Reducer TaskData es el parametro de postTask
        closeModal()
    }

    useEffect(() => {
        console.log("USE-EFFECT", tasksArray, containersArray);
        
    }, [tasksArray, containersArray])

    const deleteContainer = (id) => {
        const userEmail = prompt("Por favor, Ingrese el email registrado para eliminar este contenedor:");

        if (userEmail === password) { 
            setConteiner(containersArray.filter((container) => container.container._id !== id));
            alert("Contenedor eliminado correctamente");
        } else {
            alert("Email incorrecto. No tienes permiso para eliminar este contenedor.");
        }
    };

    const handleInputNameContainer = (e) => {
        setContainerName(e.target.value)
    }

    const handleSubmitContainer = (e) => {
        e.preventDefault()
        if(containerName){
            dispatch(createContainer({ name: containerName} )) // el user lo asigno desde el back al recibir el uid
            setContainerName("")
        }
    }

    const handleLogout = () => { //Logout
        logout()
        navigate("/")
    }

    const toogleMenu = () =>{ // TRUE / FALSE menú desplegable NAV
        setMenu(!menu)
    }

    return (
        <>
            <nav className={`nav-${theme}`}>
                <img className="logo-nav" src={logo} alt="Logo-DeepDev" />  

                <form className="container-form" onSubmit={handleSubmitContainer}>
                    <input className="input-container" type="text" onChange={handleInputNameContainer} value={containerName} placeholder="Nombrá la Columna" />
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
                    {containersArray.map((container) => (
                        <div className="open-modal" key={container.container._id}>
                            <h2>{container.container.name}</h2>
                            <button onClick={() => openModal(container.container._id)}>Agregar Tarea</button>

                            {tasksArray.map((tasks) => 
                                <div key={tasks.task._id}>
                                    <p>{tasks.task.title}</p>
                                </div>
                            )}
                            
                            <p>{container.container._id}</p>
                            <button onClick={() => deleteContainer(container.container._id)} className="delete-container">Eliminar Contenedor</button>
                        </div>
                    ))}

                    {modal ? (
                        <div key={`modal-${modal}`}>
                            <form className="open-modal" onSubmit={handleSubmitTask}>
                                <input className="input-task-form" ref={titleRef} placeholder="Nombre de la Tarea" type="text" required />
                                <input className="input-task-form" ref={descriptionRef} placeholder="Descripción" type="text" />
                                <input className="input-task-form" ref={dateRef} placeholder="Fecha Limite" type="date" />
                                <input className="input-task-form" ref={emailRef} placeholder="Email" type="email" />
                                <button type="submit">Crear Tarea</button>
                                <button onClick={closeModal}>Cancelar</button>
                            </form>
                        </div>
                    ) : ""}
                </div>
                <footer className="footer-dashboard">© 2025 DeepDev. Todos los derechos reservados. Valencia - España</footer>
                <Link to={import.meta.env.VITE_WHATSAPP} target="_blank"><img className="logo-wp" src={wp} alt="logo-whatsApp" /></Link>
            </div>
        </>
        
    )
}

export default Dashboard