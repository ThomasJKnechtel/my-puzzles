const path = require("path")
const { default: splitPGN } = require("../../utils/splitPgns")
const { readFile, readFileSync } = require("fs")

test("Split Pgn in two", ()=>{
    const pgn = readFileSync(path.join(__dirname, '../pgns/pgn1.txt'), 'utf-8')
    const pgns = splitPGN(pgn, [15])
    const pgn1Result = readFileSync(path.join(__dirname, '../pgns/output/test1/pgn1.txt'), 'utf-8')
    const pgn2Result = readFileSync(path.join(__dirname, '../pgns/output/test1/pgn2.txt'), 'utf-8')
    expect(pgns).toEqual([pgn1Result, pgn2Result])
})


test("Split Pgn in three", ()=>{
    const pgn = readFileSync(path.join(__dirname, '../pgns/pgn1.txt'), 'utf-8')
    const pgns = splitPGN(pgn, [11, 20])
    const pgn1Result = readFileSync(path.join(__dirname, '../pgns/output/test2/pgn1.txt'), 'utf-8')
    const pgn2Result = readFileSync(path.join(__dirname, '../pgns/output/test2/pgn2.txt'), 'utf-8')
    const pgn3Result = readFileSync(path.join(__dirname, '../pgns/output/test2/pgn3.txt'), 'utf-8')
    expect(pgns).toEqual([pgn1Result, pgn2Result, pgn3Result])
})