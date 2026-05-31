"use client";

import { useContext, useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Users,
  ShieldCheck,
  MonitorUp,
} from "lucide-react";
import { useLocalMedia } from "@/app/hooks/useLocalMedia";
import { useRoomSignaling } from "@/app/hooks/useRoomSignaling";

// ==============    UI Sub-Components     =================

const RoomHeader = ({ roomId, participantCount, emailId }: any) => (
  <header className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-20">
    <div className="flex items-center gap-3">
      <div className="bg-emerald-500 h-2 w-2 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
      <h1 className="font-semibold tracking-tight text-white">
        Room: <span className="text-blue-400">{roomId}</span>
      </h1>
    </div>
    <div className="hidden md:flex items-center gap-4 text-sm text-slate-300 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 shadow-lg">
      <ShieldCheck size={16} className="text-emerald-400" />
      <span className="flex items-center gap-2">
        <Users size={16} /> {participantCount}
      </span>
      <span className="h-4 w-[1px] bg-white/20" />
      <span>{emailId}</span>
    </div>
  </header>
);

const RoomControls = ({
  isMuted,
  isVideoOff,
  isScreenSharing,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onLeave,
}: any) => (
  <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
    <div className="flex items-center gap-4 bg-[#1a1d23]/80 border border-white/10 p-4 rounded-3xl shadow-2xl backdrop-blur-2xl">
      <button
        onClick={onToggleAudio}
        className={`h-12 w-12 flex items-center justify-center rounded-2xl transition-all ${
          isMuted
            ? "bg-red-500/20 text-red-500"
            : "bg-slate-700/50 text-white hover:bg-slate-600"
        }`}
      >
        {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      <button
        onClick={onToggleVideo}
        className={`h-12 w-12 flex items-center justify-center rounded-2xl transition-all ${
          isVideoOff
            ? "bg-red-500/20 text-red-500"
            : "bg-slate-700/50 text-white hover:bg-slate-600"
        }`}
      >
        {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
      </button>

      {/* Screen Share Button */}
      <button
        onClick={onToggleScreenShare}
        className={`h-12 w-12 flex items-center justify-center rounded-2xl transition-all ${
          isScreenSharing
            ? "bg-blue-500/20 text-blue-500 ring-2 ring-blue-500/50"
            : "bg-slate-700/50 text-white hover:bg-slate-600"
        }`}
      >
        <MonitorUp size={20} />
      </button>
      <div className="w-px h-8 bg-white/10 mx-2" />
      <button
        onClick={onLeave}
        className="h-12 px-6 flex items-center justify-center rounded-2xl bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/20"
      >
        <PhoneOff size={20} className="mr-2" />
        <span className="font-semibold text-sm">Leave</span>
      </button>
    </div>
  </footer>
);

const LocalVideo = ({ videoRef, isVideoOff, isMuted }: any) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ startX: 0, startY: 0 });
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle the start of the drag (mouse down / touch start)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = true;
    dragRef.current.startX = e.clientX - position.x;
    dragRef.current.startY = e.clientY - position.y;

    // Capture the pointer so dragging works even if the mouse moves outside the box fast
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  // handle movement
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    const newX = e.clientX - dragRef.current.startX;
    const newY = e.clientY - dragRef.current.startY;
    setPosition({ x: newX, y: newY });
  };

  // handle mouse up / touch end
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      className="absolute bottom-8 right-8 w-32 md:w-64 aspect-video rounded-2xl overflow-hidden border border-white/20 shadow-2xl z-50 bg-black touch-none cursor-grab active:cursor-grabbing"
    >
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-contain transform scale-x-[-1] transition-opacity duration-300 pointer-events-none ${
          isVideoOff ? "opacity-0" : "opacity-100"
        }`}
      />
      {isVideoOff && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <VideoOff className="text-slate-500" size={32} />
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-[10px] uppercase tracking-wider px-2 py-1 rounded text-white font-bold pointer-events-none">
        You {isMuted && "• Muted"}
      </div>
    </div>
  );
};

const RemoteVideo = ({
  email,
  stream,
  isHero = false,
  isAudioMuted = false,
  isVideoOff = false,
}: any) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl || !stream) return;

    if (videoEl.srcObject !== stream) {
      videoEl.srcObject = stream;
    }

    const playPromise = videoEl.play();
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Video play error:", error);
        }
      });
    }
  }, [stream]);

  return (
    <div
      className={`relative w-full h-full bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 ${
        isHero ? "ring-1 ring-blue-500/30" : ""
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          isVideoOff ? "opacity-0" : "opacity-100"
        }`}
      />
      {isVideoOff && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
          <div className="h-16 w-16 bg-slate-800 rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl text-white font-bold">
              {email[0].toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-slate-400">Video Paused</p>
        </div>
      )}
      <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
        <p className="text-xs font-medium text-white flex items-center gap-2">
          {email.split("@")[0]}
          {isAudioMuted && <MicOff size={14} className="text-red-400" />}
        </p>
      </div>
    </div>
  );
};

// ===================       Main Component      =======================

export default function RoomClient() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = params.roomId as string;
  const myEmailId = searchParams.get("emailId");

  // state managed by custom hooks
  const {
    stream,
    isMuted,
    isVideoOff,
    isScreenSharing,
    videoRef,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
  } = useLocalMedia(roomId, myEmailId);
  const { remoteStreams, remoteMediaStates } = useRoomSignaling(
    roomId,
    myEmailId,
    stream,
  );

  // Derived state
  const remoteEntries = Array.from(remoteStreams.entries());
  const hasRemoteParticipants = remoteEntries.length > 0;
  const remoteCount = remoteEntries.length;

  // dynamically calculate the grid layout
  let gridLayout = "grid-cols-1 grid-rows-1";
  if (remoteCount === 2) {
    gridLayout = "grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1";
  } else if (remoteCount === 3 || remoteCount === 4) {
    gridLayout = "grid-cols-1 md:grid-cols-2 grid-rows-2";
  } else if (remoteCount > 4) {
    gridLayout = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-rows-auto";
  }

  return (
    <div className="h-screen w-full bg-[#0f1115] flex flex-col overflow-hidden font-sans text-slate-200">
      <RoomHeader
        roomId={roomId}
        participantCount={remoteCount + 1}
        emailId={myEmailId}
      />

      <main className="flex-1 relative flex items-center justify-center p-4 md:p-8 mt-16 mb-24 overflow-hidden">
        {hasRemoteParticipants ? (
          <div
            className={`w-full h-full max-w-7xl mx-auto grid gap-4 transition-all duration-500 ${gridLayout}`}
          >
            {remoteEntries.map(([email, remoteStream]) => (
              <div
                key={email}
                className="w-full h-full relative flex items-center justify-center"
              >
                <RemoteVideo
                  email={email}
                  stream={remoteStream}
                  isAudioMuted={remoteMediaStates[email]?.audio}
                  isVideoOff={remoteMediaStates[email]?.video}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full space-y-4 w-full">
            <div className="w-64 h-64 rounded-full border border-white/5 flex items-center justify-center bg-white/5 backdrop-blur-3xl animate-pulse">
              <p className="text-slate-400 text-sm italic">
                Waiting for others to join...
              </p>
            </div>
          </div>
        )}

        {/* Local Self-View */}
        <LocalVideo
          videoRef={videoRef}
          isVideoOff={isVideoOff}
          isMuted={isMuted}
        />
      </main>

      <RoomControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isScreenSharing={isScreenSharing}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onLeave={() => router.push("/")}
      />
    </div>
  );
}
