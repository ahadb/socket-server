const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
var cors = require('cors')
var faker = require("faker")

const port = process.env.PORT || 1337;
const index = require("./routes/index");

const app = express();
app.use(index);
app.use(cors);

const server = http.createServer(app);
const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => emitDateAndTimeFromAPI(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const emitDateAndTimeFromAPI = socket => {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  const date = new Date();
  const response = {
    firstName: firstName,
    lastName: lastName,
    date: date
  };

  socket.emit("DateAndTimeFromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));
