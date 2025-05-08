import { Request, Response, NextFunction } from "express";

import { CreateUserSchema } from "@repo/common";
import { prismaClient } from "@repo/db/client";


export const checkExistingUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = CreateUserSchema.safeParse(req.body);

        if(!parsedData.success){
            res.status(403).json({
                    message: "Invalid inputs!"
            })
            return;
        }

        const existingUser = await prismaClient.user.findFirst({
            where: {
                email: parsedData.data.email
            }
        })

        if (!existingUser) {
            next();
        } 
        else {
            res.status(409).json({
                message: "Email already exists!"
            })
        }
    }
    catch(error) {
        res.status(500).json({
            message: "Internal server error!",
            error: error
        })
    }

}