import { createContext, ReactNode, useContext } from "react";

// Define the shape of your context data
interface AppContextType {
  // Add any properties or methods you need in your context
  // For example:
  // user: string;
  // setUser: (name: string) => void;
}

// Create a context with an initial value of undefined
const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  // Define your context value here. Adjust according to your needs.
  const contextValue: AppContextType = {
    // user: "Guest",
    // setUser: () => {}
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
}
