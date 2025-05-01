import express, { json, Router } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninUserSchema, CreateRoomSchema } from "@repo/common";
import { prismaClient } from "@repo/db/client";
import { authenticate } from "../middlewares/authenticate";

const userRouter: Router = express.Router();

userRouter.post("/signup", async (req, res) => {
    try{
        const data = CreateUserSchema.safeParse(req.body);
        if(!data.success){
            res.status(403).json({
                    message: "Invalid inputs!"
            })
            return;
        }
        
        //creating a new user
        const newUser = await prismaClient.user.create({
            data: {
                email: req.body.email,
                password: req.body.password,
                username: req.body.username
            }
        })
        if(newUser){
            res.status(201).json({
                message: "User successfully signed-up.",
                email: newUser.email
            })
        }
        else{
            res.json({
                message: "Signup failed!"
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    try{
        const parsedData = SigninUserSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(403).json({
                    message: "Invalid inputs!"
            })
            return;
        }
        
        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email,
                password: parsedData.data.password
            }
        })

        if(!user){
            res.status(403).json({
                messages: "Wrong Credentials!"            
            })
            return;
        }
        

        const token = jwt.sign({
            userId: user?.id
        }, JWT_SECRET);

        res.status(200).json({
            message: "User signed-in successfully.",
            token: token
        })
        
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!",
        })
    }
})

userRouter.post("/create-room", authenticate, async (req, res) => {
    try{
        const parsedData = CreateRoomSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(403).json({
                    message: "Invalid inputs!"
            })
            return;
        }
        
        //@ts-ignore
        const userId = req.userId;

        //creating a new room
        const newRoom = await prismaClient.room.create({
            data: {
                slug: parsedData.data.name,
                adminId: userId
            }
        })
        if(newRoom){
            res.status(201).json({
                message: "New room created successfully.",
                roomId: newRoom.id
            })
        }
        else{
            res.json({
                message: "Room creation failed!"
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})

userRouter.get("/chats/:roomId", async (req, res) => {
    try{
        const roomId = Number(req.params.roomId);
        const messages = await prismaClient.chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            }
        });
        res.status(200).json({
            messages: messages
        })
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})

userRouter.get("/room/:slug", async (req, res) => {
    try{
        const slug = req.params.slug;
        const room = await prismaClient.room.findFirst({
            where: {
                slug: slug
            }
        });
        res.status(200).json({
            room: room
        })
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!"
        })
    }
})

export default userRouter