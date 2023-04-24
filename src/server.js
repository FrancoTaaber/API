const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const photoController = require("./controllers/photoController");
const logger = require("./logger");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");
const authMiddleware = require("./auth");
const jwt = require("jsonwebtoken");
const config = require("./config");
const rateLimit = require("express-rate-limit");

// Configure rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this IP, please try again after 15 minutes."
});


// Dummy users for testing purposes
const dummyUsers = [
    {
        id: 1,
        email: "test@example.com",
        password: "password",
    },
    {
        id: 2,
        email: "another@example.com",
        password: "anotherpassword",
    },
];


// Set up the Express app and socket.io server
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Lubage päringuid ainult sellest päritolust
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    },
});

// Middleware configuration
app.use(bodyParser.json());
app.use(cors());
app.use("/photos", apiLimiter);
app.use("/login", apiLimiter);


// API routes
app.get("/photos", photoController.getPhotos);
app.get("/photos/:id", photoController.getPhotoById);
app.post("/photos", authMiddleware, (req, res) => {
    const userId = req.user.id;
    photoController.addPhoto(req, res, userId, (newPhoto) => {
        logger.info(`Added photo with id: ${newPhoto.id}`);
    });
});

app.put("/photos/:id", authMiddleware, (req, res) => {
    const userId = req.user.id;
    photoController.updatePhoto(req, res, userId);
    logger.info(`Updated photo with id: ${req.params.id}`);
});

app.delete("/photos/:id", authMiddleware, (req, res) => {
    const userId = req.user.id;
    photoController.deletePhoto(req, res, userId);
    logger.info(`Deleted photo with id: ${req.params.id}`);
});

// Route for getting log files
app.get("/logs", (req, res) => {
    fs.readFile("logs.csv", "utf8", (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error reading logs file" });
        } else {
            res.set("Content-Type", "text/csv");
            res.set("Content-Disposition", "inline");
            res.send(data);
        }
    });
});

// Route for handling login
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = dummyUsers.find(
        (u) => u.email === email && u.password === password
    );
    if (user) {
        const token = jwt.sign({ id: user.id }, config.jwtSecret, {
            expiresIn: "1h",
        });
        res.json({ token });
    } else {
        res.status(401).json({ error: "Invalid email or password" });
    }
});

// Attach the socket.io server to the app
app.io = io;

// Start the server
server.listen(3001, () => {
    console.log("Server is running on port 3001");
});
module.exports = server;
