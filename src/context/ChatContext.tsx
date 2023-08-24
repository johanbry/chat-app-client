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
  isMobile: boolean;
  rooms: IRoom[] | null;
  messages: IMessage[];
  user: IUser | null;
  currentRoom: string;
  typingUsers: IUser[];
  connectUser: (username: string) => void;
  disconnectUser: () => void;
  createRoom: (room: string) => void;
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

// const defaultValues = {

// }

export const ChatContext = createContext<IChatContext>(null as any);

export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }: PropsWithChildren) => {
  const [isMobile, setIsMobile] = useState(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [rooms, setRooms] = useState<IRoom[] | null>(null);
  const [typingUsers, setTypingUsers] = useState<IUser[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    function updateTypingUsers(username: string, socketId: string) {
      setTypingUsers((prev) => {
        if (prev.some((user) => user.id === socketId)) return prev;
        return [...prev, { username, id: socketId }];
      });
    }

    socket.on("send_typing_start", (username, socketId) =>
      updateTypingUsers(username, socketId)
    );

    socket.on("send_typing_stop", (socketId) => {
      setTypingUsers((prev) => prev.filter((user) => user.id !== socketId));
    });

    return () => {
      socket.off("send_typing_start", updateTypingUsers);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Update isMobile based on the screen width
      setIsMobile(window.innerWidth <= 767);
    };
    window.addEventListener("resize", handleResize);

    // Initial check
    handleResize();
    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    socket.on("send_public_rooms", (rooms) => {
      setRooms(rooms);
    });
  }, []);

  useEffect(() => {
    socket.on("received_message", (message: IMessage) => {
      // console.log("received message: ", message);

      setMessages((prev) => [...prev, message]);
    });

    socket.io.on("reconnect", () => {
      console.log("Reconnecting from client...");
    });
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const connectUser = (username: string) => {
    if (!username) return;
    socket.connect();

    //socket.emit("username_connected", username);

    // kolla att connection är successfull
    socket.on("connect", () => {
      socket.emit("username_connected", username);
      setCurrentRoom("Lobby");
      setUser({ username, id: socket.id });
      // console.log("userstate namn", user?.username);
      // console.log("roomstate", currentRoom);
      navigate("/chat");
    });
  };

  const disconnectUser = () => {
    socket.emit("leave_room", currentRoom);

    socket.disconnect();

    setUser(null);
    setMessages([]);
    setCurrentRoom("");
    setRooms([]);
    navigate("/");
  };

  //!FIXME:
  const createRoom = (room: string) => {
    if (!room || currentRoom === room) return;

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

  const getUsersInRoom = (room: string): IUser[] | undefined => {
    const currRoom = rooms?.find((element) => element.room === room);
    if (currRoom) return currRoom.users;
  };

  return (
    <ChatContext.Provider
      value={{
        isMobile,
        connectUser,
        disconnectUser,
        rooms,
        createRoom,
        messages,
        sendMessage,
        user,
        currentRoom,
        getUsersInRoom,
        typingUsers,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
