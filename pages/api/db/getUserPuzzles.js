import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

import connectDB from "@/utils/dbConnect";

export default async function getUserPuzzles(req, res){
    const session = getServerSession(req, res, authOptions)
    if(session){
        const query = `EXEC GetUserPuzzles @username=${session.username}`
        const db = await connectDB()
        const result = await db.query(query)
        res.json(result?.recordsets[0])
    }
}