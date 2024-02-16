import connectDB from "@/utils/dbConnect"

export default async function getPuzzle(puzzle_id){
    const query = `EXEC getPuzzle @puzzle_id = ${puzzle_id}`
    const db = await connectDB()
    const result = await db.query(query)
    return result.recordset[0]
}