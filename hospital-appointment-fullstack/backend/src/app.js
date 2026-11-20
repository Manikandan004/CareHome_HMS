const express = require("express"),
    cors = require("cors"),
    app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json(
    { message: "Hospital Appointment API is running." })
);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/doctor", require("./routes/doctorRoutes"));

app.use((req, res) => res.status(404).json({ message: "API route not found." }));
module.exports = app;
