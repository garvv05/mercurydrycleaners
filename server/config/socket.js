let io = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    // Join specific order room for tracking updates
    socket.on('join_order_room', (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
      }
    });

    socket.on('leave_order_room', (orderId) => {
      if (orderId) {
        socket.leave(`order_${orderId}`);
      }
    });

    // Admin room for new booking notifications
    socket.on('join_admin_room', () => {
      socket.join('admin_channel');
    });

    socket.on('disconnect', () => {
      // client disconnected
    });
  });

  return io;
};

const getIO = () => {
  return io;
};

const emitNewBooking = (bookingData) => {
  if (io) {
    io.to('admin_channel').emit('admin:new_booking', bookingData);
    io.emit('broadcast:new_booking', bookingData);
  }
};

const emitOrderStatusUpdate = (orderId, updateData) => {
  if (io) {
    io.to(`order_${orderId}`).emit('order:status_updated', updateData);
    io.emit('broadcast:order_status_update', updateData);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitNewBooking,
  emitOrderStatusUpdate
};
