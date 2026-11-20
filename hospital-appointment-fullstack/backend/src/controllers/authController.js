const bcrypt = require("bcryptjs"),

    jwt = require("jsonwebtoken"),

    User = require("../models/User");

const token = (id, role) => jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
);

async function register(req, res) {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "Name, email and password are required." });

        if (password.length < 6)
            return res.status(400).json({ message: "Password must be at least 6 characters." });

        if (await User.findOne({ email }))
            return res.status(409).json({ message: "Email already registered." });

        // password = password.set(bcrypt.hash(password,10));
        const user = await User.create({ name, email, password: await bcrypt.hash(password, 10), phone, role: "PATIENT" });

        res.status(201).json({
            message: "Patient registered.",
            token: token(user.id, user.role),
            user: { id: user.id, name, email, role: user.role }
        });

    } catch (e) { res.status(500).json({ message: "Registration failed.", error: e.message }); }
}
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD)
            return res.json({ message: "Admin login successful.", token: token("admin", "ADMIN"), user: { id: "admin", email, role: "ADMIN" } });

        const user = await User.findOne({ email }).select("+password");

        if (!user || !(await bcrypt.compare(password || "", user.password))) return res.status(401).json({ message: "Invalid email or password." });

        res.json({ message: "Login successful.", token: token(user.id, user.role), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (e) { res.status(500).json({ message: "Login failed." }); }
}
module.exports = { register, login };
