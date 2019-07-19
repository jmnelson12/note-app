import React, { createContext, useState } from "react";
const { Provider, Consumer } = createContext();

const ThemeProvider = ({ children, defaultTheme }) => {
    const [theme, setTheme] = useState(defaultTheme || "light");

    return (
        <Provider
            value={{
                theme,
                setTheme
            }}>
            {children}
        </Provider>
    );
};

export { ThemeProvider };

// making this default because it will be used most
export default Consumer;
