import React, { createContext, ReactNode, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

const lightTheme = {
  colors: {
    background: "#ffffff",
    text: "#000000",
    primary: "#8b0000",
    card: "#f5f5f5",
  },
};

const darkTheme = {
  colors: {
    background: "#121212",
    text: "#ffffff",
    primary: "#bb86fc",
    card: "#1e1e1e",
  },
};

export const ThemeContext = createContext({
  theme: lightTheme,
  darkMode: false,
  toggleDarkMode: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme = useColorScheme();
  const [darkMode, setDarkMode] = useState(systemScheme === "dark");

  useEffect(() => {
    setDarkMode(systemScheme === "dark");
  }, [systemScheme]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
