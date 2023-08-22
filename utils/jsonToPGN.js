export default function getPGN(fen, continuation){
    let fenStr = ''
    let continuationStr = '' 
    if(fen){
        fenStr = `[FEN "${fen}"]/n`
    }
    if(continuation){
        continuation.map((move, index)=>{
            const moveNum = Math.ceil((index+1)/2)
            if(index%2){
                continuationStr.concat(`${moveNum}. ${move}`)
            }else{
                continuationStr.concat(` ${move} `)
            }
        })
    }
    return fenStr.concat(continuationStr)
}