require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();
app.use(express.json({ extended: false }));

app.use("/api/users", require("./routes/api/users"));
// app.use("/api/google", require("./routes/auth/social"));
app.use("/api/profile", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/groups", require("./routes/api/groups"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
