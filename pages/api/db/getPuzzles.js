import db from "@/utils/dbConnect"

export default async function getPuzzles(searchParams){
    let {player, opponent, startDate, endDate, startDateUploaded, endDateUploaded, numberOfPuzzles, sortCriteria, username} = searchParams
    player = player?(`'${player}'`):null
    opponent= opponent?(`'${opponent}'`):null
    startDate=startDate || null
    endDate=endDate || null
    startDateUploaded=startDateUploaded || null
    endDateUploaded=endDateUploaded || null
    numberOfPuzzles=(numberOfPuzzles>0)?(numberOfPuzzles):20
    sortCriteria = sortCriteria || null
    username = username?`'${username}'`:null
    const query = `EXEC get_puzzles @player=${player}, @opponent=${opponent}, @fromDatePlayed=${startDate}, @toDatePlayed=${endDate}, @fromDateUploaded=${startDateUploaded}, @toDateUploaded=${endDateUploaded},  @sortCriteria=${sortCriteria}, @numberOfPuzzles=${numberOfPuzzles}, @username=${username}`
    console.log(query)
    const result = await db.query(query)
    return result.recordsets[0]
}