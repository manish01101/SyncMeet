"use client";

import { useState } from "react";
import { RemoteUserContext } from "./RemoteUserContext";

export const RemoteUserProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [remoteEmailId, setRemoteEmailId] = useState<string | null>(null);

  return (
    <RemoteUserContext.Provider value={{ remoteEmailId, setRemoteEmailId }}>
      {children}
    </RemoteUserContext.Provider>
  );
};
