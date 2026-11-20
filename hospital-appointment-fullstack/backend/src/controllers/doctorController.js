const Appointment = require("../models/Appointment");

async function appointments(req, res) {
    res.json(await Appointment.find({ doctor: req.user.id }).populate("patient", "name email phone").sort({ date: 1, time: 1 }));
}
async function complete(req, res) {
    const { comment } = req.body;

    if (!comment?.trim())
        return res.status(400).json({ message: "Please add a comment." });

    const a = await Appointment.findOne({ _id: req.params.id, doctor: req.user.id });

    if (!a)
        return res.status(404).json({ message: "Appointment not found." });

    if (a.status !== "BOOKED")
        return res.status(400).json({ message: "Only booked appointments can be completed." });
    a.status = "COMPLETED";
    a.doctorComment = comment;
    await a.save();
    res.json({ message: "Appointment completed.", appointment: a });
}
module.exports = { appointments, complete };
