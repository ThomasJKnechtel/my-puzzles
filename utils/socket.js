  import { io } from "socket.io-client"
  
  export default function getSocket(socket, setSocket){
    if(!socket){
      const webSocket = io('http://localhost:5050')
      setSocket(webSocket)
    }
}