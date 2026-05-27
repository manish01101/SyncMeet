"use client";

import React, { useEffect, useState, type PropsWithChildren } from "react";
import { SocketContext } from "./SocketContext";

const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    // Rapidly "ping" the server to wake it up if it's on Render Free Tier
    fetch(wsUrl).catch(() => {});
  }, []);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => console.log("Connected to WebSocket Server");
    ws.onclose = () => console.log("Disconnected from Server");

    // The browser hides WS error details. We log a custom message instead.
    ws.onerror = () => {
      console.error(
        `WebSocket connection failed. Make sure your backend server is running at ${wsUrl}`,
      );
    };

    setSocket(ws);

    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
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
