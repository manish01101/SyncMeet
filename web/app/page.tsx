"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Video,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  CheckCircle2,
  MonitorUp,
  Lock,
  EyeOff,
  Check,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  const handleJoin = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!email) return alert("Email is required.");

      const targetRoom =
        roomId.trim() || Math.random().toString(36).substring(2, 9);
      router.push(`/room/${targetRoom}?emailId=${encodeURIComponent(email)}`);
    },
    [router, email, roomId],
  );

  return (
    <div
      className={`min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200`}
    >
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 lg:px-12 bg-white/70 backdrop-blur-md fixed w-full z-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Video size={20} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">SyncMeet</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition">
            Features
          </a>
          <a href="#security" className="hover:text-blue-600 transition">
            Security
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
        {/* Left Column - Copy & Form */}
        <div className="flex-1 space-y-8 z-10">
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

          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            SyncMeet delivers ultra-low latency, peer-to-peer video meetings
            straight from your browser. No downloads, no waiting rooms. Just
            secure, instant connection.
          </p>

          {/* Action Form */}
          <form
            onSubmit={handleJoin}
            className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col sm:flex-row gap-2 max-w-2xl"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400"
            />
            <div className="w-px bg-slate-200 hidden sm:block mx-1" />
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room code (optional)"
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder:text-slate-400"
            />
            <button
              type="submit"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group whitespace-nowrap"
            >
              Start Meeting
              <ArrowRight
                size={18}
                className={`transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
              />
            </button>
          </form>

          <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
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

        {/* Right Column - Visual/UI Mockup */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[3rem] transform rotate-3 scale-105 z-0" />
          <div className="relative z-10 bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-gray-800 aspect-video flex flex-col">
            <div className="h-8 bg-gray-800/50 border-b border-gray-700/50 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="flex-1 flex p-4 gap-4">
              <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 relative overflow-hidden group">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                  alt="User"
                  className="w-full h-full object-cover opacity-80 mix-blend-luminosity group-hover:mix-blend-normal transition duration-700"
                />
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-white text-xs font-medium">
                  Sarah Jenkins
                </div>
              </div>
              <div className="w-1/3 flex flex-col gap-4">
                <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=800&auto=format&fit=crop"
                    alt="User"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
                <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 relative overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800&auto=format&fit=crop"
                    alt="User"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-white border-t border-slate-100"
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
            <div className="space-y-4">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
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
            <div className="space-y-4">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
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
            <div className="space-y-4">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Global Infrastructure
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Backed by globally distributed TURN servers, ensuring your calls
                connect reliably.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24 bg-slate-900 text-slate-50">
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

      {/* footer  */}
      <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
            {/* Brand Column */}
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

            {/* Links Columns */}
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

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 text-sm text-slate-500 gap-4">
            <p>
              &copy;{new Date().getFullYear()} SyncMeet All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="#" className="hover:text-slate-900 transition">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-slate-900 transition">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-slate-900 transition">
                Cookie Settings
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
