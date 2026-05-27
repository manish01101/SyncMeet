import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "./providers/SocketProvider";
import { RemoteUserProvider } from "./providers/RemoteUserProvider";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SyncMeet - Video Chat",
  description: "WebRTC Video Chat App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={bricolage.className}>
        {" "}
        <SocketProvider>
          <RemoteUserProvider>{children}</RemoteUserProvider>
        </SocketProvider>
      </body>
    </html>
  );
}
