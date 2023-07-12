import { users } from "../database/users.js";
export const allUsers = async (req, res) => {
  const keyword = req.query.search;
  const filteredUsers = keyword
    ? users.filter((user) => user.email.includes(keyword))
    : users;
  res.send(filteredUsers);
};

export const addUser = async (req, res) => {
    console.log(req)
  let user;
  if (!user) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }
  try {
    users.push(user);
    console.log(user)
    return res.json(user);
  } catch (err) {
    res.status(400);
    throw new Error(err.message);
  }
};
