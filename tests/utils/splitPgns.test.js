const { default: splitPGN } = require("@/utils/splitPgns")
const { readFile, readFileSync } = require("fs")


test("Split Pgn", ()=>{
    const pgn = readFileSync('../pgns/pgn1')
    const pgns = splitPGN(pgn, [15])
    const pgn1Result = readFileSync('../pgns/output/test1/pgn1.txt')
    const pgn2Result = readFileSync('../pgns/output/test1/pgn2.txt')
    expect(pgns).toEqual([pgn1Result, pgn2Result])
})
