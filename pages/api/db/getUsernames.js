import db from "@/utils/dbConnect"


export default async function getUsernames(req, res){
    const userIds = req.body
    const query = `EXEC GetUsernames @idList='${userIds}'`
    const result = await db.query(query)
    res.json(result.recordsets[0])
}