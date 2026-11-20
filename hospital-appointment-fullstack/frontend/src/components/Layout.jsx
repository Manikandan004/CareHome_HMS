import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, CalendarDays, Users, Stethoscope, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = user?.role === "ADMIN"
    ? [{ to: "/admin", label: "Overview", icon: LayoutDashboard },
       { to: "/admin/doctors", label: "Doctors", icon: Stethoscope },
       { to: "/admin/patients", label: "Patients", icon: Users }]
    : user?.role === "DOCTOR"
    ? [{ to: "/doctor", label: "Appointments", icon: CalendarDays }]
    : [{ to: "/patient", label: "Find a doctor", icon: Stethoscope },
       { to: "/patient/appointments", label: "My appointments", icon: CalendarDays }];

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-icon"><Activity size={21}/></span><span>CarePoint</span></div>
        <div className="nav-caption">WORKSPACE</div>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <Icon size={18}/><span>{label}</span>
          </NavLink>
        ))}
        <div className="sidebar-bottom">
          <div className="user-mini"><div className="avatar">{user?.name?.[0] || "U"}</div><div><strong>{user?.name}</strong><small>{user?.role}</small></div></div>
          <button className="logout-button" onClick={handleLogout}><LogOut size={17}/> Sign out</button>
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><span className="eyebrow">HOSPITAL MANAGEMENT</span><h2>Welcome, {user?.name}</h2></div><div className="topbar-tag">● System online</div></header>
        <div className="page-content"><Outlet/></div>
      </main>
    </div>
  );
}