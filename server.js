const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const compression = require("compression");
const enforce = require("express-sslify");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

connectDB();
const app = express();

app.use(express.json({ extended: false }));

if (process.env.NODE_ENV === "production") {
  app.use(cors());
  app.use(compression());
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profiles"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/groups", require("./routes/api/groups"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
