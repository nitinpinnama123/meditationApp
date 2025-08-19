import React, { createContext, useContext, useState } from "react";

// 1. Create the ThemeContext
const ThemeContext = createContext();

// 2. Create the ThemeProvider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Create a custom hook for using the theme
export const useTheme = () => {
  return useContext(ThemeContext);
};