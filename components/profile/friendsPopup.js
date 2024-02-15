import Link from "next/link"
import { useEffect, useState } from "react"
import useFriends from "../hooks/useFriends"


export default function FriendsPopup({user_id, username}){
    const friends = useFriends(username)
    function removeFriend(friendId, friendUsername){
        fetch('/api/db/removeFriend', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({user_id, username, friendId, friendUsername})
        })
    }
    return (
        <div id="friendsPopup" className=" bg-slate-200 p-2 rounded-md min-h-[300px] max-sm:max-w-[300px] shadow-md relative hidden shrink">

        <h1 className=" font-bold text-2xl border-b-2 border-slate-300 ">Friends</h1>
        <button type="button" onClick={()=>document.querySelector('#friendsPopup').classList.add('hidden')} className=" absolute right-0 top-0">✖</button>
        <table className=" m-2">
            <tbody>
                {
                    friends.map((friend)=>(
                        <tr className=" border-b-2 border-slate-300 border-dashed" key={friend.user_id}>
                        <td><Link href={`/profile/${friend.user_name}`} className=" w-[200px] text-left block font-medium underline text-blue-700 hover:text-blue-500">{friend.user_name}</Link></td>
                        <td><button type="button" onClick={()=>removeFriend(friend.user_id, friend.user_name)} className=" px-2 py-1 bg-green-600 rounded-md font-medium hover:bg-green-500">Remove</button></td>
                        </tr>))
                }
            </tbody>
        </table>
        </div>
    )
}