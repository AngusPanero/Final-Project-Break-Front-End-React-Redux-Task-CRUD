import useAuth from "./PrivateContext"
import { useNavigate, Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import menuHam from "../../assets/menuhamburguesas.png"
import logo from "../../assets/DeepDev Logo.png"
import wp from "../../../src/assets/wp.png"
import "../../../src/dashboard.css"
import useTheme from "../../../themeContext/ThemeContext"
import { postTask, createContainer, readTasks, readContainers, updatedTask, updateCommentRedux, updateTaskCompleted, deleteTaskRedux, deleteContainer as deleteContainerRedux } from "../../../src/redux/taskSlice"

const Dashboard = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    
    const { tasksArray } = useSelector(state => state.taskSelector)
    const { containersArray } = useSelector(state => state.taskSelector)
    const { logout, user } = useAuth()
    const { theme, themeSelector } = useTheme()

    const [ menu, setMenu ] = useState(false)
    const [ containerName, setContainerName ] = useState("")
    const [ modal, setModal ] = useState(null)
    const [ modalComents, setModalComments ] = useState(null)
    const [ modalUpdate, setModalUpdate ] = useState(null)
    const [ completedTask, setCompletedTask ] = useState(false)
    const [ completedComment, setCompletedComment ] = useState(false)
    const [ updateTaskData, setUpdateTaskData ] = useState(null)

    //REF CREATE TASKS
    const titleRef = useRef();
    const descriptionRef = useRef();
    const dateRef = useRef();
    const emailRef = useRef();

     //REF Update TASKS
    const titleRefUpdate = useRef();
    const descriptionRefUpdate = useRef();
    const dateRefUpdate = useRef();
    const emailRefUpdate = useRef();
    const commentsRefUpdate = useRef();
    const CompletedRefUpdate = useRef()

    const modalCommentArrow = (taskId) => {
        setModalComments(id => (id === taskId ? null : taskId)) // Acá si ya está abierta la flecha, se cierra, si no le asigno el taskId
    }

    const markTaskAsCompleted = (id) => {
        setCompletedTask(!completedTask)
        console.log("Estado Completed", completedTask);
        dispatch(updateTaskCompleted({id, completed: completedTask}))
    }

    const markTaskAsCompletedComment = (taskId, commentId) => {
        setCompletedComment(!completedComment)
        console.log("Estado Completed Comment", completedComment);
        dispatch(updateCommentRedux({ taskId, commentId, reviewed: completedComment }))
    }

    const openModalUpdate = (id, task) => {
        const { title, description, limitDate, email, comments, completed, containerId } = task
        setUpdateTaskData({ title, description, limitDate, email, comments, completed, containerId });
        console.log("UPDATE DATA", task);
        
        setModalUpdate(id) // le doy el id para que abra el modal del div correspondiente
    }

    const closeModalUpdate = () => {
        setModalUpdate(null) // le doy el id para que abra el modal del div correspondiente
    }


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
            comments: null,
            containerId: modal
        }
        console.log("NEW TASK", newTask);
        console.log("TASKS ARRAY", tasksArray);
        
        dispatch(postTask(newTask))
        .then(() => {
            dispatch(readTasks());
        });
        closeModal()
    }

    const handleSubmitUpdateTask = (e) => {
        e.preventDefault()

        const id = modalUpdate

        const updateTaskForm = {
            title: titleRefUpdate.current.value || updateTaskData.title,
            description: descriptionRefUpdate.current.value || updateTaskData.description,
            limitDate: dateRefUpdate.current.value || updateTaskData.limitDate,
            email: emailRefUpdate.current.value || updateTaskData.email,
            completed: CompletedRefUpdate.current.value || updateTaskData.completed,
            comments: [{ text: commentsRefUpdate.current.value, reviewed: false }] || updateTaskData.comments,
            containerId: updateTaskData.containerId
        };

        console.log("UPDATED TASK", updateTaskForm);
        console.log("TASKS ARRAY", tasksArray);

        dispatch(updatedTask({ id, updateTaskForm })).then(() => {
            dispatch(readTasks())
        });
        closeModalUpdate()
    }

    useEffect(() => {
        console.log("USE-EFFECT CONTAINERS", containersArray);
        console.log("USE-EFFECT TASKS", tasksArray);
        dispatch(readContainers())
        dispatch(readTasks())
    }, [completedComment, updateTaskData, dispatch])

    const deleteContainer = (id) => {
        const userEmail = prompt("Por favor, Ingrese el email registrado para eliminar este contenedor:");

        if (userEmail === user.email) {
            dispatch(deleteContainerRedux(id)).then(() => {
                dispatch(readContainers())
            })
        } else {
            alert("Email incorrecto. No tienes permiso para eliminar este contenedor.");
        }
    };

    const deleteTask = (id) => {
        const userEmail = prompt("Por favor, Ingrese el email registrado para eliminar este contenedor:");

        if (userEmail === user.email) {
            dispatch(deleteTaskRedux(id)).then(() => {
                dispatch(readTasks())
                
            })
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
            .then(() => {
                dispatch(readContainers()) // acá para que al crear ejecute la lectura de containers
            })
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
                    <button type="submit" className={`addTask-button-${theme}`}>Crear Nueva Columna</button>
                </form>
                
            
                <button className={`logout-${theme}`} onClick={handleLogout}>Cerrar sesión</button>
                <button onClick={toogleMenu}><img className="menu-hamburguesa" src={menuHam} alt="menu-icon" /></button>
                
                <div className={`menu-desplegable ${menu ? `open-${theme}` : ""}`}>
                    <ul className={`ul-menu`}>
                        <button onClick={toogleMenu}><img className="menu-hamburguesa" src={menuHam} alt="menu-icon" /></button>
                        <button className={`li-nav-${theme}`} ><li><strong>Temas</strong></li></button>
                        <button className={`li-nav-${theme}`} onClick={() => themeSelector("default")}><li>Default</li></button>
                        <button className={`li-nav-${theme}`} onClick={() => themeSelector("dark")}><li>Dark</li></button>
                        <button className={`li-nav-${theme}`} onClick={() => themeSelector("light")}><li>Light</li></button>
                        <button className={`li-nav-${theme}`} onClick={() => themeSelector("blue")}><li>Blue</li></button>
                        <button className={`li-nav-${theme}`} onClick={() => themeSelector("purple")}><li>Purple</li></button>
                        <button className={`li-nav-${theme}`} onClick={() => themeSelector("green")}><li>Green</li></button>
                    </ul>
                </div>   
            </nav>
            
            <div className="mainContainer">
                <div key={"containersArray"} className="taskContainer">
                {containersArray.map((container) => (
                    <div className="open-modal" key={container._id}>
                        <div className="topContainer">
                            <h2 className={`title-container-${theme}`} key={container.name}>{container.name}</h2>
                            <button className="CreateTaskButton" onClick={() => openModal(container._id)}>Agregar</button>
                        </div>
                        {tasksArray.length > 0 ? (
                            tasksArray
                                .filter((task) => task.containerId === container._id)  
                                .map((task) => (
                                    <div key={task._id}>

                                        <div className="middleContainer">
                                            <button className={task.completed === true ? "completedTaskButton" : "uncompletedTaskButton"} ref={CompletedRefUpdate} onClick={() => markTaskAsCompleted(task._id)}>{task.completed === true ? "✓" : "X"}</button>
                                            <div>
                                                <h3 className={`title-task-${theme}`} onClick={() => openModalUpdate(task._id, task)}>{task.title}</h3>
                                                <p className={`date-task-${theme}`}>{task.limitDate === null ? "Sin Fecha Límite" : `Fecha Límite: ${task.limitDate.slice(0, 10)}`}</p>
                                                
                                            </div>        
                                            <button onClick={() => modalCommentArrow(task._id)} className="commentsArrow">{modalComents === task._id ? "🔽" : "▶️"}</button>
                                            <button className="deleteTaskButton" onClick={() => deleteTask(task._id)}>Eliminar</button>    
                                        </div>
                                        <div>
                                            {modalComents === task._id && (
                                                Array.isArray(task.comments) && task.comments.length > 0 ? (
                                                    task.comments.map((comment, index) => (
                                                        <div key={index}>
                                                            <div className="commentsContainer">
                                                                <button className={comment.reviewed ? "completedCommentButton" : "unCompletedCommentButton"} onClick={() => markTaskAsCompletedComment(task._id, comment._id)}>{comment.reviewed ? "✓" : "X"} </button>
                                                                <strong><p className="taskComment">{comment.text}</p></strong>
                                                            </div>
                                                        </div>
                                                    ))) : (<p className="taskComment">No Hay Comentarios</p>))}
                                        </div> 
                                    </div>
                                ))) : (<p>No hay tareas disponibles.</p>)}
                        <button className="deleteContainerButton" onClick={() => deleteContainer(container._id)}>Eliminar Contenedor</button>
                    </div>
                ))}

                    {modal ? (
                        <div className="createModal" key={`modal-${modal}`}>
                            <form className="open-modal" onSubmit={handleSubmitTask}>
                                <input className="input-task-form" ref={titleRef} placeholder="Nombre de la Tarea" type="text" required />
                                <input className="input-task-form" ref={descriptionRef} placeholder="Descripción" type="text" />
                                <input className="input-task-form" ref={dateRef} placeholder="Fecha Limite" type="date" />
                                <input className="input-task-form" ref={emailRef} placeholder="Email" type="email" />
                                <button type="submit">Crear Tarea</button>
                                <button onClick={closeModal}>Cancelar</button>
                            </form>
                            <div>
                                <h3>Imagen o algo explicativo</h3>
                            </div>
                        </div>
                    ) : ""}

                    {modalUpdate ? (
                        <div className="updateModal" key={`modal-${modalUpdate}`}>
                            <form className="open-modal-update" onSubmit={handleSubmitUpdateTask}>
                                <input className="input-task-formUpdate" ref={titleRefUpdate} placeholder="Nombre de la Tarea" type="text" required />
                                <input className="input-task-formUpdate" ref={descriptionRefUpdate} placeholder="Descripción" type="text" />
                                <input className="input-task-formUpdate" ref={dateRefUpdate} placeholder="Fecha Limite" type="date" />
                                <input className="input-task-formUpdate" ref={emailRefUpdate} placeholder="Email" type="email" />
                                <input className="input-task-formUpdate" ref={commentsRefUpdate} placeholder="Comentarios" type="text" />
                                <button type="submit">Actualizar Tarea</button>
                                <button onClick={closeModalUpdate}>Cancelar</button>
                            </form>
                            <div>
                                <h3>Imagen o algo explicativo</h3>
                            </div>
                        </div>
                    ) : ""}

                </div>
                <footer className={`footer-${theme}`}>© 2025 DeepDev. Todos los derechos reservados. Valencia - España</footer>
                <Link to={import.meta.env.VITE_WHATSAPP} target="_blank"><img className="logo-wp" src={wp} alt="logo-whatsApp" /></Link>
            </div>
        </>
        
    )
}

export default Dashboard