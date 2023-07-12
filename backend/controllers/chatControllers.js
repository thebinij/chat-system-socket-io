
import {chats } from '../database/chats.js'

export const sendChat =  async (req, res) => {
  let userId;
    userId = req?.body?.userId;
    if (!userId) {
      return res.status(400).json({"message": "UserId in body is not sent with the request"})
    }
    return res.sendStatus(201)
}

export const fetchAllChats = async (req, res) => {
    try {
      const populatedChats = chats.map((chat) => {
        return {
          ...chat,
          users: [
            {
              _id: "user1",
              name: "User 1",
              pic: "pic1",
              email: "user1@example.com",
            },
            {
              _id: "user2",
              name: "User 2",
              pic: "pic2",
              email: "user2@example.com",
            },
          ],
          latestMessage: {
            _id: chat.latestMessage,
            sender: {
              _id: "user1",
              name: "User 1",
              pic: "pic1",
              email: "user1@example.com",
            },
          },
        };
      });
      res.status(200).send(populatedChats);
    } catch (err) {
      res.status(400);
      throw new Error(err.message);
    }
}
