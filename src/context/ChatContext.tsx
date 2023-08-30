import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

interface IChatContext {
  isMobile: boolean;
  windowWidth: number;
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [user, setUser] = useState<IUser | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const [rooms, setRooms] = useState<IRoom[] | null>(null);
  const [typingUsers, setTypingUsers] = useState<IUser[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    function updateTypingUsers(username: string, socketId: string) {
      setTypingUsers(prev => {
        if (prev.some(user => user.id === socketId)) return prev;
        return [...prev, { username, id: socketId }];
      });
    }

    socket.on('send_typing_start', (username, socketId) =>
      updateTypingUsers(username, socketId)
    );

    socket.on('send_typing_stop', socketId => {
      setTypingUsers(prev => prev.filter(user => user.id !== socketId));
    });

    return () => {
      socket.off('send_typing_start', updateTypingUsers);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      // Update isMobile based on the screen width
      setIsMobile(window.innerWidth <= 767);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    // Initial check
    handleResize();
    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    socket.on('send_public_rooms', rooms => {
      setRooms(rooms);
    });
  }, []);

  useEffect(() => {
    socket.on('received_message', (message: IMessage) => {
      setMessages(prev => [...prev, message]);
    });
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, []);

  useEffect(() => {
    const handleWindowClose = () => {
      // Save in LS and pass room info to server
      // In LS because local state set back to default on mount = currentRoom is empty
      // Issue that we could not notify people in current that user left by (refresh/close window)
      const lsRoom = localStorage.getItem('CurrentRoom');
      socket.emit('leave_room', lsRoom);
      socket.emit('user_typing_stop', lsRoom);
    };

    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('CurrentRoom', currentRoom);
    // Since we dont want to show "user is typing" inside new room (if someone in prev room is typing when leaving)
    setTypingUsers([]);

    return () => {
      localStorage.removeItem('CurrentRoom');
    };
  }, [currentRoom]);

  const connectUser = (username: string) => {
    if (!username) return;
    socket.connect();
    setUser({ username, id: '' });
  };

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('username_connected', user?.username);
      setCurrentRoom('Lobby');
      if (user) setUser({ ...user, id: socket.id });

      navigate('/chat');
    });
    return () => {
      socket.off('connect');
    };
  }, [user]);

  const disconnectUser = () => {
    setUser(null);
    setMessages([]);
    setCurrentRoom('');
    setRooms([]);
    navigate('/');
    socket.emit('leave_room', currentRoom);

    socket.disconnect();
  };

  //!FIXME:
  const createRoom = (room: string) => {
    if (!room || currentRoom === room) return;

    socket.emit('leave_room', currentRoom);
    setMessages([]);
    setCurrentRoom(room);
    socket.emit('create_chatroom', room);
  };

  const sendMessage = (message: string) => {
    const msg = {
      user,
      message,
      currentRoom,
    };
    socket.emit('message_from_client', msg);
  };

  const getUsersInRoom = (room: string): IUser[] | undefined => {
    const currRoom = rooms?.find(element => element.room === room);
    if (currRoom) return currRoom.users;
  };

  return (
    <ChatContext.Provider
      value={{
        isMobile,
        windowWidth,
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
