import React, { createContext, useContext, useEffect, useState } from 'react';
import { getSocket, joinAdminRoom, joinOrderRoom } from '../services/socket';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { admin } = useAuth();
  const [newBookingAlert, setNewBookingAlert] = useState(null);
  const [unreadAlerts, setUnreadAlerts] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Play gentle ding using Web Audio API (no external sound file needed)
  const playAlertSound = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.45);
    } catch (e) {
      // AudioContext could be blocked by autoplay policies
    }
  };

  useEffect(() => {
    const socket = getSocket();

    if (admin) {
      joinAdminRoom();
    }

    const handleNewBooking = (bookingData) => {
      setNewBookingAlert(bookingData);
      setUnreadAlerts((prev) => [bookingData, ...prev]);
      playAlertSound();
    };

    socket.on('admin:new_booking', handleNewBooking);
    socket.on('broadcast:new_booking', handleNewBooking);

    return () => {
      socket.off('admin:new_booking', handleNewBooking);
      socket.off('broadcast:new_booking', handleNewBooking);
    };
  }, [admin, soundEnabled]);

  const clearAlert = () => setNewBookingAlert(null);
  const markAlertsRead = () => setUnreadAlerts([]);

  return (
    <SocketContext.Provider
      value={{
        newBookingAlert,
        clearAlert,
        unreadAlerts,
        markAlertsRead,
        soundEnabled,
        setSoundEnabled,
        playAlertSound
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useLiveSocket = () => useContext(SocketContext);
