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

/* export const readTasks = createAsyncThunk(
    "readTasks",
    async(_, { rejectWithValue }) => {
        try {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                return rejectWithValue("Usuario no Autenticado");
            }
            const token = await currentUser.getIdToken();
            console.log("TOKEN READ TASKS", token);
            const response = await axios.get("http://localhost:2105/read", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json' 
                }
            })
            console.log("Respuesta Read Tasks", response.data);
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.message || "Error en la Solicitud")
        }
    }
) */

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
            //CREATE TASK STATES
            .addCase(postTask.pending, (state) => {
                state.status = "loading";
            })
            .addCase(postTask.fulfilled, (state, action) => {
                console.log("Tarea añadida:", action.payload);
                state.status = "succeeded";
                state.tasksArray.push(action.payload);
            })
            .addCase(postTask.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            })

            //READ TASKS STATES
            /* .addCase(readTasks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(readTasks.fulfilled, (state, action) => {
                console.log("Contenedor Creado:", action.payload);
                state.status = "succeeded";
                state.containersArray = action.payload;
            })
            .addCase(readTasks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload
            }) */

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
                console.log("Contenedor Creado:", action.payload);
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
                console.log("Contenedor Creado:", action.payload);
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