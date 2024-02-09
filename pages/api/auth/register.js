
import { getServerSession } from "next-auth"
import { authOptions } from "./[...nextauth]"
import db from "@/utils/dbConnect";


export default async function register(req, res){
    const session = await getServerSession(req, res, authOptions)
    const {username} = req.body
    if(session){
        console.log('test')
        const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        if(!regex.test(username)&&username.length>3&&username.length<15){
            const query = `EXEC RegisterUser @userID='${session.user.id}', @username='${username}'`
            const result = await db.query(query)
            res.json(result.recordset[0])
        }
    }else{
        res.status(401)
    }
    
}