import express, { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateUserSchema, SigninUserSchema, CreateRoomSchema } from "@repo/common";
import { prismaClient } from "@repo/db/client";
import { authenticate } from "../middlewares/authenticate";
import { checkExistingUser } from "../middlewares/checkExistingUser";

const userRouter: Router = express.Router();


userRouter.post("/signup", checkExistingUser, async (req, res) => {
    try{
        const data = CreateUserSchema.safeParse(req.body);
        if(!data.success){
            res.status(403).json({
                    message: "Invalid inputs!"
            })
            return;
        }
        
        //hashing the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        //creating a new user
        const newUser = await prismaClient.user.create({
            data: {
                email: req.body.email,
                password: hashedPassword,
                username: req.body.username
            }
        })
        if(newUser){
            //sign in done, returning a jwt token
            const token = jwt.sign({
                userId: newUser?.id
            }, JWT_SECRET);

            res.status(201).json({
                message: "User successfully registered",
                email: newUser.email,
                token: token
            })
        }
        else{
            res.json({
                message: "Registration failed"
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!",
            error: error
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    try{
        //checking if the inputs are valid
        const parsedData = SigninUserSchema.safeParse(req.body);
        if(!parsedData.success){
            res.status(403).json({
                    message: "Invalid inputs!"
            })
            return;
        }
        
        //finding a user with the given email
        const user = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })

        if(!user) {
            res.status(404).json({
                message: "Wrong email!"
            })
            return;
        }

        //comparing the given password with the hash password (in database)
        const isPasswordValid  = await bcrypt.compare(parsedData.data.password, user.password);
        if(!isPasswordValid) {
            res.status(404).json({
                message: "Wrong password!"
            })
            return;
        }
        
        //sign in done, returning a jwt token
        const token = jwt.sign({
            userId: user?.id
        }, JWT_SECRET);

        res.status(200).json({
            message: "User signed in successfully.",
            token: token
        })
        
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!",
            error: error
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

userRouter.get("/chats/:roomId", authenticate, async (req, res) => {
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