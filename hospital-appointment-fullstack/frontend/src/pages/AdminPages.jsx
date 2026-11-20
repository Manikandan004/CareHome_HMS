import { useEffect, useState } from "react";
import { Users, Stethoscope, UserRound, Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../api";

export function AdminOverview() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/admin/users").then(r => setUsers(r.data)).catch(e => setError(e.response?.data?.message || "Could not load users.")); }, []);
  const doctors = users.filter(u => u.role === "DOCTOR").length, patients = users.filter(u => u.role === "PATIENT").length;
  return <><PageTitle eyebrow="ADMINISTRATION" title="Dashboard" subtitle="Manage hospital users from one place." />
    {error && <p className="error-text">{error}</p>}
    <div className="stats-grid"><Stat icon={Users} label="Total users" value={users.length} /><Stat icon={Stethoscope} label="Doctors" value={doctors} /><Stat icon={UserRound} label="Patients" value={patients} /></div>
    <section className="panel"><h3>Recently added users</h3><UserTable users={users.slice(0, 6)} /></section>
  </>;
}

export function AdminUsers({ role }) {
  const [users, setUsers] = useState([]), [error, setError] = useState(""), [show, setShow] = useState(false), [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", specialization: "" });
  const isDoctor = role === "DOCTOR";
  const endpoint = isDoctor ? "/admin/doctors" : "/admin/patients";

  async function load() { try { const r = await api.get(endpoint); setUsers(r.data); setError(""); } catch (e) { setError(e.response?.data?.message || "Unable to load records."); } }

  useEffect(() => { load(); }, [role]);

  function openAdd() { setEditing(null); setForm({ name: "", email: "", password: "", phone: "", specialization: "" }); setShow(true); }

  function openEdit(u) { setEditing(u); setForm({ name: u.name, email: u.email, password: "", phone: u.phone || "", specialization: u.specialization || "" }); setShow(true); }

  async function save(e) {
    e.preventDefault(); setError("");
    try {

      if (editing) {
        const payload = { name: form.name, email: form.email, phone: form.phone };
        if (isDoctor) payload.specialization = form.specialization;
        await api.put(`/admin/users/${editing._id}`, payload);
      }

      else { await api.post("/admin/doctors", form); }

      setShow(false);
      await load();
    } catch (err) { setError(err.response?.data?.message || "Could not save user."); }
  }
  async function remove(u) {
    if (!window.confirm(`Delete ${u.name}?`)) return;
    try { await api.delete(`/admin/users/${u._id}`); await load(); } catch (e) { setError(e.response?.data?.message || "Could not delete user."); }
  }
  return <><PageTitle eyebrow="USER MANAGEMENT" title={isDoctor ? "Doctors" : "Patients"} subtitle={isDoctor ? "Add and maintain doctor profiles." : "View and maintain registered patient accounts."} />
    <div className="toolbar"><span className="muted">{users.length} records</span>{isDoctor && <button className="btn btn-primary" onClick={openAdd}><Plus size={17} /> Add doctor</button>}</div>
    {error && <p className="error-text">{error}</p>}
    <section className="panel"><UserTable users={users} onEdit={openEdit} onDelete={remove} /></section>
    {show && <Modal title={editing ? "Update doctor" : "Add new doctor"} onClose={() => setShow(false)}><form className="form-stack" onSubmit={save}>
      <label className="field"><span>Name</span><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
      <label className="field"><span>Email</span><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
      {!editing && <label className="field"><span>Temporary password</span><input type="password" minLength="6" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>}
      <label className="field"><span>Phone</span><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></label>
      <label className="field"><span>Specialization</span><input required value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} /></label>
      <div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={() => setShow(false)}>Cancel</button><button className="btn btn-primary">{editing ? "Save changes" : "Create doctor"}</button></div>
    </form></Modal>}
  </>;
}

function UserTable({ users, onEdit, onDelete }) {
  if (!users.length) return <div className="empty-state"><Users size={30} /><strong>No users found</strong><span>Records will appear here.</span></div>;
  return <div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Specialization / Phone</th>{(onEdit || onDelete) && <th>Actions</th>}</tr></thead><tbody>{users.map(u => <tr key={u._id}><td><div className="table-person"><div className="avatar small">{u.name?.[0]}</div><strong>{u.name}</strong></div></td><td>{u.email}</td><td><span className={`role-pill ${u.role.toLowerCase()}`}>{u.role}</span></td><td>{u.specialization || u.phone || "—"}</td>{(onEdit || onDelete) && <td><div className="action-row">{onEdit && <button className="icon-button" title="Edit" onClick={() => onEdit(u)}><Pencil size={16} /></button>}{onDelete && <button className="icon-button danger" title="Delete" onClick={() => onDelete(u)}><Trash2 size={16} /></button>}</div></td>}</tr>)}</tbody></table></div>;
}
function Stat({ icon: Icon, label, value }) { return <div className="stat-card"><div className="stat-icon"><Icon size={20} /></div><span>{label}</span><strong>{value}</strong></div> }
export function PageTitle({ eyebrow, title, subtitle }) { return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{subtitle}</p></div> }
function Modal({ title, onClose, children }) { return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><h3>{title}</h3><button className="icon-button" onClick={onClose}><X size={18} /></button></div>{children}</div></div>; }