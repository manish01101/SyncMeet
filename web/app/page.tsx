"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  Shield,
  Zap,
  CheckCircle2,
  MonitorUp,
  Lock,
  EyeOff,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleCreateRoom = useCallback(() => {
    if (!email) return alert("Please enter your email first.");

    // Generate a random 7-character room code
    const targetRoom =
      roomId.trim() || Math.random().toString(36).substring(2, 9);
    router.push(`/room/${targetRoom}?emailId=${encodeURIComponent(email)}`);
  }, [router, email]);

  const handleJoinRoom = useCallback(() => {
    if (!email) return alert("Please enter your email first.");
    if (!roomId.trim()) return alert("Please enter a room code to join.");

    router.push(`/room/${roomId.trim()}?emailId=${encodeURIComponent(email)}`);
  }, [router, email, roomId]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200 overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 bg-white/70 backdrop-blur-md fixed w-full z-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SyncMeet</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="#features" className="hover:text-blue-600 transition">
            Features
          </Link>
          <Link href="#security" className="hover:text-blue-600 transition">
            Security
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="min-h-[100svh] pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 relative z-10">
        {/* Left Column - Copy & Form */}
        <div className="w-full lg:w-2/3 space-y-6 lg:space-y-8 z-10 lg:pr-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Enterprise WebRTC 2.0 Live
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            Crystal clear video. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Zero friction.
            </span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            SyncMeet delivers ultra-low latency, peer-to-peer video meetings
            straight from your browser. No downloads, no waiting rooms. Just
            secure, instant connection.
          </p>

          {/* Action Card (Start or Join) */}
          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-5 max-w-md w-full relative z-20">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                Your Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@email.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Custom Room ID Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 ml-1">
                Room Code
              </label>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Custom ID (optional)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 font-mono transition-all uppercase"
              />
            </div>

            <button
              onClick={handleCreateRoom}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Video size={18} />
              New Meeting
            </button>

            <div className="flex items-center gap-3 mt-2">
              <div className="h-px bg-slate-200 flex-1" />
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                or join existing
              </span>
              <div className="h-px bg-slate-200 flex-1" />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room code"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400 font-mono uppercase"
              />
              <button
                onClick={handleJoinRoom}
                className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-all"
              >
                Join
              </button>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium pt-2">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> Free
              forever
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> No sign up
              required
            </span>
          </div>
        </div>

        {/* Right Column - Animated UI Visualization */}
        <div className="w-full lg:w-1/3 relative hidden lg:block">
          {/* Abstract background glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 blur-[120px] rounded-full z-0 pointer-events-none" />

          <div className="relative z-10 w-full aspect-square max-w-[500px] mx-auto">
            {/* Center Node (You) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-600 rounded-3xl shadow-[0_0_40px_rgba(37,99,235,0.4)] flex items-center justify-center z-20 animate-pulse border-4 border-white/10 backdrop-blur-xl">
              <Video size={32} className="text-white" />
            </div>

            {/* Orbiting Connection Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-slate-200/50 rounded-full animate-[spin_20s_linear_infinite]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border border-slate-200/50 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

            {/* Floating Participant Nodes */}
            <div
              className="absolute top-[10%] left-[20%] w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                A
              </div>
            </div>

            <div
              className="absolute top-[30%] right-[10%] w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 animate-bounce"
              style={{ animationDelay: "0.5s", animationDuration: "3.5s" }}
            >
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                B
              </div>
            </div>

            <div
              className="absolute bottom-[20%] left-[15%] w-16 h-16 bg-slate-900 rounded-2xl shadow-xl flex items-center justify-center border border-slate-800 animate-bounce"
              style={{ animationDelay: "1s", animationDuration: "4s" }}
            >
              <MonitorUp size={24} className="text-blue-400" />
            </div>

            <div
              className="absolute bottom-[10%] right-[25%] w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100 animate-bounce"
              style={{ animationDelay: "1.5s", animationDuration: "3.2s" }}
            >
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold text-sm">
                C
              </div>
            </div>

            {/* Connecting SVG Lines */}
            <svg className="absolute inset-0 w-full h-full z-10 opacity-20 pointer-events-none">
              <line
                x1="50%"
                y1="50%"
                x2="28%"
                y2="18%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-blue-500 animate-pulse"
              />
              <line
                x1="50%"
                y1="50%"
                x2="82%"
                y2="38%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-blue-500 animate-pulse"
              />
              <line
                x1="50%"
                y1="50%"
                x2="23%"
                y2="72%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-blue-500 animate-pulse"
              />
              <line
                x1="50%"
                y1="50%"
                x2="67%"
                y2="82%"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="text-blue-500 animate-pulse"
              />
            </svg>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-white border-t border-slate-100 relative z-20"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Built for performance and simplicity
            </h2>
            <p className="text-lg text-slate-600">
              Everything you need for seamless video collaboration, without the
              bloat of traditional enterprise software.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Peer-to-Peer Speed
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Direct connections mean ultra-low latency. Your video doesn't
                route through unnecessary servers, ensuring real-time
                conversation.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                <MonitorUp size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Crisp Screen Sharing
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Swap your camera feed for your screen instantly. Share specific
                windows, browser tabs, or your entire desktop.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                End-to-End Encrypted
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Your media streams are encrypted by default using DTLS-SRTP. Not
                even we can see or hear your meetings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section
        id="security"
        className="py-24 bg-slate-900 text-slate-50 relative z-20"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm font-medium border border-slate-700">
              <Shield size={16} className="text-emerald-400" />
              Enterprise-Grade Security
            </div>

            <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
              Your meetings are{" "}
              <span className="text-emerald-400">private by design.</span>
            </h2>

            <p className="text-lg text-slate-400 leading-relaxed">
              We believe your data is yours. SyncMeet is built on a foundation
              of zero-trust architecture, ensuring that your conversations
              remain strictly between you and your participants.
            </p>

            <div className="space-y-6 pt-4">
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-slate-800 p-2 rounded-lg text-emerald-400">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">DTLS-SRTP Encryption</h4>
                  <p className="text-slate-400 mt-1">
                    All media streams are encrypted end-to-end. We don't have
                    the keys to decrypt your video, audio, or screen shares.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 bg-slate-800 p-2 rounded-lg text-emerald-400">
                  <EyeOff size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-lg">Ephemeral Rooms</h4>
                  <p className="text-slate-400 mt-1">
                    Room states exist only while the meeting is active. Once the
                    last person leaves, all routing data is instantly destroyed.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full" />
              <div className="relative h-full w-full bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-3xl p-8 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-700 pb-4">
                  <span className="font-mono text-sm">Connection Status</span>
                  <span className="flex items-center gap-2 text-emerald-400 text-sm">
                    <CheckCircle2 size={16} /> Secure P2P
                  </span>
                </div>
                <div className="space-y-4 font-mono text-xs text-slate-500">
                  <p>&gt; Initializing WebRTC...</p>
                  <p className="text-slate-300">
                    &gt; Generating local ICE candidates...
                  </p>
                  <p>&gt; Exchanging session descriptions...</p>
                  <p>&gt; Establishing DTLS transport...</p>
                  <p className="text-emerald-400">
                    &gt; Media channels encrypted and active.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8 relative z-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg">
                  <Video size={18} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight text-slate-900">
                  SyncMeet
                </span>
              </div>
              <p className="text-slate-500 max-w-sm leading-relaxed">
                Crystal clear, zero-friction video meetings built for modern
                teams. Secure, fast, and straight from your browser.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Product</h4>
              <ul className="space-y-3 text-sm text-slate-600">
                <li>
                  <Link
                    href="#features"
                    className="hover:text-blue-600 transition"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#security"
                    className="hover:text-blue-600 transition"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 text-sm text-slate-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} SyncMeet. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-slate-900 transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-slate-900 transition">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
