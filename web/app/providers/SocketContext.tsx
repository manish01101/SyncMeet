"use client";

import { createContext } from "react";

interface ISocketContext {
  socket: WebSocket | null;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
});
