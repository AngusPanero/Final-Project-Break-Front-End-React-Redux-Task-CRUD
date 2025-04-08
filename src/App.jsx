import React from 'react'
import AppRouter from "./routes/Routes"
import { AuthProvider } from './routes/components/PrivateContext'
import './App.css'
import { ThemeProvider } from '../themeContext/ThemeContext'

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </AuthProvider>
  )
}

export default App
