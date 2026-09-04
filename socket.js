const { Server } = require('socket.io');

let io;

function init(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: ['http://localhost:5173', 'http://localhost', 'http://localhost:80'], credentials: true },
  });

  io.on('connection', (socket) => {
    const count = io.engine.clientsCount;
    console.log(`User connected: ${socket.id} (online: ${count})`);

    io.emit('user_connected', { id: socket.id, count });

    socket.on('join_category', (category) => {
      socket.join(category);
      socket.emit('joined_category', category);
    });

    socket.on('leave_category', (category) => {
      socket.leave(category);
    });

    socket.on('disconnect', () => {
      const remaining = io.engine.clientsCount;
      console.log(`User disconnected: ${socket.id} (online: ${remaining})`);
      io.emit('user_disconnected', { id: socket.id, count: remaining });
    });
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.IO not initialized');
  return io;
}

module.exports = { init, getIO };
