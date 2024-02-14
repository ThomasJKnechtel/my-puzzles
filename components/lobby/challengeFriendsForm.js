import useFriends from "../hooks/useFriends"

export default function ChallengeFriendsForm({username, token,  selectedPuzzles, socket, query}){
    const friends = useFriends(username)
    function challengeFriend(e){
        e.preventDefault()
        if(socket){
            const puzzleIds = selectedPuzzles.map(selectedPuzzle=>selectedPuzzle["Puzzle ID"])
            const timeControl = document.querySelector('input[name="timeControl"]:checked').value
            const friendId = document.querySelector('#friendsList').value
            socket.emit('createFriendChallenge', {token, challenge:{challengerPuzzleIds:puzzleIds, timeControl, friendId}})
        }
       
    }
    return (
    <form onSubmit={challengeFriend} className=" flex-col flex p-2">
        <h1 className=" font-bold text-2xl border-b-2 p-1">Challenge Friends</h1>
        <label className=" font-medium text-slate-600 mx-2">Opponent</label>
        <select id="friendsList" className=" w-[200px] border-2 mx-2 "  name="opponent">
            <option value={query?.friendId}>{query.friendUsername}</option>
            {friends?.length>0&&
                friends.map((friend)=>{
                    if(friend.user_id !== query.friendId){
                       return <option key={friend.user_id} value={friend.user_id}>{friend.user_name}</option>
                    }
                    return null
                })
            }
        </select>
        <label className=" font-medium text-slate-600 text-center text-xl">Selected Puzzles</label>
        <table className=" border-2 m-2 h-[300px]">
            <thead className=" border-2">
                <tr><th className=" px-2">Puzzle ID</th><th className=" px-2">Rating</th><th className=" px-2">Attempts</th><th className=" px-2">Success Rate</th></tr>
            </thead> 
            <tbody className=" bg-white">
            {
            selectedPuzzles.map(puzzle => (
            <tr className=" border-b-2 border-slate-50" key={puzzle["Puzzle ID"]}><td>{puzzle["Puzzle ID"]}</td><td>{puzzle["Rating"]}</td><td>{puzzle["Attempts"]}</td><td>{puzzle["Success Rate"]}</td></tr>
            ))
            }
            </tbody>
        </table>
        <input type="submit"  className=" px-2 py-1 bg-green-600 rounded-md font-medium w-fit self-center hover:bg-green-500"/>
    </form>
    )
}