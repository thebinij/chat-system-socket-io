import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import chatRoutes from "./routes/chatRoutes.js"
import msgRoutes from "./routes/msgRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import cors from "cors";
import { users } from "./database/users.js"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;
const server = createServer(app);

server.listen(PORT, console.log(`Server running on PORT ${PORT}...`));

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
});

app.use(express.json());
app.use(cors())

// Routes
app.get("/", (req, res) => {
  res.send("Backend is working fine!");
});

app.use("/api/chat", chatRoutes);
app.use("/api/message", msgRoutes);
app.use("/api/user", userRoutes);


io.on("connection", (socket) => {
  console.log("Connected using socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    users.push(userData)
    socket.emit("connected");
  });
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((userId) => {
       if (userId == newMessageRecieved.senderId) return;
      socket.in(userId).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User Disconnected!");
    socket.leave(userData._id);
  });
});
