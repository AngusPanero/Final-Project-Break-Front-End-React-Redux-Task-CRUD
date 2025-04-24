import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"

import { getAuth } from "firebase/auth";  // acá me traigo esto para sacar el idToken, para que cada usuario tenga sus tareas, como lo tengo en el BACK
import { app } from '../firebase/config'; 
const auth = getAuth(app);

// CRUD TASKS
export const postTask = createAsyncThunk( // uso Thunk porque asi se maneja la asincronia en Redux
    "postTask",
    async (taskData, { rejectWithValue }) => { // el rejected es para hacer los returns con error o exito como el res. taskData es Parametro
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return rejectWithValue("Usuario no Autenticado");
            }
            const token = await currentUser.getIdToken();
            console.log("TOKEN", token);
            
            const response = await axios.post("http://localhost:2105/create", taskData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)

export const readTasks = createAsyncThunk(
    "readTasks",
    async(_, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return rejectWithValue("Usuario no Autenticado");
            }
            const token = await currentUser.getIdToken();
            console.log("TOKEN READ", token);

            const response = await axios.get("http://localhost:2105/read", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            })
            console.log("Respuesta de Tasks", response.data);
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)

export const deleteTaskRedux = createAsyncThunk(
    "deleteTask",
    async(id, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser
            if(!currentUser){
                return rejectWithValue("Usuario No Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN", token);
            
            const response = await axios.delete(`http://localhost:2105/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)
// ACA ESTA EL COMMIT
export const updateTaskCompleted = createAsyncThunk(
    "updateTaskCompleted",
    async({id, completed}, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser
            if(!currentUser){
                return rejectWithValue("Usuario No Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN COMPLETED", token);

            const response = await axios.put(`http://localhost:2105/updateCompletedTask/${id}`, { completed }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)

export const updateCommentRedux = createAsyncThunk(
    "updateCommentRedux",
    async({ taskId, commentId, reviewed }, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser
            if(!currentUser){
                return rejectWithValue("Usuario No Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN COMMENT", token);

            const response = await axios.put(`http://localhost:2105/updateComment/${taskId}/${commentId}`, { reviewed }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)

export const deleteCommentRedux = createAsyncThunk(
    "deleteCommentRedux",
    async({taskId, commentId}, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser
            if(!currentUser){
                return rejectWithValue("Usuario no Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN DELETE COMMENT", token);
            
            const response = await axios.delete(`http://localhost:2105/deleteComment/${taskId}/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "aplication/json"
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message, "Error en la Solicitud")
        }
    }
)

export const updatedTask = createAsyncThunk(
    "updateTask",
    async({ id, updateTaskForm }, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser;
            if(!currentUser){
                return rejectWithValue("Usuario no Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN UPDATE", token);

            const response = await axios.put(`http://localhost:2105/update/${id}`, updateTaskForm, {
                headers : {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)

//CRUD CONTAINERS
export const createContainer = createAsyncThunk(
    "createContainer",
    async(containerData, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser
            if(!currentUser){
                return rejectWithValue("Usuario no Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN CONTAINER", token);
            
            const response = await axios.post("http://localhost:2105/createContainer", containerData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)
export const readContainers = createAsyncThunk(
    "readContainers",
    async(_, {rejectWithValue})  => { //acá pongo un guion bajo ya que el reject tiene que ser 2do parametro 
        try {
            const currentUser = auth.currentUser
            if(!currentUser){
                return rejectWithValue("Usuario no Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN READ CONTAINER", token);
            
            const response = await axios.get("http://localhost:2105/readContainers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            console.log("Respuesta de Contenedores", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    })

export const deleteContainer = createAsyncThunk(
    "deleteContainer",
    async(id, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser
            if(!currentUser){
                return rejectWithValue("Usuario no Autenticado")
            }
            const token = await currentUser.getIdToken()
            console.log("TOKEN DELETE CONTAINER", token)

            const response = await axios.delete(`http://localhost:2105/deleteContainer/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
)

const taskSlice = createSlice({
    name: "taskSlice",
    initialState: {
        tasksArray: [],
        containersArray: [],
        status: "idle", // idle es el valor inicial antes de que ejecute la peticion
        error: null
    },
    reducers:{// reducers se usa para cuando tengo que hacer algo sincrono

    }, 
    extraReducers: (actualState) => { // extraReducers para cuando tengo que hacer asincronía
        actualState
// TASKS        
            //CREATE TASK STATES
            .addCase(postTask.pending, (state) => {
                state.status = "loading";
            })
            .addCase(postTask.fulfilled, (state, action) => {
                console.log("Tarea añadida:", action.payload);
                state.status = "succeeded";
            })
            .addCase(postTask.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            //READ TASK STATES
            .addCase(readTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(readTasks.fulfilled, (state, action) => {
                console.log("Tareas Obtenidas:", action.payload);
                state.status = "succeeded";
                state.tasksArray = action.payload;
            })
            .addCase(readTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            // UPDATE COMPLETED TASK
            .addCase(updateTaskCompleted.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateTaskCompleted.fulfilled, (state, action) => {
                console.log("Task Actualizada:", action.payload);
                state.status = "succeeded";
                
                const updatedTask = action.payload;
                
                state.tasksArray = state.tasksArray.map((task) =>
                    task._id === updatedTask._id ? { ...task, completed: updatedTask.completed } : task
                );
            })
            .addCase(updateTaskCompleted.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            // UPDATE COMPLETED COMMENT
            .addCase(updateCommentRedux.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updateCommentRedux.fulfilled, (state, action) => {
                console.log("Task Actualizada:", action.payload);
                state.status = "succeeded";
            
                const updatedTask = action.payload;
            
                state.tasksArray = state.tasksArray.map((task) =>
                    task._id === updatedTask._id ? updatedTask : task
                );
            })
            .addCase(updateCommentRedux.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            // UPDATE TASK
            .addCase(updatedTask.pending, (state) => {
                state.status = "loading";
            })
            .addCase(updatedTask.fulfilled, (state, action) => {
                console.log("Task Actualizada:", action.payload);
                state.status = "succeeded";
                
                const updatedTask = action.payload;
                
                state.tasksArray = state.tasksArray.map((task) =>
                    task._id === updatedTask._id ? { ...task, ...updatedTask} : task
                );
            })
            .addCase(updatedTask.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            // DELETE TASK
            .addCase(deleteTaskRedux.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteTaskRedux.fulfilled, (state, action) => {
                console.log("Contenedor Borrado:", action.payload);
                state.status = "succeeded";
                state.tasksArray = state.tasksArray.filter(task => task._id !== action.payload._id);
            })
            .addCase(deleteTaskRedux.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })
//CONTAINERS
            //CREATE CONTAINER STATES
            .addCase(createContainer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createContainer.fulfilled, (state, action) => {
                console.log("Contenedor Creado:", action.payload);
                state.status = "succeeded";
                state.containersArray.push(action.payload);
            })
            .addCase(createContainer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            //READ CONTAINER STATES
            .addCase(readContainers.pending, (state) => {
                state.status = "loading";
            })
            .addCase(readContainers.fulfilled, (state, action) => {
                console.log("Contenedor Leído:", action.payload);
                state.status = "succeeded";
                state.containersArray = action.payload;
            })
            .addCase(readContainers.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            //DELETE CONTAINER STATES
            .addCase(deleteContainer.pending, (state) => {
                state.status = "loading";
            })
            .addCase(deleteContainer.fulfilled, (state, action) => {
                console.log("Contenedor Borrado:", action.payload);
                state.status = "succeeded";
                state.containersArray = state.containersArray.filter(container => container._id !== action.payload._id);
            })
            .addCase(deleteContainer.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })
    }
})

export default taskSlice.reducer;