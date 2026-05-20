const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const authRoutes = require('./modules/auth/auth.routes');
const propertyRoutes = require('./modules/properties/property.routes');
const aiRoutes = require('./modules/ai/ai.routes');
const agentRoutes = require('./modules/users/agent.routes');
const commissionRoutes = require('./modules/commissions/commission.routes');
const seoRoutes = require('./modules/seo/seo.routes');
const videoRoutes = require('./modules/videos/video.routes');
const cesiumRoutes = require('./modules/cesium/cesium.routes');
const paymentRoutes = require('./modules/payments/payment.routes');
const favoriteRoutes = require('./modules/users/favorite.routes');
const contractRoutes = require('./modules/commissions/contract.routes');
const reportRoutes = require('./modules/ai/report.routes');
dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: '🚀 AI RealEstate API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/commissions', commissionRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/cesium', cesiumRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/reports', reportRoutes);
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
    console.log(`👤 ${socket.id} joined room ${roomId}`);
  });
  socket.on('offer', ({ roomId, offer }) => {
    socket.to(roomId).emit('offer', { offer, from: socket.id });
  });
  socket.on('answer', ({ roomId, answer }) => {
    socket.to(roomId).emit('answer', { answer, from: socket.id });
  });
  socket.on('ice-candidate', ({ roomId, candidate }) => {
    socket.to(roomId).emit('ice-candidate', { candidate, from: socket.id });
  });
  socket.on('chat-message', ({ roomId, message, user }) => {
    io.to(roomId).emit('chat-message', { message, user, time: new Date() });
  });
  socket.on('speech-to-speech', async ({ roomId, transcription, targetLang, user }) => {
    io.to(roomId).emit('speech-translated', {
      original: transcription,
      targetLang,
      user,
      time: new Date()
    });
  });
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

app.set('io', io);

const PORT = process.env.PORT || 5080;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 API available at http://localhost:${PORT}`);
  console.log(`🔌 Socket.io ready for real-time communication`);
});

module.exports = app;