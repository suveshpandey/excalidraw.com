import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

import { JWT_SECRET } from "@repo/backend-common/config";


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try{
        const token = req.headers["authorization"] || "";

        const decoded = jwt.verify(token, JWT_SECRET);

        if(decoded){
            //@ts-ignore
            req.userId = decoded.userId;
            next();
        }
        else{
            res.status(403).json({
                message: "Unauthorized, invalid token / token not provided !"
            })
        }
    }
    catch(error){
        res.status(500).json({
            message: "Internal server error!"
        })
    }
}