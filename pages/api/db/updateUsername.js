import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]"
import db from "@/utils/dbConnect"

export default async function updateUsername(req, res){
    const {username} = req.body
    const session = await getServerSession(req, res, authOptions)
    console.log(session)
    if(session){
        const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        if(!regex.test(username)&&username.length>3&&username.length<15){
            const query = `EXEC UpdateUsername @username='${username}', @oldUsername='${session.username}'`
            console.log(query)
            const result = await db.query(query)
            res.json(result.recordset)
        }else{
            res.status(400)
        }
        
    }else{
         res.status(403)
    }
   
}