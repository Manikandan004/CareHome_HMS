const Appointment = require("../models/Appointment"),
    User = require("../models/User");

const valid = (d, t) => /^\d{4}-\d{2}-\d{2}$/.test(d || "") && /^\d{2}:\d{2}$/.test(t || "") && +t.slice(0, 2) <= 23 && +t.slice(3, 5) <= 59;

async function taken(doctor, date, time, ignore) {
    const q = { doctor, date, time, status: "BOOKED" };
    if (ignore) q._id = { $ne: ignore }; return Appointment.exists(q);
}
async function doctors(req, res) {
    res.json(await User.find({ role: "DOCTOR" }).select("name email phone specialization"));
}

async function book(req, res) {

    try {
        const { doctorId, date, time } = req.body;

        if (!doctorId || !valid(date, time))
            return res.status(400).json({ message: "Send doctorId, date YYYY-MM-DD and time HH:mm." });

        if (new Date(date + "T" + time + ":00") <= new Date())
            return res.status(400).json({ message: "Choose a future date and time." });

        if (!await User.findOne({ _id: doctorId, role: "DOCTOR" }))
            return res.status(404).json({ message: "Doctor not found." });

        if (await taken(doctorId, date, time))
            return res.status(409).json({ message: "Time slot already booked." });
        const a = await Appointment.create({ patient: req.user.id, doctor: doctorId, date, time });
        await a.populate("doctor", "name specialization");
        res.status(201).json({ message: "Appointment booked.", appointment: a });
    } catch (e) { res.status(500).json({ message: "Could not book appointment.", error: e.message }); }
}
async function myAppointments(req, res) {
    res.json(await Appointment.find({ patient: req.user.id }).populate("doctor", "name specialization").sort({ date: 1, time: 1 }));
}


async function update(req, res) {
    const { date, time } = req.body; if (!valid(date, time) || new Date(date + "T" + time + ":00") <= new Date())
        return res.status(400).json({ message: "Enter a valid future date and time." });
    const a = await Appointment.findOne({ _id: req.params.id, patient: req.user.id });

    if (!a) return res.status(404).json({ message: "Appointment not found." });

    if (a.status !== "BOOKED") return res.status(400).json({ message: "Only booked appointments can be updated." });

    if (await taken(a.doctor, date, time, a.id))
        return res.status(409).json({ message: "Time slot already booked." });
    a.date = date;
    a.time = time;
    await a.save();

    res.json({ message: "Appointment updated.", appointment: a });
}
async function cancel(req, res) {
    const a = await Appointment.findOne({ _id: req.params.id, patient: req.user.id });
    if (!a)
        return res.status(404).json({ message: "Appointment not found." });
    if (a.status !== "BOOKED")
        return res.status(400).json({ message: "Only booked appointments can be cancelled." });
    a.status = "CANCELLED";
    await a.save();
    res.json({ message: "Appointment cancelled." });
}
module.exports = { doctors, book, myAppointments, update, cancel };
