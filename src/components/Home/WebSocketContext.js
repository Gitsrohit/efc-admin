import React, { createContext, useContext, useEffect, useState } from "react";
import { connectToWebSocket } from "../Home/WebSocket";
import sound from "../../public/assets/notification-sound-3-262896.mp3"

const WebSocketContext = createContext();

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Function to play a sound when a new order is received
  const playNotificationSound = () => {
    const audio = new Audio(sound); // Replace with a valid sound URL or file path
    audio.play();
  };

  // Show system notification (default sound)
  const showSystemNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("New online order received!");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("New online order received!");
        }
      });
    }
  };

  // Show a UI notification message
  const showNotification = (message) => {
    setNotificationMessage(message);
    setTimeout(() => {
      setNotificationMessage(""); // Clear message after 5 seconds
    }, 5000);
  };

  useEffect(() => {
    const socket = connectToWebSocket((newOrder) => {
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      setUnreadMessages((prevCount) => prevCount + 1); // Increment unread message count

      // Trigger system notification, play sound and show UI message
      showSystemNotification();
      playNotificationSound(); // Play custom sound
      showNotification("New online order received!");
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ orders, unreadMessages,setUnreadMessages }}>
      {children}
      {notificationMessage && (
        <div className="fixed top-0 right-0 bg-red-600 text-white py-2 px-4 rounded-lg shadow-lg">
          {notificationMessage}
        </div>
      )}
    </WebSocketContext.Provider>
  );
};
