const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");



dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:5173", // adjust to your frontend origin
    methods: ["GET", "POST"]
  }
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_DB_LINK, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));




// Socket.IO Real-time Chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("sendMessage", ({ sender, receiver, message }) => {
    socket.broadcast.emit("receiveMessage", { sender, message });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


// Default Route
app.get("/", (req, res) => res.send("App is running"));


// Start Server
const PORT = process.env.PORT || 5500;
server.listen(PORT, () => console.log("Server is running on port", PORT));
