  import { io } from "socket.io-client"
  
  export default function getSocket(socket, setSocket){
    if(!socket){
      const webSocket = io('http://20.80.240.215:5050')
      setSocket(webSocket)
    }
}
