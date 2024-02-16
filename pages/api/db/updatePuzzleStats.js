import connectDB from "@/utils/dbConnect"

export default async function updatePuzzleStats(req, res){
    try{
        const {puzzle_id, newAttempts, newSuccessRate} = req.body
        const query = `EXEC updatePuzzleStats @attempts=${newAttempts}, @success_rate=${newSuccessRate}, @puzzle_id=${puzzle_id}`
        const db = await connectDB()
        await db.query(query)
        res.status(200).send()
    }catch(err){
        console.log(err)
        res.status(300).send()
    }
    
}