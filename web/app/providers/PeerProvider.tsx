"use client";

import "../../envConfig";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import PeerContext from "./PeerContext";
import { SocketContext } from "./SocketContext";

const stunUrls = JSON.parse(process.env.NEXT_PUBLIC_STUN_SERVERS || "[]");

export const PeerProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { socket } = useContext(SocketContext);

  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );

  // function to remove a peer
  const removePeer = useCallback((remoteId: string) => {
    const peer = peersRef.current.get(remoteId);
    if (peer) {
      peer.close();
      peersRef.current.delete(remoteId);
    }
    setRemoteStreams((prev) => {
      const newMap = new Map(prev);
      newMap.delete(remoteId);
      return newMap;
    });
    console.log(`Peer removed: ${remoteId}`);
  }, []);

  // 1. create peer connection
  const createPeer = useCallback(
    (remoteId: string) => {
      const peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: stunUrls,
          },
        ],
      });

      peer.ontrack = (ev) => {
        const stream = ev.streams[0];
        setRemoteStreams((prev) => {
          const newMap = new Map(prev);
          newMap.set(remoteId, stream);
          return newMap;
        });
      };

      peer.onicecandidate = (event) => {
        if (event.candidate && socket?.readyState === WebSocket.OPEN) {
          socket.send(
            JSON.stringify({
              type: "ice-candidate",
              to: remoteId,
              candidate: event.candidate,
            }),
          );
        }
      };

      //listen for disconnections or network failures
      peer.oniceconnectionstatechange = () => {
        if (
          peer.iceConnectionState === "disconnected" ||
          peer.iceConnectionState === "failed"
        ) {
          removePeer(remoteId);
        }
      };

      peersRef.current.set(remoteId, peer);
      return peer;
    },
    [socket, removePeer],
  );

  // 2. Send Stream
  const sendStream = useCallback(
    async (remoteId: string, stream: MediaStream) => {
      let peer = peersRef.current.get(remoteId);
      if (!peer) peer = createPeer(remoteId);

      stream.getTracks().forEach((track) => {
        if (peer && !peer.getSenders().find((s) => s.track === track)) {
          peer.addTrack(track, stream);
        }
      });
    },
    [createPeer],
  );

  // 3. Create Offer
  const createOffer = useCallback(
    async (remoteId: string, stream: MediaStream) => {
      let peer = peersRef.current.get(remoteId);
      if (!peer) peer = createPeer(remoteId);

      stream.getTracks().forEach((track) => {
        if (peer && !peer.getSenders().find((s) => s.track === track)) {
          peer.addTrack(track, stream);
        }
      });

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      return offer;
    },
    [createPeer],
  );

  // 4. Create Answer
  const createAnswer = useCallback(
    async (
      remoteId: string,
      offer: RTCSessionDescriptionInit,
      stream: MediaStream,
    ) => {
      let peer = peersRef.current.get(remoteId);
      if (!peer) peer = createPeer(remoteId);

      stream.getTracks().forEach((track) => {
        if (peer && !peer.getSenders().find((s) => s.track === track)) {
          peer.addTrack(track, stream);
        }
      });

      await peer.setRemoteDescription(offer);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      return answer;
    },
    [createPeer],
  );

  // 5. Set Remote Answer
  const setRemoteAnswer = useCallback(
    async (remoteId: string, answer: RTCSessionDescriptionInit) => {
      const peer = peersRef.current.get(remoteId);
      if (peer) {
        await peer.setRemoteDescription(answer);
      }
    },
    [],
  );

  // 6. Add ICE Candidate
  const addIceCandidate = useCallback(
    async (remoteId: string, candidate: RTCIceCandidateInit) => {
      const peer = peersRef.current.get(remoteId);
      if (peer) {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    },
    [],
  );

  useEffect(() => {
    return () => {
      peersRef.current.forEach((peer) => peer.close());
      peersRef.current.clear();
      setRemoteStreams(new Map());
    };
  }, []);

  return (
    <PeerContext.Provider
      value={{
        remoteStreams,
        createOffer,
        createAnswer,
        setRemoteAnswer,
        addIceCandidate,
        sendStream,
        removePeer,
      }}
    >
      {children}
    </PeerContext.Provider>
  );
};
