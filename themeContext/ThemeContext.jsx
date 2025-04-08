import { useContext, createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [ theme, setTheme ] = useState("blue");

    const themeSelector = (selectecTheme) => {
        setTheme(selectecTheme)
        localStorage.setItem("theme", JSON.stringify(selectecTheme));
    }

    useEffect(() => {
        document.body.classList.remove("default", "dark", "light", "blue", "purple")
        document.body.classList.add(theme)
    }, [theme])

    return(
        <>
            <ThemeContext.Provider value={{ theme, themeSelector }}>
                { children }
            </ThemeContext.Provider>    
        </>
    )
};

const useTheme = () => useContext(ThemeContext);

export default useTheme;