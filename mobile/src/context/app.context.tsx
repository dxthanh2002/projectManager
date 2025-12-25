import { createContext, useContext, useState } from "react";

interface AppContextType {
    theme: string;
    setTheme: (v: string) => void;
}
const AppContext = createContext<AppContextType | null>(null);

interface IProps {
    children: React.ReactNode
}

const AppProvider = (props: IProps) => {
    const [theme, setTheme] = useState<string>("eric-light");

    return (
        <AppContext.Provider value={{
            theme, setTheme,
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export const useCurrentApp = () => {
    const currentTheme = useContext(AppContext);

    if (!currentTheme) {
        throw new Error(
            "useCurrentApp has to be used within <AppContext.Provider>"
        );
    }

    return currentTheme;
};

export default AppProvider;
