require("dotenv").config();
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const enforce = require("express-sslify");

connectDB();
const app = express();

app.use(express.json({ extended: false }));

app.use(cors());
app.use(compression());
app.use(enforce.HTTPS({ trustProtoHeader: true }));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/groups", require("./routes/api/groups"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
