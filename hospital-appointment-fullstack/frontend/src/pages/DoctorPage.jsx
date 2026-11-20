import { useEffect, useState } from "react";
import { CalendarDays, Clock, CheckCircle2, MessageSquare } from "lucide-react";
import api from "../api";
import { PageTitle } from "./AdminPages";

export default function DoctorPage() {
    const [appointments, setAppointments] = useState([]), [comments, setComments] = useState({}), [error, setError] = useState(""), [message, setMessage] = useState("");

    async function load() {
        try {
            const r = await api.get("/doctor/appointments");
            setAppointments(r.data);
            setError("");
        } catch (e) { setError(e.response?.data?.message || "Unable to load appointments."); }
    }

    useEffect(() => {
        load();
    }, []);

    async function complete(a) {
        setError("");
        setMessage("");
        try {
            await api.patch(`/doctor/appointments/${a._id}/complete`,
                { comment: comments[a._id] || "" });
            setMessage("Appointment marked as completed.");
            load();
        }
        catch (e) { setError(e.response?.data?.message || "Could not complete appointment."); }
    }

    const booked = appointments.filter(a => a.status === "BOOKED").length;

    return <><PageTitle eyebrow="DOCTOR PORTAL" title="My appointments" subtitle="Review your patient bookings and record completion notes." />

        <div className="stats-grid compact"><div className="stat-card"><div className="stat-icon"><CalendarDays /></div><span>Total appointments</span><strong>{appointments.length}</strong></div><div className="stat-card"><div className="stat-icon"><Clock /></div><span>Awaiting completion</span><strong>{booked}</strong></div></div>

        {message && <p className="success-text">{message}</p>}{error && <p className="error-text">{error}</p>}

        <div className="doctor-appointment-list">
            {appointments.map(a => <div className="panel doctor-appointment" key={a._id}><div className="appointment-top"><div>
                <span className="eyebrow">PATIENT APPOINTMENT</span>
                <h3>{a.patient?.name || "Patient"}</h3>

                <p className="muted">{a.patient?.email}</p>

            </div><span className={`status-pill ${a.status.toLowerCase()}`}>{a.status}</span>

            </div><div className="appointment-meta"><span><CalendarDays size={15} />{a.date}</span>
                    <span><Clock size={15} />{a.time}</span>

                </div>{a.status === "BOOKED" ? <div className="completion-box">

                    <label className="field">

                        <span><MessageSquare size={15} /> Doctor comments (required)</span>

                        <textarea rows="2" placeholder="Add a short note about the consultation..." value={comments[a._id] || ""}
                            onChange={e => setComments({ ...comments, [a._id]: e.target.value })} /></label>

                    <button className="btn btn-primary" onClick={() => complete(a)}><CheckCircle2 size={17} /> Mark as completed</button>

                </div> : <div className="doctor-comment"><strong>Doctor comment:</strong>

                    {a.doctorComment || "No comment added."}</div>}</div>)}</div>


        {!appointments.length && <div className="panel empty-state"><CalendarDays size={30} /><strong>No appointments assigned</strong><span>Patient bookings will appear here.</span></div>}
    </>;
}