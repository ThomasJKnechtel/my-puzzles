import connectDB from "@/utils/dbConnect"

export default async function getUser(userId){
    const query = `EXEC getUser @user_id = '${userId}'`
    const db = await connectDB()
    const result = await db.query(query)
    return result.recordset[0]
}