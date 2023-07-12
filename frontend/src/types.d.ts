interface ChatData {
  user: any;
  selectedChat: any;
  notification: any[];
  chats: any;
  setUser: (user: any) => void;
  setSelectedChat: (chat: any) => void;
  setNotification: (notification: any) => void;
  setChats: (chats: any) => void;
}

interface Chat {
  _id: string;
  users: string[];
}

interface Message {
  sender: string;
  chat: string;
  content: string;
}

interface User{
  _id:string,
  email:string
}