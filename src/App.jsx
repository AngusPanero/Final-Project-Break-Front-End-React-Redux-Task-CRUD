import React from 'react'
import AppRouter from "./routes/Routes"
import { AuthProvider } from './routes/components/PrivateContext'
import './App.css'

const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  )
}

export default App
