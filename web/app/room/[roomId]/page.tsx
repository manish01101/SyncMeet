"use client";

import { PeerProvider } from "@/app/providers/PeerProvider";
import RoomClient from "./RoomClient";

export default function RoomPage() {
  return (
    <PeerProvider>
      <RoomClient />
    </PeerProvider>
  );
}
