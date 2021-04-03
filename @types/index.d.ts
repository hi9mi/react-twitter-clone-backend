import * as express from "express"
declare global {
    namespace Express {
        interface Request {
            User?: Record<string,any>
            file?: Record<string,any>
        }
    }
}