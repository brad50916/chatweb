import React, { createContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { API_URL } from "./Api";
export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(API_URL);

    newSocket.on("connect", () => {});

    newSocket.on("disconnect", () => {});

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
