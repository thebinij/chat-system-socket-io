import { messages } from "../database/chats.js";
export const sendMsg = async (req, res) => {
  let content;
  let chatId;
  let senderId;

  content = req.body?.content;
  chatId = req.body?.chatId;
  senderId = req.body?.senderId; // this should come from headers

  if (!content || !chatId || !senderId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  try {
    const newMessage = {
      senderId: senderId,
      chat: chatId,
      content: content,
    };
    messages.push(newMessage)
    return res.json(newMessage);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};

export const allMessages = async (req, res) => {
  try {
    res.json(messages);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};
