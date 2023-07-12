import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { toast } from "react-toastify";
import { ENDPOINT } from "../utils/contants";
import { ChatState } from "../utils/ChatProvider";
import { Navigate, useNavigate } from "react-router-dom";

let socket: any;
let selectedChatCompare: any;

export default function ChatBoard() {
  const { user, setUser } = ChatState();
  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat>();
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const navigate = useNavigate();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  async function createRooom() {
    const newRoom = uuidv4().slice(0, 16);
    setRoomId(newRoom);
    return newRoom;
  }

  async function setupConnection() {
    socket = io(ENDPOINT);
    try {
      const config = {
        headers: {
          Authorization: `Bearer `,
        },
      };
      const { data } = await axios.post(
        `${ENDPOINT}/api/user/add`,
        user,
        config
      );
      socket.emit("setup", data);
      socket.on("connected", () => {
        toast("Connected to socket server");
      });

      socket.on("disconnect", () => {
        toast("Disconnected from socket server");
      });
    } catch (error) {
      toast("Failed setup connections");
    }
  }

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer `,
        },
      };
      const { data } = await axios.get(
        `${ENDPOINT}/api/message/${selectedChat._id}`,
        config
      );
      setChatMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast("Failed to Load the Messages");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer `,
        },
      };
      const { data } = await axios.get(`${ENDPOINT}/api/user`, config);
      setAllUsers(data);
    } catch (error) {
      toast("Failed to Load the Messages");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (message) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer `,
          },
        };
        setMessage("");
        const response = await axios.post(
          `${ENDPOINT}/api/message`,
          {
            content: message,
            chatId: selectedChat,
            senderId: user._id,
          },
          config
        );
        if (response && response.data) {
          const data: Message = response.data;
          socket.emit("new message", data);
          setChatMessages([...chatMessages, data]);
        }
      } catch (error) {
        toast("Failed to send the Message");
      }
    }
  };

  useEffect(() => {
    async () => {
      console.log("setup");
      await setupConnection();

      await fetchUsers();
    };
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // useEffect(() => {
  //   socket.on("message recieved", (newMessage: any) => {
  //     if (
  //       !selectedChatCompare || // if chat is not selected or doesn't match current chat
  //       selectedChatCompare._id !== newMessage.chat._id
  //     ) {
  //       console.log("FETCH AGAIN");
  //     }
  //     // setMessages([...messages, newMessage]);
  //     console.log("SET MESSAGE");
  //   });
  // });

  async function handleChatWith(selectedUser: User) {
    const currentChat = {
      _id: await createRooom(),
      users: [selectedUser._id, user._id],
    };
    setSelectedChat(currentChat);
  }

  function handleLogout() {
    localStorage.removeItem("userCredentials");
    setUser(undefined);
    navigate("/");
  }
  return (
    <>
      <div className="flex flex-col gap-4">
        <section id="header" className="flex flex-col gap-1 ">
          <h2 className="text-xl font-semibold text-center">Chat Board</h2>
          <div className="flex items-center justify-between">
            <h3 className="font-light text-center text-md ">
              <span>Hello, </span>
              <span className="underline underline-offset-2 ">
                {" "}
                {user.email}
              </span>
            </h3>
            <button type="button" className="logout " onClick={handleLogout}>
              Logout
            </button>
          </div>
        </section>

        <div>Your ID is: {user._id}</div>

        <p>Users List</p>
        {loading ? (
          <p>Fetching data....</p>
        ) : (
          <div className="flex gap-2">
            {allUsers.map((item, id) => (
              <div
                key={id}
                className={`card ${
                  item._id === user._id
                    ? "card-self"
                    : "hover:bg-white hover:text-gray-700"
                }`}
                onClick={() => item._id !== user._id && handleChatWith(item)}
              >
                <p>
                  {item._id === user._id ? "(Me)" : `${id + 1})`} {item.email}
                </p>
              </div>
            ))}
          </div>
        )}

        {roomId ? (
          <div>
            {chatMessages.map((msg: any, index: any) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  msg.senderId === user._id ? "justify-end" : "justify-start"
                }`}
              >
                <span>{msg.senderId.slice(0, 8)}</span>
                <span>{msg.content}</span>
              </div>
            ))}
            <div className="flex gap-2 my-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="p-2 text-gray-700"
              />
              <button type="button" className="primary" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <>Nothing</>
        )}
        {/* {roomId ? (
          <div>
            <p>Room Id : {roomId}</p>
          </div>
        ) : (
          <section id="room" className="flex flex-col gap-2 text-center">
            <span className="createroom" onClick={createRooom}>
              Create a room
            </span>
            <span>OR</span>
            <span>Join a room</span>
          </section>
        )} */}
        {/* <div>Room ID is: {selectedChat?._id}</div>

        <div>
          <label htmlFor="chat-id">Message </label>
          <textarea
            id="chat-id"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

     */}
      </div>
    </>
  );
}
