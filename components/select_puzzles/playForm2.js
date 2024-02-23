export default function PlayForm({puzzles, saved}){

    function play3Minute(){
        // puzzles.forEach(puzzle => {
        //     if(typeof puzzle.continuation !== 'string'){
        //         // eslint-disable-next-line no-param-reassign
        //         puzzle.continuation = JSON.stringify(puzzle.continuation)
        //     }
        // })
        sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
        window.location.href = "./play/blitz?timeControl=3"
    }
    function play5Minute(){
        // puzzles.forEach(puzzle => {
        //     if(typeof puzzle.continuation !== 'string'){
        //         // eslint-disable-next-line no-param-reassign
        //         puzzle.continuation = JSON.stringify(puzzle.continuation)
        //     }
        // })
        sessionStorage.setItem('puzzles', JSON.stringify(puzzles))
        window.location.href = "./play/blitz?timeControl=5"
    }
    function playRandom(){
        sessionStorage.setItem('previousPuzzles', JSON.stringify([]))
        fetch('/api/db/getRandomPuzzle', { 
            method:"POST",
            headers:{
                'content-type':'application/json'
            },
            body : JSON.stringify({})
        }).then( response => {
            if(!response.ok) console.log(response.status)
            return response.text()
        }).then( puzzleId => {
            window.location.href=`/play/${puzzleId}`
        })
    }
    function puzzleDuel(){
        const puzzleIds = puzzles.map(puzzle => puzzle.puzzle_id)
        const puzzleIdsString = JSON.stringify(puzzleIds)
        window.location.href=`/lobby?puzzleIds=${puzzleIdsString}`
    }
    return <span className=" inline-flex flex-col bg-white  border-2  items-stretch rounded-lg w-[300px] justify-stretch shadow-xl">
        <h1 className="   font-medium p-2 border-b-2  text-3xl w-full text-center bg-slate-400 opacity-90 rounded-t-lg">Play</h1>
        <button onClick={play3Minute} className=" text-center text-2xl border-b-2 p-2 hover:bg-slate-300 hover:font-bold hover:border-slate-400 hover:border-t-2" type="button">3 Minute Solo</button>
        <button onClick={play5Minute} className=" text-2xl border-b-2 p-2 hover:bg-slate-300 hover:font-bold hover:border-slate-400 hover:border-t-2"  type="button">5 Minute Solo</button>
        <button onClick={playRandom} className=" text-2xl border-b-2 p-2 hover:bg-slate-300 hover:font-bold hover:border-slate-400 hover:border-t-2" type="button">Random Puzzle</button>
        {saved&&
            <button onClick={puzzleDuel} className=" text-2xl p-2 hover:bg-slate-300 hover:font-bold hover:border-slate-400 hover:border-t-2 hover:border-b-2" type="button">Puzzle Duel</button>
        }
        
    </span>
}