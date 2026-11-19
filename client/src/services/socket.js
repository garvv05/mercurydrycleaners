import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(window.location.origin, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socket;
};

export const joinOrderRoom = (orderId) => {
  const s = getSocket();
  if (s && orderId) {
    s.emit('join_order_room', orderId);
  }
};

export const leaveOrderRoom = (orderId) => {
  const s = getSocket();
  if (s && orderId) {
    s.emit('leave_order_room', orderId);
  }
};

export const joinAdminRoom = () => {
  const s = getSocket();
  if (s) {
    s.emit('join_admin_room');
  }
};
