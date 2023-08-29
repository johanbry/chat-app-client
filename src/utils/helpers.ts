import dayjs from "dayjs";

import { IUser } from "../context/ChatContext";

export const formatDate = (date: Date) => {
  const currentDate = dayjs(date);
  return currentDate.format("DD MMM HH:mm");
};

export const formatTypingUsers = (users: IUser[]) => {
  const numOfUsers = users.length;
  let str: string = "";

  switch (numOfUsers) {
    case 1:
      str = `${users[0].username} is typing`;
      break;
    case 2:
      str = `${users[0].username} and ${users[1].username} are typing`;
      break;
    case 3:
      str = `${users[0].username}, ${users[1].username} and ${users[2].username} are typing`;
      break;
    default:
      str = `${users[0].username}, ${users[1].username}, ${
        users[2].username
      } and ${numOfUsers - 3} others are typing`;
      break;
  }

  return str;
};
