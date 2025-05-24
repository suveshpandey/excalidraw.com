import { WebSocket, WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

import dotenv from "dotenv";
dotenv.config();

import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const PORT = Number(process.env.PORT) || 8081;  // Convert to number
const wss = new WebSocketServer({ port: PORT });


interface User {
    ws: WebSocket,
    rooms: string[],
    userId: string
}
const users: User[]  = []


//check if the user is authenticated or not
const checkUser = (token: string): string | null => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET);

        if(typeof decoded == "string") return null;

        if(!decoded || !decoded.userId) return null;

        return decoded.userId;
    }   
    catch(error){
        return null;
    }
}

wss.on('connection', function connection(ws, request) {
    const url = request.url;
    if(!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if(userId == null){
        ws.close();
        return null;
    }
    
    users.push({
        ws,
        rooms: [],
        userId
    })

    ws.on('message', async function message(data) {
        try{
            //@ts-ignore
            let parsedData;
            if(typeof data !== "string"){
                parsedData = JSON.parse(data.toString());
            }
            else{
                parsedData = JSON.parse(data); //{type: "join-room", roomId: 1}
            }

        
            if(parsedData.type == "join_room") {
                const user = users.find(x => x.ws === ws);
                user?.rooms.push(parsedData.roomId);
            }
            if(parsedData.type == "leave_room") {
                const user = users.find(x => x.ws === ws);
                if(!user) return;
                
                user.rooms = user?.rooms.filter(x => x === parsedData.room);
            }
            if(parsedData.type == "chat") {
                const roomId = parsedData.roomId;
                const message = parsedData.message
                
                await prismaClient.chat.create({
                    data: {
                        roomId: Number(roomId),
                        message: message,
                        userId: userId
                    }
                })

                users.forEach(user => {
                    if(user.rooms.includes(roomId)) {
                        user.ws.send(JSON.stringify({
                            type: "chat",
                            message: message,
                            roomId: roomId
                        }))
                    }
                })
            }
        }
        catch(error){
            ws.close();
        }
    });
});