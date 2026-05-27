"use client";

import { createContext, useContext } from "react";

interface RemoteUserContextType {
  remoteEmailId: string | null;
  setRemoteEmailId: (email: string | null) => void;
}

export const RemoteUserContext = createContext<RemoteUserContextType | null>(
  null,
);

export const useRemoteUser = () => {
  const context = useContext(RemoteUserContext);
  if (!context) {
    throw new Error("useRemoteUser must be used within a RemoteUserProvider");
  }
  return context;
};
