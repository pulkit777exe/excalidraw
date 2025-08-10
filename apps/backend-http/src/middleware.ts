import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET; 


export function middleware(req: Request, res: Response, next: NextFunction) {
    try {

        const token = req.headers["authorization"] ?? "";
        
        const userId = req.body.userId;
        
        if (!userId || !JWT_SECRET) {
            return null;
        }
        
        const decoded = jwt.verify(token, JWT_SECRET) as {userId: string};
        

        if (!decoded || typeof decoded.userId !== "string") {
            return res.status(403).json({message: "Unauthorized"});
        }

        req.userId = decoded.userId;

        next();
    } catch (err) {
        console.error(err);
        res.json(403).json({
            message: "Forbidden"
        })
    }
}