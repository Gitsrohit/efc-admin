export const connectToWebSocket = (onMessage) => {
    const socket = new WebSocket("ws://localhost:8085"); // Adjust the WebSocket URL as needed
  
    socket.onopen = () => {
      console.log("WebSocket connected");
    };
  
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);
      onMessage(data);
    };
  
    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };
  
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  
    return socket;
  };
  