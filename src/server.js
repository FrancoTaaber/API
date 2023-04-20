const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const photoController = require("./controllers/photoController");
const logger = require("./logger");
const { createServer } = require("http");
const { Server } = require("socket.io");
const fs = require("fs");




const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Lubage päringuid ainult sellest päritolust
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    },
});

app.use(bodyParser.json());
app.use(cors());

// API routes
app.get("/photos", photoController.getPhotos);
app.get("/photos/:id", photoController.getPhotoById);
app.post("/photos", (req, res) => {
    photoController.addPhoto(req, res, (newPhoto) => {
        logger.info(`Added photo with id: ${newPhoto.id}`);
    });
});

app.put("/photos/:id", (req, res) => {
    photoController.updatePhoto(req, res);
    logger.info(`Updated photo with id: ${req.params.id}`);
});
app.delete("/photos/:id", (req, res) => {
    photoController.deletePhoto(req, res);
    logger.info(`Deleted photo with id: ${req.params.id}`);
});

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


app.io = io;

server.listen(3001, () => {
    console.log("Server is running on port 3001");
});
