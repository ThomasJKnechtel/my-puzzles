import connectDB from "@/utils/dbConnect"

export default async function getFriends(req, res){
    
    const {username} = req.body
    const query = `EXEC GetFriends @username='${username}'`
    const db = await connectDB()
    const result = await db.query(query)
    res.json(result.recordsets)
}