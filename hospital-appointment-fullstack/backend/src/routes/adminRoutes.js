const r = require("express").Router(),
    c = require("../controllers/adminController"),
    { protect, allowRoles } = require("../middleware/auth");
r.use(protect, allowRoles("ADMIN"));
r.get("/users", c.list);
r.get("/doctors", c.doctors);
r.get("/patients", c.patients);
r.post("/doctors", c.addDoctor);
r.put("/users/:id", c.update);
r.delete("/users/:id", c.remove);
module.exports = r;
