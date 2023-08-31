export interface IChatContext {
  isMobile: boolean;
  windowWidth: number;
  rooms: IRoom[] | null;
  messages: IMessage[];
  user: IUser | null;
  currentRoom: string;
  typingUsers: IUser[];
  connectUser: (username: string) => void;
  disconnectUser: () => void;
  createJoinRoom: (room: string) => void;
  sendMessage: (message: string) => void;
  getUsersInRoom: (room: string) => IUser[] | undefined;
}

export interface IRoom {
  room: string;
  users: IUser[];
}

export interface IUser {
  username: string;
  id: string;
}

export interface IMessage {
  date: Date;
  from: string;
  message: string;
}
