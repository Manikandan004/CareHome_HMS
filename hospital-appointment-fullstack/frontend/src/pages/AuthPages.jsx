import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "ADMIN" ? "/admin" : user.role === "DOCTOR" ? "/doctor" : "/patient");
    } catch (err) { setError(err.response?.data?.message || "Unable to login. Check the backend server."); }
    finally { setLoading(false); }
  }

  return <AuthFrame title="Welcome back" subtitle="Sign in to continue to your workspace">
    <form onSubmit={submit} className="form-stack">
      <Field icon={Mail} label="Email address"><input type="email" required placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
      <Field icon={LockKeyhole} label="Password"><input type="password" required placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></Field>
      {error && <p className="error-text">{error}</p>}
      <button className="btn btn-primary btn-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
    <p className="auth-switch">New patient? <Link to="/register">Create an account</Link></p>
    <div className="demo-note"><strong>Classroom demo admin</strong><br/>admin@hospital.com / Admin@123</div>
  </AuthFrame>;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form,setForm] = useState({name:"",email:"",password:"",phone:""});
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();setError("");setLoading(true);
    try { await register(form); navigate("/patient"); }
    catch(err) { setError(err.response?.data?.message || "Registration failed."); }
    finally { setLoading(false); }
  }
  return <AuthFrame title="Create patient account" subtitle="Register to find doctors and book appointments">
    <form onSubmit={submit} className="form-stack">
      <Field icon={UserRound} label="Full name"><input required placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></Field>
      <Field icon={Mail} label="Email address"><input type="email" required placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></Field>
      <Field icon={LockKeyhole} label="Password"><input type="password" minLength="6" required placeholder="At least 6 characters" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></Field>
      <Field icon={UserRound} label="Phone (optional)"><input placeholder="Phone number" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></Field>
      {error && <p className="error-text">{error}</p>}
      <button className="btn btn-primary btn-full" disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
    </form>
    <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
  </AuthFrame>;
}

function Field({icon:Icon,label,children}) { return <label className="field"><span>{label}</span><div className="input-wrap"><Icon size={17}/>{children}</div></label>; }
function AuthFrame({title,subtitle,children}) {
  return <div className="auth-page"><div className="auth-left"><div className="brand brand-light"><span className="brand-icon"><Activity size={21}/></span>CarePoint</div><div className="hero-copy"><span className="hero-pill">SIMPLE CARE. BETTER CONNECTION.</span><h1>Your health journey, organised.</h1><p>A simple place for patients, doctors and hospital administrators to manage appointments.</p><div className="hero-stats"><div><strong>3</strong><span>user roles</span></div><div><strong>1</strong><span>easy workflow</span></div><div><strong>24/7</strong><span>access</span></div></div></div><div className="auth-foot">CarePoint Hospital · Learning project</div></div><div className="auth-right"><div className="auth-card"><div className="mobile-brand"><Activity/> CarePoint</div><h2>{title}</h2><p className="muted">{subtitle}</p>{children}</div></div></div>;
}