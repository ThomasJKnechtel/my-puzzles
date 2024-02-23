import Image from "next/image"
import useFriends from "./hooks/useFriends"

export default function Share({puzzleId, socket, username, token}){
    const friends = useFriends(username)
    const friendIds = friends.map(friend => friend.user_id)
    function sharePuzzle(friendIds){
        document.activeElement.blur()
        if(socket && username && puzzleId){
          
            socket.emit('sharePuzzle', {token, friendIds, puzzleId})
           
        }
    }
    return (
   

    <div  className="border-2 border-slate-300 bg-white p-1 rounded-md hover:bg-slate-50 focus-within:bg-slate-50 ring-2 focus-within:ring-0 focus-within:border-slate-500 group w-[50px] h-[50px] inline-flex flex-col items-center gap-1 ">
    <button type="button" >
        <Image src="https://img.icons8.com/ios/50/share--v1.png" alt="share" width={50} height={50} />
    </button>  
        
        <div id="friendsPopup" className="  flex-col hidden group-focus-within:inline-flex bg-white  m-1 min-w-[50px] rounded-md border-2 border-slate-500 shadow-2xl">
        <label className=" px-1 font-medium bg-slate-100 rounded-t-md">Friends</label>
        <button onClick={()=>sharePuzzle(friendIds)} type="button" className=" hover:bg-slate-100" >All</button>
        {friends?.length>0&&
            friends.map((friend)=><button onClick={()=>sharePuzzle([friend.user_id])} type="button" className="hover:bg-slate-100" key={friend.user_id} value={friend.user_id}>{friend.user_name}</button> 
        )}
       </div>
     
    </div>
    )
}
