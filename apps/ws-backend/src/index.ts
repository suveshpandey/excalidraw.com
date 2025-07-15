// import { WebSocketServer } from 'ws';
// import * as dotenv from "dotenv";
// import * as jwt from "jsonwebtoken";
// import { prismaClient } from "../../../packages/db/src/database";

// dotenv.config();

// // Enhanced configuration
// const PORT = Number(process.env.PORT) || 8081;
// const JWT_SECRET = process.env.JWT_SECRET || "";
// const DATABASE_URL = process.env.DATABASE_URL || "";

// console.log(`Starting WebSocket server on port ${PORT}`);
// console.log(`Database URL: ${DATABASE_URL ? 'Configured' : 'MISSING'}`);

// // Verify database connection immediately
// prismaClient.$connect()
//   .then(() => console.log('Database connected successfully'))
//   .catch(err => {
//     console.error('Database connection failed:', err);
//     process.exit(1);
//   });

// const wss = new WebSocketServer({ port: PORT });

// wss.on('connection', (ws, req) => {
//   console.log(`New connection from ${req.socket.remoteAddress}`);
  
//   const token = new URL(req.url || '', `http://${req.headers.host}`).searchParams.get('token') || "";
//   const userId = verifyToken(token);

//   if (!userId) {
//     console.log('Connection rejected - invalid token');
//     ws.close();
//     return;
//   }

//   console.log(`Authenticated user ${userId} connected`);
  
//   ws.on('message', async (data) => {
//     try {
//       const message = data.toString();
//       console.log(`Received from ${userId}:`, message);
      
//       const parsed = JSON.parse(message);
      
//       if (parsed.type === "join_room") {
//         console.log(`User ${userId} joining room ${parsed.roomId}`);
//         // Add room joining logic
//       }
//       else if (parsed.type === "chat") {
//         console.log(`Saving chat message in room ${parsed.roomId}`);
//         await prismaClient.chat.create({
//           data: {
//             roomId: Number(parsed.roomId),
//             message: parsed.message,
//             userId: userId
//           }
//         });
//         console.log('Message saved successfully');
        
//         // Broadcast to other users in room
//         wss.clients.forEach(client => {
//           if (client !== ws && client.readyState === WebSocket.OPEN) {
//             client.send(JSON.stringify({
//               type: "chat",
//               message: parsed.message,
//               roomId: parsed.roomId,
//               userId: userId
//             }));
//           }
//         });
//       }
//     } catch (err) {
//       console.error('Message handling error:', err);
//     }
//   });

//   ws.on('close', () => {
//     console.log(`User ${userId} disconnected`);
//   });

//   ws.on('error', (err) => {
//     console.error(`WebSocket error for user ${userId}:`, err);
//   });
// });

// function verifyToken(token: string): string | null {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
//     return decoded.userId;
//   } catch (err) {
//     console.error('Token verification failed:', err);
//     return null;
//   }
// }

// console.log(`WebSocket server running on ws://localhost:${PORT}`);




import express from "express";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import { prismaClient } from "../../../packages/db/src/database";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 8081;
const JWT_SECRET = process.env.JWT_SECRET || "";
const DATABASE_URL = process.env.DATABASE_URL || "";

console.log(`Starting Express+WebSocket server on port ${PORT}`);
console.log(`Database URL: ${DATABASE_URL ? 'Configured' : 'MISSING'}`);

// Connect to database
prismaClient.$connect()
  .then(() => console.log("Database connected successfully"))
  .catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

// Create HTTP server from Express app
const server = createServer(app);

// Attach WebSocket server to HTTP server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws, req) => {
  console.log(`New connection from ${req.socket.remoteAddress}`);

  const token = new URL(req.url || "", `http://${req.headers.host}`).searchParams.get("token") || "";
  const userId = verifyToken(token);

  if (!userId) {
    console.log("Connection rejected - invalid token");
    ws.close();
    return;
  }

  console.log(`Authenticated user ${userId} connected`);

  ws.on("message", async (data) => {
    try {
      const message = data.toString();
      console.log(`📩 Received from ${userId}:`, message);

      const parsed = JSON.parse(message);

      if (parsed.type === "join_room") {
        console.log(`User ${userId} joining room ${parsed.roomId}`);
        // Add room logic here
      } else if (parsed.type === "chat") {
        console.log(`Saving chat message in room ${parsed.roomId}`);
        await prismaClient.chat.create({
          data: {
            roomId: Number(parsed.roomId),
            message: parsed.message,
            userId: userId
          }
        });
        console.log("Message saved");

        // Broadcast to others
        wss.clients.forEach(client => {
          if (client !== ws && client.readyState === ws.OPEN) {
            client.send(JSON.stringify({
              type: "chat",
              message: parsed.message,
              roomId: parsed.roomId,
              userId: userId
            }));
          }
        });
      }
    } catch (err) {
      console.error("Message error:", err);
    }
  });

  ws.on("close", () => {
    console.log(`User ${userId} disconnected`);
  });

  ws.on("error", (err) => {
    console.error(`WebSocket error for user ${userId}:`, err);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Express server running on http://localhost:${PORT}`);
  console.log(`Health check available at http://localhost:${PORT}/health`);
});

function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
}
