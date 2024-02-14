import Image from "next/image";
import useNotifications from "../hooks/useNotifications";

export default function SideBar({session, socket}){
    const notifications = useNotifications(socket, session)
    const numNotifications = Object.keys(notifications).length !== 0 ? (notifications.friendRequests.length+notifications.friendRequestsAccepted.length + notifications.puzzleDuelChallenges.length): 0
    function displaySettings(){
        document.querySelector('#settingsForm').classList.remove('hidden')
        document.querySelector('#settingsForm').classList.add('flex')
    }
    function displayFriends(){
        document.querySelector('#friendsPopup').classList.remove('hidden')
    }
    function displayNotifications(){
        document.querySelector('#notificationForm').classList.remove('hidden')
    }
    return (
        <div className=" flex flex-col items-center shadow-md border-2 w-fit px-2 py-4 rounded-full bg-white gap-5 ">
        <button type="button" onClick={displaySettings} className=" bg-gray-300 rounded-full p-1 hover:border-2"><Image src="https://img.icons8.com/ios/50/settings--v1.png" alt="settings" width={30} height={30}/></button>
        <button type="button" onClick={displayFriends} className=" bg-blue-100 rounded-full h-[38px] w-[38px] relative hover:border-2 "><Image className=" absolute top-[0px] right-[4px]" src="https://img.icons8.com/pastel-glyph/64/person-male--v3.png" alt="friends" width={30} height={30}/></button>
        <button type="button" onClick={displayNotifications} className="   rounded-full p-1 hover:border-2 relative"><label className=" absolute text-red-600 font-bold text-sm left-[2px] top-1">{numNotifications}</label><Image src="https://img.icons8.com/ios/50/appointment-reminders--v1.png" alt="notifications" width={30} height={30}/></button>
        </div>
    )
}