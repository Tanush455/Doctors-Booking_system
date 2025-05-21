import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import { useAdminContext } from "./context/AdminContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AddDoctor from "./components/AddDoctor";
import Dashboard from "./components/Dashboard";
import { Appointments } from "./components/Appointments";
import { DoctorList } from "./components/DoctorList";
import AppointmentDetails from "./components/AppointmentDetails";
import AddCaptcha from "./components/AddCaptcha";
import AdminChat from "./components/chatComponent";

function App() {
  const { token } = useAdminContext();

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          
          {/* Protected admin routes */}
          <Route 
            path="/admin/content" 
            element={token ? <Admin /> : <Navigate to="/login" replace />}
          >
            <Route index path="dashboard" element={<Dashboard/>}></Route>
            <Route path="appointments" element={<Appointments/>}></Route>
            <Route path="doctor-list" element={<DoctorList/>}></Route>
            <Route path="add-doctor" element={<AddDoctor/>}></Route>
            <Route path="addCaptha" element={<AddCaptcha/>}></Route>
            <Route path="chat" element={<AdminChat/>}></Route>
          </Route>
          {/* Login route with redirect if already authenticated */}
          <Route 
            path="/login" 
            element={
              !token ? <Login /> : <Navigate to="/admin/content/dashboard" replace />
            } 
          />

          {/* Doctor content route (to be implemented) */}
          <Route 
            path="/doctor/content" 
            element={token ? <div>Doctor Content</div> : <Navigate to="/login" replace />}
          />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </div>
  );
}

export default App;
