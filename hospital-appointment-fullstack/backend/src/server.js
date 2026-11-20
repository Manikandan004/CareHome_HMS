require("dotenv").config();
const app = require("./app"),
    connectDB = require("./config/db");

(async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT || 5000, () => console.log("Server running on port " + (process.env.PORT || 5000)));
    } catch (e) {
        console.error("Startup failed:", e.message);
        process.exit(1);
    }
}
)();
