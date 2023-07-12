import { useEffect, useState } from "react";
import { ChatState } from "../utils/ChatProvider";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:3002"; 

let socket, selectedChatCompare;

const Chat = () => {
    const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
    const [socketConnected, setSocketConnected] = useState(false);

    useEffect(() => {   
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
    
      }, []);
}  

export default Chat;