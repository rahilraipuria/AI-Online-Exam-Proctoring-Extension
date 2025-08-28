import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from "cors";


const app = express();


dotenv.config({
  path: './.env' 
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"]
  }
});


app.use(cors());


    const port = process.env.PORT || 8000;
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  


app.use(express.static('public'));

let recipientId;

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('frontend', (data) => {
    recipientId = data.socketId;
    console.log(`Client registered with ID: ${data.socketId}`);
});

  socket.on('tabVisibilityChanged', (data) => {
    io.to(recipientId).emit('tabVisibilityChanged', data);
    console.log('Tab visibility changed:', data);
    
  });

  
  socket.on('windowFocusChanged', (data) => {
    io.to(recipientId).emit('windowFocusChanged', data);
    console.log('Window focus state changed:', data);
  });

  
  socket.on('copyEvent', (data) => {
    io.to(recipientId).emit('copyEvent', data);
    console.log(`Copy event received. Content:`, data.content);
  });

  socket.on('pasteEvent', (data) => {
    io.to(recipientId).emit('pasteEvent', data);
    console.log(`Paste event received. Content:`, data.content);
  });

  socket.on('cutEvent', (data) => {
    io.to(recipientId).emit('cutEvent', data);
    console.log(`Cut event received. Content:`, data.content);
  });

  socket.on('fullscreenChanged', (data) => {
    io.to(recipientId).emit('fullscreenChanged', data);
    console.log('Fullscreen state changed:', data);
  });

  socket.on('typeSpeed', (data) => {
    io.to(recipientId).emit('typeSpeed', data);
    console.log('TypeSpeed changed:', data);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });

  socket.on('mouseEvents', (data) => {
    const { recipientId, mouseMovements } = data;
    if (recipientId) {
      io.to(recipientId).emit('mouseEvents', { mouseMovements });
    }
    console.log('Mouse Details', mouseMovements);
  });
});



