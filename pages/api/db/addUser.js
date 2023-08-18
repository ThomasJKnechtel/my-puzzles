import db from "@/utils/dbConnect"

export default async function addUser(req, res){
    try{
        const user = await db.query`SELECT 1 FROM users WHERE user_id = 1`
        
        if(user.recordset.length == 0){
            await db.query`INSERT INTO users (user_id, attempts, success_rate, user_name) VALUES (1, 0, 0, 'test')`
        }
    }catch(error){
        console.log(error)
    }
   
    res.end()
}