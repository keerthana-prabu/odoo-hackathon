const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth",           require("./routes/auth"));
app.use("/api/trips",          require("./routes/trips"));
app.use("/api/trips/:id",      require("./routes/itinerary"));
app.use("/api/trips/:id/budget", require("./routes/budget"));
app.use("/api/trips/:id/packing", require("./routes/packing"));
app.use("/api/trips/:id/notes",   require("./routes/notes"));
app.use("/api/admin",          require("./routes/admin"));
app.use("/api/profile", require("./routes/profile"));
app.get("/", (req, res) => res.json({ message: "Traveloop API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));