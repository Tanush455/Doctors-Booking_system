import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AdminContextProvider } from './context/AdminContext.tsx'
import { DoctorContextProvider } from './context/DoctorContext.tsx'
import { AppContextProvider } from './context/Appcontext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>
  </StrictMode>,
)
