import { createContext, useContext, useState } from "react";

const ChatContext = createContext<ChatData | undefined>(undefined);

const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>();
  const [selectedChat, setSelectedChat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();

  return (
    <ChatContext.Provider
      value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
export default ChatProvider;

export const ChatState = () => {
    const context = useContext(ChatContext);
    if (!context) {
      throw new Error('ChatState must be used within a ChatProvider');
    }
    return context;
  };