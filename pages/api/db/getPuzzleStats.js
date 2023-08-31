import db from "@/utils/dbConnect"

export default async function getPuzzleStats(req, res){
    try{
        const puzzle_id = req.body 
        const query = "EXEC getPuzzleStats @puzzle_id="+puzzle_id
        const stats = await (await db.query(query)).recordset
        console.log('stats ',stats)
        res.json(stats[0])
    }catch(err){
        console.log(err)
        res.status(300).send()
    }
   
}