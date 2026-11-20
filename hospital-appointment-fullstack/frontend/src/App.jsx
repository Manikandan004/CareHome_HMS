import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { AdminOverview, AdminUsers } from "./pages/AdminPages";
import { FindDoctor, PatientAppointments } from "./pages/PatientPages";
import DoctorPage from "./pages/DoctorPage";

function DashboardRedirect(){
 const {user}=useAuth();
 return <Navigate to={user?.role==="ADMIN"?"/admin":user?.role==="DOCTOR"?"/doctor":"/patient"} replace/>;
}
function AppRoutes(){
 return <Routes>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<RegisterPage/>}/>
  <Route path="/" element={<DashboardRedirect/>}/>
  <Route path="/dashboard" element={<DashboardRedirect/>}/>
  <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
   <Route path="/admin" element={<ProtectedRoute roles={["ADMIN"]}><AdminOverview/></ProtectedRoute>}/>
   <Route path="/admin/doctors" element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers role="DOCTOR"/></ProtectedRoute>}/>
   <Route path="/admin/patients" element={<ProtectedRoute roles={["ADMIN"]}><AdminUsers role="PATIENT"/></ProtectedRoute>}/>
   <Route path="/patient" element={<ProtectedRoute roles={["PATIENT"]}><FindDoctor/></ProtectedRoute>}/>
   <Route path="/patient/appointments" element={<ProtectedRoute roles={["PATIENT"]}><PatientAppointments/></ProtectedRoute>}/>
   <Route path="/doctor" element={<ProtectedRoute roles={["DOCTOR"]}><DoctorPage/></ProtectedRoute>}/>
  </Route>
  <Route path="*" element={<DashboardRedirect/>}/>
 </Routes>;
}
export default function App(){return <AuthProvider><AppRoutes/></AuthProvider>;}