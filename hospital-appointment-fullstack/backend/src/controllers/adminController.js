const bcrypt = require("bcryptjs"), User = require("../models/User");
async function list(req, res) {
    res.json(await User.find().select("-password").sort({ createdAt: -1 }));
}
async function doctors(req, res) {
    res.json(await User.find({ role: "DOCTOR" }).select("-password"));
}
async function patients(req, res) {
    res.json(await User.find({ role: "PATIENT" }).select("-password"));
}
async function addDoctor(req, res) {
    try {
        const { name, email, password, phone, specialization } = req.body;

        if (!name || !email || !password || !specialization)
            return res.status(400).json({ message: "Name, email, password and specialization required." });

        if (await User.findOne({ email }))
            return res.status(409).json({ message: "Email already exists." });
        const d = await User.create({ name, email, password: await bcrypt.hash(password, 10), phone, specialization, role: "DOCTOR" });

        res.status(201).json({ message: "Doctor added.", doctor: { id: d.id, name: d.name, email: d.email, specialization: d.specialization } });
    } catch (e) { res.status(500).json({ message: "Could not add doctor.", error: e.message }); }
}
async function update(req, res) {
    const fields = {};["name", "email", "phone", "specialization"].forEach(k => {
        if (req.body[k] !== undefined) fields[k] = req.body[k];
    });

    const user = await User.findByIdAndUpdate(req.params.id, fields, { new: true, runValidators: true }).select("-password");

    if (!user)
        return res.status(404).json({ message: "User not found." });

    res.json({ message: "User updated.", user });
}
async function remove(req, res) { const u = await User.findByIdAndDelete(req.params.id); if (!u) return res.status(404).json({ message: "User not found." }); res.json({ message: "User deleted." }); }
module.exports = { list, doctors, patients, addDoctor, update, remove };
