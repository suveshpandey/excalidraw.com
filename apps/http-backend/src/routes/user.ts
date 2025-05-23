import express, { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from 'google-auth-library';

import dotenv from "dotenv";
dotenv.config();

// Initialize Google OAuth client
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
                userData: {
                    email: newUser.email,
                    username: newUser.username
                },
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

        if (user.password === "") {
            res.status(403).json({
                message: "Please sign in with Google"
            });
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
            userData: {
                email: user.email,
                username: user.username
            },
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
        console.log(error);
        alert("error");
        res.status(500).json({
            message: "Internal server error!",
            error: error
        })
    }
})

userRouter.get("/get-rooms", authenticate, async (req, res) => {
    try{
        //@ts-ignore
        const userId = req.userId;
        const rooms = await prismaClient.room.findMany({
            where: {
                adminId: userId
            }
        });
        if(!rooms) {
            res.status(404).json({
                message: "No room found!"
            });
            return;
        }
        res.status(200).json({
            message: "Rooms fetched successfully.",
            rooms: rooms
        })
    }
    catch(error){
        
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

userRouter.delete("/delete-last-chat/:roomId", authenticate, async (req, res) => {
    try {
        //@ts-ignore
        const userId = req.userId;
        const roomId = req.params.roomId

        if(!roomId) {
            res.status(403).json({
                message: "roomId is not provided"
            })
            return;
        }

        const lastChat = await prismaClient.chat.findFirst({
            where: {
                userId: userId,
                roomId: Number(roomId)
            },
            orderBy: {
                id: "desc"
            },
        })

        if (!lastChat) {
            res.status(404).json({ message: "No chat found to delete." });
            return
        }
        
        //Delete the ladt chat
        await prismaClient.chat.delete({
            where: {
                id: lastChat.id
            }
        });

        res.status(200).json({
            message: "Last chat deleted successfully.",
            deletedChat: lastChat
        })
    }
    catch (error) {
        console.error("Error deleting last chat:", error);
        res.status(500).json({ message: "Internal server error." });
    }

})

userRouter.post("/auth/google", async (req, res) => {
    try {
        const { token } = req.body;
        
        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
        
        const payload = ticket.getPayload();
        
        if (!payload?.email) {
            res.status(403).json({ message: "Invalid Google token" });
            return;
        }

        const email = payload.email;
        const name = payload.name || email.split('@')[0];
        
        // Check if user exists
        let user = await prismaClient.user.findUnique({ 
            where: { email } 
        });
        
        if (!user) {
            // Create new user if doesn't exist
            user = await prismaClient.user.create({
                data: {
                    email,
                    password: "", // Empty password for Google users
                    username: name || "user",
                }
            });
        }
        
        // Generate JWT token (same as your current implementation)
        const jwtToken = jwt.sign({
            userId: user.id
        }, JWT_SECRET);

        res.status(200).json({
            message: "Google authentication successful",
            userData: {
                email: user.email,
                username: user.username
            },
            token: jwtToken
        });
        
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ 
            message: "Google authentication failed",
            error: error 
        });
    }
});

export default userRouter