import app from './src/app.js';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';
import { initializeSocket } from './src/config/socket.js';
import http from 'http';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Initialize Socket.io
const io = initializeSocket(server);
// Make io available in app
app.set('io', io);

// Connect to Database
connectDB();

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
