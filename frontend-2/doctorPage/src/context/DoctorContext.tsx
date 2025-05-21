import { createContext, ReactNode, useContext } from "react";

// Define the shape of your doctor context data
interface DoctorContextType {
  // Add any properties or methods you need in your doctor context
  // For example:
  // doctorName: string;
  // setDoctorName: (name: string) => void;
}

// Create a context with an initial value of undefined
const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

interface DoctorContextProviderProps {
  children: ReactNode;
}

export function DoctorContextProvider({ children }: DoctorContextProviderProps) {
  // Define your doctor context value here. Adjust according to your needs.
  const contextValue: DoctorContextType = {
    // doctorName: "Dr. Smith",
    // setDoctorName: () => {}
  };

  return (
    <DoctorContext.Provider value={contextValue}>
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctorContext(): DoctorContextType {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error("useDoctorContext must be used within a DoctorContextProvider");
  }
  return context;
}
