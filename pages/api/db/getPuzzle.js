import db from "@/utils/dbConnect"
export default async function getPuzzle(puzzle_id){
    const query = `EXEC getPuzzle @puzzle_id = ${puzzle_id}`
    const result = await db.query(query)
    console.log(result)
    return result.recordset[0]
}