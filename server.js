const express = require("express");
const favicon = require("express-favicon");
const helmet = require("helmet");
const path = require("path");
const bodyParser = require("body-parser");
const sslRedirect = require("heroku-ssl-redirect");
const cors = require("cors");

const app = express();
const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 8080;

const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const noteRoutes = require("./routes/note");
const authMiddleware = require("./middleware/auth");

// connect to database
connectDB(isDev);

// Middleware
app.use(favicon(__dirname + "/frontend/build/favicon.ico"));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// basic expressjs security
app.use(cors());
app.use(helmet());
app.disable("x-powered-by");

// api routes
app.use("/user", userRoutes);
app.use(authMiddleware);
app.use("/note", noteRoutes);

// production
if (!isDev) {
    // app.use(sslRedirect());
    app.use(express.static(__dirname));
    app.use(express.static(path.join(__dirname, "frontend", "build")));

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
    });
}

app.listen(port, () => console.log(`Server running on port: ${port}`));
