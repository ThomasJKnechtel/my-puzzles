import { getToken } from "next-auth/jwt"
import { authOptions } from "./[...nextauth]"
import db from "@/utils/dbConnect"

export default async function register(req, res){
 
    try{
        const token = await getToken({req, secret: authOptions.secret })
        const username = req.body
        if(token){
            if(username){
                const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
                
                if(regex.test(username)){
                   res.status(400).json({err:"Invalid Username"}) 
                }else{
                    const query = `EXEC ADD_USER @user_id = ${token.sub}, @username='${username}'`
                    
                    await db.query(query)
                    res.status(200).send()
                } 
            }else res.status(400).json({err: "No Username"})
            
           
        }else{
            res.redirect('/login')
        }
    }catch(err){
        console.log(err)
        res.status(400).json({err: "Username already exists"})
        
    }
    
}