import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import db from "@/utils/dbConnect"

export default async function addFriends(req, res){
    const friendsIds = req.body
    const session = await getServerSession(req, res, authOptions)
    if(session){
        const query = `EXEC AddFriends @friends='${friendsIds}', @username='${session.username}'`
        const result = await db.query(query)
        res.json(result)
    }else{
        res.status(403)
    }
}