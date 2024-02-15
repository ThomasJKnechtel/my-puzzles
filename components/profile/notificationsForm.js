/* eslint-disable react/jsx-key */

import { useEffect, useState } from "react";
import useNotifications from "../hooks/useNotifications";
import Link from "next/link";


export default function NotificationsForm({socket, session}){
    const {friendRequests: friendRequestsIds, friendRequestsAccepted, puzzleDuelChallenges, sharedPuzzles} = useNotifications(socket, session)
    const [friendRequests, setFriendRequests] = useState([])
    useEffect(()=>{
        if( friendRequestsIds){
            fetch('/api/db/getUsernames', {
            method: "POST",
            headers: {'content-type': 'application/json'},
            body: JSON.stringify(friendRequestsIds)
        }).then(response => response.json()).then(result => setFriendRequests(result))
        }
        
    }, [friendRequestsIds])
    function addFriend(friendId){
        if(socket && session){
            socket.emit('AcceptFriendRequest', {friendId, token:session.token})
        }
    }
    function removeFriendNotification(friendId){
        const newFriendRequests=friendRequestsIds.filter(id => id !== friendId)
        if(socket){
            socket.emit('setNotifications', {token:session.token, notifications:{friendRequests: newFriendRequests, friendRequestsAccepted, puzzleDuelChallenges, sharedPuzzles}})
        }
    }
    function removeFriendAcceptedNotification(friendId){
        const newFriendsAccepted = friendRequestsAccepted.filter(id => id !== friendId)
        if(socket){
            socket.emit('setNotifications', {token:session.token, notifications:{friendRequests, friendRequestsAccepted: newFriendsAccepted, puzzleDuelChallenges, sharedPuzzles}})
        }
    }
    function removeChallenge(gameId){
        const newChallenges = puzzleDuelChallenges.filter(challenge => challenge.challengeId !== gameId)
        if(socket){
            socket.emit('setNotifications', {token:session.token, notifications:{friendRequests, friendRequestsAccepted, puzzleDuelChallenges: newChallenges, sharedPuzzles}})
        }
    }
    function removeSharedPuzzle(puzzleId){
        const newSharedPuzzles = sharedPuzzles.filter(puzzle => puzzle.puzzleId !== puzzleId)
        if(socket){
            socket.emit('setNotifications',  {token:session.token, notifications:{friendRequests, friendRequestsAccepted, puzzleDuelChallenges, sharedPuzzles:newSharedPuzzles}} )
        }
    }
    return (
    <div id="notificationForm" className=" bg-slate-300 p-2 rounded-md relative hidden">
        <h1 className=" font-bold text-2xl border-b-2">Notifications</h1>
        <button type="button" onClick={()=>document.querySelector('#notificationForm').classList.add('hidden')} className=" absolute right-0 top-0">✖</button>
        <h2 className=" font-medium text-xl text-slate-600">Friend Requests</h2>
        {friendRequests?.length>0?
 <table>
            <tbody>
            {
                friendRequests.map(request => <tr><td className=" w-[300px] text-left">{request.username} wants to be friends</td><td><button onClick={()=>addFriend(request.user_id)} type="button" className=" hover:text-lg">&#x2713;</button></td><td><button onClick={()=>{removeFriendNotification(request.user_id)}} type="button" className=" hover:text-lg">✗</button></td></tr>)
            }
            </tbody>
        </table>
        : <label>No new messsages</label>
        }
       
        <h2 className=" font-medium text-xl text-slate-600">Friend Requests Accepted</h2>
        {friendRequestsAccepted && friendRequestsAccepted?.length > 0 ? (
            <table>
            <tbody>
            {
                friendRequestsAccepted.map(message => <tr><td className=" w-[300px] text-left">{message.username} accepted your friend request</td><td><button onClick={()=>removeFriendAcceptedNotification(message.userId)} type="button" className=" hover:text-lg">✗</button></td></tr>)
            }
            </tbody>
        </table>):(
            <label>No new messsages</label>
        )
        }
        <h2 className=" font-medium text-xl text-slate-600">Puzzle Duel Challenges</h2>
        {puzzleDuelChallenges && puzzleDuelChallenges?.length > 0 ? (
            <table>
            <tbody>
            {
                puzzleDuelChallenges.map(message => (
                <tr>
                    <td className=" w-[300px] text-left">{message.challenger} sent you a challenge</td>
                    <td><Link href={{'pathname':'/acceptChallenge', 'query':{challenger:message.challenger, timeControl:message.timeControl, challengeId: message.challengeId, challengerPuzzles:message.challengerPuzzleIds}}} className=" hover:text-lg">&#x2713;</Link></td>
                    <td><button onClick={()=>removeChallenge(message.challengeId)} type="button" className=" hover:text-lg">✗</button></td>
                </tr>))
            }
            </tbody>
        </table>):(
            <label>No new messsages</label>
        )
        }
        <h2 className=" font-medium text-xl text-slate-600">Shared Puzzles</h2>
        {sharedPuzzles && sharedPuzzles?.length > 0 ? (
            <table>
            <tbody>
            {
                sharedPuzzles.map(message => <tr><td className=" w-[300px] text-left">{message.username} shared a puzzle: <Link href={`/play/${message.puzzleId}`} className=" underline text-blue-600 hover:text-blue-500">{message.puzzleId}</Link></td><td><button onClick={()=>removeSharedPuzzle(message.puzzleId)} type="button" className=" hover:text-lg">✗</button></td></tr>)
            }
            </tbody>
        </table>):(
            <label>No new messsages</label>
        )
        }
        
    </div>
    )
}