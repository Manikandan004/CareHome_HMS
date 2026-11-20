const r = require("express").Router(),
    c = require("../controllers/appointmentController"),
    { protect, allowRoles } = require("../middleware/auth");
r.use(protect, allowRoles("PATIENT"));
r.get("/doctors", c.doctors);
r.post("/appointments", c.book);
r.get("/appointments", c.myAppointments);
r.put("/appointments/:id", c.update);
r.delete("/appointments/:id", c.cancel);
module.exports = r;
