import db from "@/utils/dbConnect"
export default async function getPuzzles(searchParams){
    let {player, opponent, startDate, endDate, startDateUploaded, endDateUploaded, numberOfPuzzles} = searchParams
    player = player?("'"+player+"'"):null
    opponent= opponent?("'"+opponent+"'"):null
    startDate=startDate?(startDate):null
    endDate=endDate?(endDate):null
    startDateUploaded=startDateUploaded?(startDateUploaded):null
    endDateUploaded=endDateUploaded?(endDateUploaded):null
    numberOfPuzzles=numberOfPuzzles?(numberOfPuzzles):20
    const query = `EXEC get_puzzles @player=${player}, @opponent=${opponent}, @fromDatePlayed=${startDate}, @toDatePlayed=${endDate}, @fromDateUploaded=${startDateUploaded}, @toDateUploaded=${endDateUploaded}, @attempts=NULL, @success_rate=NULL, @sortCriteria='datePlayed', @numberOfPuzzles=${numberOfPuzzles}, @username=NULL`
    const result = await db.query(query)
    return result.recordsets[0]
}