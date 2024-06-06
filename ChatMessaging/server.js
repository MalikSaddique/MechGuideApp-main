const io = require('socket.io')(3000, {
    cors: {
      origin: '*',
    },
  });
  
  io.on('connection', (socket) => {
    console.log('a user connected', socket.id);
  
    socket.on('join', (roomId) => {
      socket.join(roomId);
      console.log('user joined room', roomId);
    });
  
    socket.on('message', (data) => {
      console.log('message received', data);
      io.to(data.roomId).emit('message', data);
    });
  
    socket.on('disconnect', () => {
      console.log('user disconnected', socket.id);
    });
  });
  
  console.log('Socket.io server running on port 3000');
  