import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io';

// ENVIRONMENT VARIABLE CONFIGRATION
dotenv.config();

// EXPRESS SERVER 
const app = express();
// SERVER PORT NUMBER
const port = process.env.PORT;
// ENABLE ALL PORTS IN CORS
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });

  socket.on("user_typing", (data) => {
    socket.to(data.room).emit("typing", data);
  })
});

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});