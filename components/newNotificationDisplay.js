import { useSession } from "next-auth/react";
import Link from "next/link";
import useNotifications from "./hooks/useNotifications";

export default function NewNotificationDisplay({socket}){
    const {data: session} = useSession()
    const {newNotification} = useNotifications(socket, session)
    function addFriend(friendId){
        if(socket && session){
            socket.emit('AcceptFriendRequest', {friendId, token:session.token})
        }
    }
    return (
        <div className=" absolute z-50 bg-slate-50 shadow-md mx-auto w-fit left-0 right-0 top-1 rounded-sm ">
            {newNotification?.friendRequest&&
            <>
                <label className=" mx-2 py-1">{newNotification.username} wants to be friends</label><button onClick={()=>addFriend(newNotification?.userId)} type="button" className=" hover:text-lg">&#x2713;</button><button type="button" className=" hover:text-lg">✗</button>
            </>    
            }
            {newNotification?.friendRequestAccepted&&
            <>
                <label className=" mx-2 py-1">{newNotification.username} Accepted friend request</label><button type="button" className=" hover:text-lg">✗</button>
            </>    
            }{newNotification?.friendChallenge&&
            <>
                <label className=" mx-2 py-1">{newNotification.challenger} challenged you to a duel</label><Link href={{'pathname':'/acceptChallenge', 'query':{challenger:newNotification.challenger, timeControl:newNotification.timeControl, challengeId: newNotification.challengeId, challengerPuzzles:newNotification.challengerPuzzleIds}}} className=" hover:text-lg">&#x2713;</Link><button type="button" className=" hover:text-lg">✗</button>
            </>    
            }
        </div>
    )
}