import connectDB from "@/utils/dbConnect";

export default async function removeFriend(req, res){
    function removeFriendFromList(userId, list){
        const idList = list.split(',')
        const index = idList.indexOf(userId)
        if (index !== -1) {
            idList.splice(index, 1);
        }
        return idList
    }
    const {username, friendUsername, user_id, friendId} = req.body
    const queryUserFriends = `EXEC GetFriendIds @username='${username}'`
    const db = await connectDB()
    const userFriends = (await db.query(queryUserFriends)).recordset[0]
    
    const queryFriendFriends = `EXEC GetFriendIds @username='${friendUsername}'`
    
    const friendsFriends = (await db.query(queryFriendFriends)).recordset[0]
    
    const newUserFriendList = removeFriendFromList(friendId, userFriends.friends)
    const newFriendFriendList = removeFriendFromList(user_id, friendsFriends.friends)
    
    db.query(`EXEC AddFriends @userFriends='${newUserFriendList}', @userId='${user_id}', @friendId='${friendId}', @friendsFriends='${newFriendFriendList}'`)

}