/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable jsx-a11y/label-has-associated-control */

import { useSession } from "next-auth/react"
import Image from "next/image"
import db from "@/utils/dbConnect"
import RatingChart from "@/components/profile/RatingChart"
import Layout from "@/components/layout/layout"
import useNotifications from "@/components/useNotifications"



export default function ProfilePage({profileData, friends, socket}){
    const {data: session} = useSession()
    const {user_name: username, user_id: userId, rating, user_stats:userStats} = JSON.parse(profileData)
    const notifications = useNotifications(socket, session)
    function friendRequest(){
        if(socket && session){
            socket.emit('FriendRequest', {friendId: userId, token: session.token})
            const button = document.querySelector('#friendRequest')
            button.disabled = true
            button.innerHTML = 'Requested'
        }
    }
    function editUsername(){
        const usernameInput = document.querySelector('#username')
        const disabled = !usernameInput.disabled
        usernameInput.disabled = disabled
        if(!disabled){
            document.querySelector('#username-container').classList.remove('opacity-80')
        }else{
            document.querySelector('#username-container').classList.add('opacity-80')
        }
    }
    async function updateUsername(){
        const newUsername = document.querySelector('#username').value
        const regex = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
        if(!regex.test(newUsername)&&newUsername.length>3&&newUsername.length<15){
            await fetch('/api/db/updateUsername', {
                method: "POST",
                headers: {'content-type':'application/json'},
                body: JSON.stringify({username: newUsername})
            }).then(response => {
                if(!response.ok){
                    window.alert(`Error: ${response.status}`)
                }
            })
        }else{
            window.alert('Invalid Username')
        }
    }
    return (
        <Layout searchLink selectPuzzles lobby >
        <div className="  flex flex-col p-1 ">
       
            
             {session?.username===username&&
                <div className=" flex flex-col p-2 border-b-2">
                <label className=" font-medium text-slate-600">Username</label>
                 <form id="username-container" onSubmit={updateUsername} className=" inline-flex flex-row items-center border-2 w-fit bg-slate-300 opacity-80 rounded-md border-slate-500">
                    <input id="username" defaultValue={username} disabled type="text" name="username" className="  text-slate-600 font-medium text-lg  w-fit p-1 "/>
                    <button type="button" onClick={editUsername} className=" bg-transparent"><Image src="https://img.icons8.com/fluency-systems-regular/48/pen-squared.png" width={30} height={30} alt="edit"/></button>
                </form>
                </div>
             }{session?.username!==username&&
             <div className=" flex flex-row items-center justify-between p-2 border-b-2">
                <label className=" font-bold text-2xl">{username}</label> 
                <button id="friendRequest" type="button" onClick={friendRequest} className=" m-2 bg-green-600 px-2 py-1 rounded-md text-white font-medium shadow-md ">Add Friend</button>
            </div>
             }

        <div className=" flex flex-wrap gap-2 border-b-2 p-2 justify-between">
            <h1 className=" font-bold text-2xl text-slate-600 ">Puzzle Duel</h1>
            <button className=" bg-green-600 px-2 rounded-md text-white font-medium shadow-md">Challenge</button>
            <label className=" font-medium  text-slate-600 w-full "><label className=" text-slate-600">Current Rating: </label>{rating}</label>
           
            <RatingChart data={JSON.parse(userStats)?.dailyStats} lastUpdated={JSON.parse(userStats)?.lastUpdated} />  
            
             
        </div>
        <div>
            <table>
                <tbody>
                    {
                        friends?.map(friend=><tr key={friend}><td>{friend.user_name}</td></tr>)
                    }
                </tbody>
            </table>
        </div>     
        <div>
           {JSON.stringify(notifications)}
        </div>     
        </div></Layout>
    )
}

export async function getServerSideProps(context){
    const {profile} = context.query
    const query = `EXEC GetProfileData @username='${profile}'`
    const result = await db.query(query)
    const profileData = result?.recordset[0]
    const queryFriends = `EXEC GetFriends @username='${profile}'`
    const friends = (await db.query(queryFriends)).recordsets[0]
    if(profileData){
        return { props: {profileData: JSON.stringify(profileData), friends}}
    }
    return { redirect: '/'}
    
    
}