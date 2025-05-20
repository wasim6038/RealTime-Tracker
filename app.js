const express = require("express");
const socket = require("socket.io");
const http = require("http");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.set("view engine", "ejs");
app.use(express.static("public"));

io.on("connection", (socket) => {
    socket.on("sendLocation", (data) => {
        io.emit("receiveLocation", { id: socket.id, ...data})
    })
    
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id)
    })
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("http://localhost:3000");
});
