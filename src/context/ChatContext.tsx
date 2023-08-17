import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

interface IChatContext {
  rooms: IRoom[] | null;
  messages: IMessage[];
  connectUser: (username: string) => void;
  createRoom: (room: string) => void;
  sendMessage: (message: string) => void;
}

interface IRoom {
  room: string;
  users: IUser[];
}

interface IUser {
  username: string;
  id: string;
}

interface IMessage {
  date: string;
  from: string;
  message: string;
}

export const ChatContext = createContext<IChatContext>(null as any);

export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<IUser>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>();
  const [rooms, setRooms] = useState<IRoom[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("send_public_rooms", (rooms) => {
      setRooms(rooms);
    });
  }, []);

  useEffect(() => {
    socket.on("received_message", (message: IMessage) => {
      console.log("received message: ", message);

      setMessages((prev) => [...prev, message]);
    });
  }, []);

  const connectUser = (username: string) => {
    if (!username) return;
    socket.connect();

    socket.emit("username_connected", username);

    // kolla att connection är successfull
    socket.on("connect", () => {
      setCurrentRoom("Lobby");
      setUser({ username, id: socket.id });
      navigate("/chat");
    });
  };

  const createRoom = (room: string) => {
    if (!room) return;

    socket.emit("leave_room", currentRoom);
    setMessages([]);
    setCurrentRoom(room);
    //if (room === currentRoom) return;
    socket.emit("create_chatroom", room);
  };

  const sendMessage = (message: string) => {
    const msg = {
      user,
      message,
      currentRoom,
    };
    socket.emit("message_from_client", msg);
  };

  return (
    <ChatContext.Provider
      value={{ connectUser, rooms, createRoom, messages, sendMessage }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
