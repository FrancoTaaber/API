const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const photoController = require("./controllers/photoController");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Only allow requests from this origin
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type"],
    },
});

app.use(bodyParser.json());
app.use(cors());

// API routes
app.get("/photos", photoController.getPhotos);
app.get("/photos/:id", photoController.getPhotoById);
app.post("/photos", photoController.addPhoto);
app.put("/photos/:id", photoController.updatePhoto);
app.delete("/photos/:id", photoController.deletePhoto);

app.io = io; // Lisage see rida enne app.listen

server.listen(3001, () => {
    console.log("Server is running on port 3001");
});
