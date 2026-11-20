const r = require("express").Router(),
    c = require("../controllers/doctorController"),
    { protect, allowRoles } = require("../middleware/auth");
r.use(protect, allowRoles("DOCTOR"));
r.get("/appointments", c.appointments);
r.patch("/appointments/:id/complete", c.complete);
module.exports = r;
