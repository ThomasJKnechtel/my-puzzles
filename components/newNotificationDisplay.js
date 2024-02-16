import { useSession } from "next-auth/react";
import Link from "next/link";
import useNotifications from "./hooks/useNotifications";
import { useEffect } from "react";

export default function NewNotificationDisplay({socket}){
    const {data: session} = useSession()
    const {newNotification} = useNotifications(socket, session)
    function addFriend(friendId){
        if(socket && session){
            socket.emit('AcceptFriendRequest', {friendId, token:session.token})
        }
    }
    function close(){
        document.querySelector('#newNotificationDisplay').classList.add('hidden')
    }
    useEffect(()=>{
        document.querySelector('#newNotificationDisplay').classList.remove('hidden')
        if(newNotification?.challengeAccepted){
            window.location.href='/puzzle_duel'
        }
    }, [newNotification])
    return (
        <div id="newNotificationDisplay" className=" absolute z-50 bg-slate-50 shadow-md mx-auto w-fit left-0 right-0 top-1 rounded-sm ">
            {newNotification?.friendRequest&&
            <>
                <label className=" mx-2 py-1">{newNotification.username} wants to be friends</label><button onClick={()=>addFriend(newNotification?.userId)} type="button" className=" hover:text-lg">&#x2713;</button><button onClick={close} type="button" className=" hover:text-lg">✗</button>
            </>    
            }
            {newNotification?.friendRequestAccepted&&
            <>
                <label className=" mx-2 py-1">{newNotification.username} Accepted friend request</label><button onClick={close} type="button" className=" hover:text-lg">✗</button>
            </>    
            }{newNotification?.friendChallenge&&
            <>
                <label className=" mx-2 py-1">{newNotification.challenger} challenged you to a duel</label><Link href={{'pathname':'/acceptChallenge', 'query':{challenger:newNotification.challenger, timeControl:newNotification.timeControl, challengeId: newNotification.challengeId, challengerPuzzles:newNotification.challengerPuzzleIds}}} className=" hover:text-lg">&#x2713;</Link><button onClick={close} type="button" className=" hover:text-lg">✗</button>
            </>    
            }
            {newNotification?.sharedPuzzle&&
            <>
                <label className=" mx-2 py-1 ">{newNotification.username} shared a puzzle: <Link onClick={close} className=" underline text-blue-600 hover:text-blue-500" href={`/play/${newNotification.puzzleId}`}>{newNotification.puzzleId}</Link></label><button onClick={close} type="button" className=" hover:text-lg">✗</button>
            </>    
            }
        </div>
    )
}