"use client";
import "../../envConfig";

import React, { useEffect, useState, type PropsWithChildren } from "react";
import { SocketContext } from "./SocketContext";

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Only connects on the client side
    const ws = new WebSocket(
      process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000",
    );

    ws.onopen = () => console.log("Connected to WebSocket Server");
    ws.onclose = () => console.log("Disconnected from Server");
    ws.onerror = (err) => console.error("WebSocket Error:", err);

    setSocket(ws);

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
