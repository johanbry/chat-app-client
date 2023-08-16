import { PropsWithChildren, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

interface IChatContext {
  //products: string[];
  connectUser: (username: string) => void;
}

export const ChatContext = createContext<IChatContext>(null as any);

export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }: PropsWithChildren) => {
  //const [messages, setMessages] = useState<string[]>([]);
  const navigate = useNavigate();

  const connectUser = (username: string) => {
    if (!username) return;
    socket.connect();

    socket.emit("username_connected", username);

    // kolla att connection är successfull
    socket.on("connect", () => {
      navigate("/chat");
    });

    // emit "new_user_initialization" username
  };

  return (
    <ChatContext.Provider value={{ connectUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
