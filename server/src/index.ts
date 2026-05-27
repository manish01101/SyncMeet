import express, { type Request, type Response } from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// websocket with custom state
interface CustomWebSocket extends WebSocket {
  email?: string;
  roomId?: string;
  isAlive: boolean; // for heartbeat to remove ghost connection
}

// structure of incoming messages
interface SignalMessage {
  type: string;
  emailId?: string;
  roomId?: string;
  to?: string;
  offer?: any;
  answer?: any;
  candidate?: any;
  mediaType?: string;
  isOff?: boolean;
}

const app = express();

const allowedOrigins = process.env.WEB_URL
  ? [process.env.WEB_URL, "http://localhost:3000"]
  : "*";

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// mapping
const emailToSocket = new Map<string, CustomWebSocket>();
const rooms = new Map<string, Map<string, CustomWebSocket>>();

// WebSocket Endpoint
wss.on("connection", (ws: CustomWebSocket) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  // handle the msg
  ws.on("message", (message: WebSocket.RawData) => {
    try {
      const messageAsString = message.toString();
      const data = JSON.parse(messageAsString) as SignalMessage;

      if (!data.type) return;
      const { type } = data;

      if (type === "join-room") {
        const email = data.emailId;
        const roomId = data.roomId;

        if (!email || !roomId) return;

        console.log(`User ${email} joined room ${roomId}`);

        // if email already has a socket, clean it up to prevent ghosts
        const oldSocket = emailToSocket.get(email);
        if (oldSocket && oldSocket !== ws) {
          oldSocket.terminate();
        }

        // assign state to new socket
        ws.email = email;
        ws.roomId = roomId;
        emailToSocket.set(email, ws);

        // initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
          rooms.set(roomId, new Map());
        }
        const room = rooms.get(roomId)!;

        // broadcast to existing users BEFORE adding this user
        const response = JSON.stringify({
          type: "other-joined",
          emailId: email,
        });

        room.forEach((client, clientEmail) => {
          if (client.readyState === WebSocket.OPEN && clientEmail !== email) {
            client.send(response);
          }
        });

        // add user to the room (overwrites any old socket for this email)
        room.set(email, ws);
      } else if (type === "call-user") {
        const { emailId: toEmail, offer } = data;
        const fromEmail = ws.email;

        if (!toEmail || !fromEmail) return;
        const targetSocket = emailToSocket.get(toEmail);

        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          targetSocket.send(
            JSON.stringify({
              type: "incoming-call",
              from: fromEmail,
              offer: offer,
            }),
          );
        }
      } else if (type === "call-accepted") {
        const { emailId: toEmail, answer } = data;
        const fromEmail = ws.email;

        if (!toEmail || !fromEmail) return;
        const targetSocket = emailToSocket.get(toEmail);

        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          targetSocket.send(
            JSON.stringify({
              type: "call-accepted",
              from: fromEmail,
              answer: answer,
            }),
          );
        }
      } else if (type === "ice-candidate") {
        const { to: toEmail, candidate } = data;
        const fromEmail = ws.email;

        if (!toEmail || !fromEmail) return;
        const targetSocket = emailToSocket.get(toEmail);

        if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
          targetSocket.send(
            JSON.stringify({
              type: "ice-candidate",
              from: fromEmail,
              candidate: candidate,
            }),
          );
        }
      } else if (type === "media-toggle") {
        const { roomId, emailId: email, mediaType, isOff } = data;

        if (!roomId || !email) return;

        const payload = JSON.stringify({
          type: "media-toggle",
          emailId: email,
          mediaType: mediaType,
          isOff: isOff,
        });

        const room = rooms.get(roomId);
        if (room) {
          room.forEach((client, clientEmail) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(payload);
            }
          });
        }
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.log("JSON Error: ", e.message);
      }
    }
  });

  ws.on("close", () => {
    const email = ws.email;
    const roomId = ws.roomId;

    if (email && roomId) {
      const room = rooms.get(roomId);

      // only remove if the closing socket is the CURRENT active socket for this email.
      // this prevents a delayed close event from a ghost socket from kicking out the newly reconnected user.
      if (room && room.get(email) === ws) {
        console.log(`User ${email} disconnected from room ${roomId}`);

        room.delete(email);
        emailToSocket.delete(email);

        const payload = JSON.stringify({
          type: "user-left",
          emailId: email,
        });

        // notify remaining users
        room.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(payload);
          }
        });

        // clean up empty rooms
        if (room.size === 0) {
          rooms.delete(roomId);
        }
      }
    }
  });
});

// Heartbeat Interval to clean up dead connections
const interval = setInterval(() => {
  wss.clients.forEach((client) => {
    const ws = client as CustomWebSocket;
    if (ws.isAlive === false) {
      return ws.terminate();
    }
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);

wss.on("close", () => {
  clearInterval(interval);
});

// HTTP endpoint for checking
app.get("/", (req: Request, res: Response) => {
  res.send("Signaling Server is Running!");
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`WebSocket Server listening on port ${PORT}`);
});
