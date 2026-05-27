"use client";

import { createContext } from "react";

export interface IPeerContext {
  remoteStreams: Map<string, MediaStream>;
  createOffer: (
    remoteId: string,
    stream: MediaStream,
  ) => Promise<RTCSessionDescriptionInit | undefined>;
  createAnswer: (
    remoteId: string,
    offer: RTCSessionDescriptionInit,
    stream: MediaStream,
  ) => Promise<RTCSessionDescriptionInit | undefined>;
  setRemoteAnswer: (
    remoteId: string,
    answer: RTCSessionDescriptionInit,
  ) => Promise<void>;
  addIceCandidate: (
    remoteId: string,
    candidate: RTCIceCandidateInit,
  ) => Promise<void>;
  sendStream: (remoteId: string, stream: MediaStream) => Promise<void>;
  removePeer: (remoteId: string) => void;
}

export const PeerContext = createContext<IPeerContext>({
  remoteStreams: new Map(),
  createOffer: async () => undefined,
  createAnswer: async () => undefined,
  setRemoteAnswer: async () => {},
  addIceCandidate: async () => {},
  sendStream: async () => {},
  removePeer: () => {},
});

export default PeerContext;
