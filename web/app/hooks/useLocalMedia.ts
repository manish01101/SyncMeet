"use client";

import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { SocketContext } from "../providers/SocketContext";

export const useLocalMedia = (roomId: string, emailId: string | null) => {
  const { socket } = useContext(SocketContext);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Initialize Media
  useEffect(() => {
    let currentStream: MediaStream | null = null;
    const initStream = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        currentStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          // Only set the srcObject if it isn't already set to this stream
          if (videoRef.current.srcObject !== mediaStream) {
            videoRef.current.srcObject = mediaStream;
          }
        }
      } catch (e: any) {
        console.error("Error getting media:", e);
        if (e.name === "NotAllowedError") {
          alert(
            "Camera and Microphone access was denied. Please click the lock icon in your URL bar to allow access, then refresh the page.",
          );
        } else if (e.name === "NotFoundError") {
          alert("No camera or microphone was found on this device.");
        } else {
          alert(
            "Could not access your camera. Please check your system settings.",
          );
        }
      }
    };

    initStream();

    return () => {
      currentStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // Media Toggles
  const toggleAudio = useCallback(() => {
    if (!stream) return;
    const newMutedState = !isMuted;
    stream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !newMutedState));
    setIsMuted(newMutedState);

    // tell the server about audio muted so others can see the UI update
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "media-toggle",
          roomId,
          emailId,
          mediaType: "audio",
          isOff: newMutedState,
        }),
      );
    }
  }, [stream, isMuted, socket, roomId, emailId]);

  const toggleVideo = useCallback(() => {
    if (!stream) return;
    const newVideoState = !isVideoOff;
    stream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !newVideoState));
    setIsVideoOff(newVideoState);

    // tell the server video is paused so others can see the UI update
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(
        JSON.stringify({
          type: "media-toggle",
          roomId,
          emailId,
          mediaType: "video",
          isOff: newVideoState,
        }),
      );
    }
  }, [stream, isVideoOff, socket, roomId, emailId]);

  return { stream, isMuted, isVideoOff, videoRef, toggleAudio, toggleVideo };
};
