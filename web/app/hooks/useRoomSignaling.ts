"use client";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../providers/SocketContext";
import PeerContext from "../providers/PeerContext";

export const useRoomSignaling = (
  roomId: string,
  emailId: string | null,
  localStream: MediaStream | null,
) => {
  const { socket } = useContext(SocketContext);
  const {
    remoteStreams,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    addIceCandidate,
    removePeer,
  } = useContext(PeerContext);

  const [remoteMediaStates, setRemoteMediaStates] = useState<
    Record<string, { audio: boolean; video: boolean }>
  >({});

  useEffect(() => {
    if (!socket || !localStream || !emailId) return;

    const handleMessage = async (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case "other-joined": {
            const offer = await createOffer(data.emailId, localStream);
            if (offer && socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: "call-user",
                  emailId: data.emailId,
                  offer,
                }),
              );
            }
            break;
          }
          case "incoming-call": {
            const answer = await createAnswer(
              data.from,
              data.offer,
              localStream,
            );
            if (answer && socket.readyState === WebSocket.OPEN) {
              socket.send(
                JSON.stringify({
                  type: "call-accepted",
                  emailId: data.from,
                  answer,
                }),
              );
            }
            break;
          }
          case "call-accepted":
            await setRemoteAnswer(data.from, data.answer);
            break;
          case "ice-candidate":
            await addIceCandidate(data.from, data.candidate);
            break;
          case "user-left":
            removePeer(data.emailId);
            break;
          case "media-toggle":
            setRemoteMediaStates((prev) => ({
              ...prev,
              [data.emailId]: {
                ...prev[data.emailId],
                [data.mediaType]: data.isOff,
              },
            }));
            break;
        }
      } catch (e) {
        console.error("Socket error:", e);
      }
    };

    socket.addEventListener("message", handleMessage);

    // Announce presence when ready
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "join-room", roomId, emailId }));
    }

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [
    socket,
    localStream,
    emailId,
    roomId,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    addIceCandidate,
    removePeer,
  ]);

  return { remoteStreams, remoteMediaStates };
};
