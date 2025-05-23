import useAuth from "./PrivateContext"
import { useNavigate, Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import menuHam from "../../assets/menuhamburguesas.png"
import logo from "../../assets/DeepDev Logo.png"
import wp from "../../../src/assets/wp.png"
import updateImg from "../../../src/assets/update-img.png"
import createImg from "../../../src/assets/create-img.png"
import "../../../src/dashboard.css"
import useTheme from "../../../themeContext/ThemeContext"
import { postTask, createContainer, readTasks, readContainers, updatedTask, deleteCommentRedux, updateCommentRedux, updateTaskCompleted, deleteTaskRedux, deleteContainer as deleteContainerRedux } from "../../../src/redux/taskSlice"

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
        const commentValue = commentsRefUpdate.current?.value.trim(); // esta en mi REF

        const updateTaskForm = {
            title: titleRefUpdate.current?.value || updateTaskData.title,
            description: descriptionRefUpdate.current?.value || updateTaskData.description,
            limitDate: dateRefUpdate.current?.value ? new Date(dateRefUpdate.current.value) : updateTaskData.limitDate, // con el new Date puedo crear una hora desde mi hora formateada si respeta el formato DD/MM/YYY
            email: emailRefUpdate.current?.value || updateTaskData.email,
            completed: CompletedRefUpdate.current?.value || updateTaskData.completed,
            comments: commentValue ? [...updateTaskData.comments, { text: commentValue, reviewed: false }] : updateTaskData.comments, // primero compruebo que no sea NULL con la const de arriba
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
                        <button onClick={toogleMenu}><img className="menu-hamburguesa-li" src={menuHam} alt="menu-icon" /></button>
                        <button className={`li-nav-${theme}`} ><li><strong>Temas</strong></li></button>
                        <button className={`li-nav-${theme}`} onClick={() => themeSelector("default")}><li>Grey</li></button>
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
                    <div className={`open-modal-${theme}`} key={container._id}>
                        <div className={`topContainer-${theme}`}>
                            <h2 className={`title-container-${theme}`} key={container.name}>{container.name}</h2>
                            <button className="CreateTaskButton" onClick={() => openModal(container._id)}>Agregar</button>
                        </div>
                        {tasksArray.length > 0 ? (
                            tasksArray
                                .filter((task) => task.containerId === container._id)  
                                .map((task) => (
                                    <>
                                        <div className={`middleContainer-${theme}`}>
                                            <div className="middleContainer-main">
                                                <button className={task.completed === true ? "completedTaskButton" : "uncompletedTaskButton"} ref={CompletedRefUpdate} onClick={() => markTaskAsCompleted(task._id)}>{task.completed === true ? "✓" : "X"}</button>
                                                <h3 className={`title-task-${theme}`} onClick={() => openModalUpdate(task._id, task)}>{task.title}</h3>
                                                
                                                <button className="deleteTaskButton" onClick={() => deleteTask(task._id)}>Eliminar</button> 
                                            </div>    
                                            
                                            <div className="task-info">
                                                <p className={`date-task-${theme}`}>{task.limitDate === null ? "Sin Fecha Límite" : `Fecha Límite: ${task.limitDate.slice(0, 10)}`}</p>
                                                <p className={`date-task-${theme} task-description`}>{task.description === null ? "Descripción: Aún no Hay" : `Descripción: ${task.description}`}</p>
                                            </div>
                                            <button onClick={() => modalCommentArrow(task._id)} className={`title-task-${theme} commentsArrow`}>{modalComents === task._id ? "🔽 Cerrar Comentarios" : "▶️ Ver Comentarios"}</button>
                                        </div>
                                        <div>
                                            {modalComents === task._id && (
                                                Array.isArray(task.comments) && task.comments.length > 0 ? (
                                                    task.comments.map((comment, index) => (
                                                        <div key={index}>
                                                            <div className={`commentsContainer-${theme}`}>
                                                                <button className={comment.reviewed ? "completedCommentButton" : "unCompletedCommentButton"} onClick={() => markTaskAsCompletedComment(task._id, comment._id)}>{comment.reviewed ? "✓" : "X"} </button>
                                                                <p className={`taskComment-${theme} task-comment-break`}>{comment.text}</p>
                                                                <button className="deleteTaskButton" onClick={() => dispatch(deleteCommentRedux({ taskId: task._id, commentId: comment._id })).then(() => dispatch(readTasks()))}>Eliminar</button>
                                                            </div>
                                                        </div>
                                                ))) : (<p className={`title-task-${theme}`}>No Hay Comentarios</p>))}
                                        </div> 
                                    </>
                                ))) : (<p>No hay tareas disponibles.</p>)}
                        <button className="deleteContainerButton" onClick={() => deleteContainer(container._id)}>Eliminar Contenedor</button>
                    </div>
                ))}

                    {modal ? (
                        <div className="createModal" key={`modal-${modal}`}>
                            <form className="open-modal-create" onSubmit={handleSubmitTask}>
                                <img className="logo-create" src={logo} alt="logo-deep-dev" />
                                <input className="input-task-form" ref={titleRef} placeholder="Nombre de la Tarea" type="text" required />
                                <textarea className="input-task-form-description" ref={descriptionRef} placeholder="Descripción" type="text" />
                                <input className="input-task-form" ref={dateRef} placeholder="Fecha Limite" type="date" />
                                <input className="input-task-form" ref={emailRef} placeholder="Email" type="email" />
                                <div className="createFooter">
                                    <button className="updateTaskButton" type="submit">Crear</button>
                                    <button className="deleteTaskButton" onClick={closeModal}>Cancelar</button>
                                </div>    
                            </form>
                            <div>
                                <img className="createImg" src={createImg} alt="create-update" />
                            </div>
                        </div>
                    ) : ""}

                    {modalUpdate ? (
                        <div className="updateModal" key={`modal-${modalUpdate}`}>
                            <form className="open-modal-update" onSubmit={handleSubmitUpdateTask}>
                            <img className="logo-create" src={logo} alt="logo-deep-dev" />
                                <input className="input-task-formUpdate" ref={titleRefUpdate} placeholder="Nombre de la Tarea" type="text" />
                                <textarea className="input-task-formUpdate-description" ref={descriptionRefUpdate} placeholder="Descripción" type="text" />
                                <input className="input-task-formUpdate" ref={dateRefUpdate} placeholder="Fecha Limite" type="date" />
                                <input className="input-task-formUpdate" ref={emailRefUpdate} placeholder="Email" type="email" />
                                <textarea className="input-task-formUpdate-comments" ref={commentsRefUpdate} placeholder="Comentarios" type="text" />
                                <div className="updateFooter">
                                    <button className="updateTaskButton" type="submit">Actualizar</button>
                                    <button className="deleteTaskButton" onClick={closeModalUpdate}>Cancelar</button>
                                </div>
                            </form>
                            <div>
                                <img className="updateImg" src={updateImg} alt="imagen-update" />
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