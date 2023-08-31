import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import { socket } from '../socket';
import { IChatContext, IUser, IRoom, IMessage } from '../interfaces/interfaces';

const defaultValues = {
  isMobile: true,
  windowWidth: window.innerWidth,
  rooms: null,
  messages: [],
  user: null,
  currentRoom: 'Lobby',
  typingUsers: [],
  connectUser: () => {},
  disconnectUser: () => {},
  createJoinRoom: () => {},
  sendMessage: () => {},
  getUsersInRoom: () => {
    return undefined;
  },
};

export const ChatContext = createContext<IChatContext>(defaultValues);

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

  // Hanterar sockets som skriver meddelande i specifika rummet uppdaterar lokalt state med dessa sockets
  useEffect(() => {
    // Uppdaterar listan med de användare som skriver i aktuellt rum just nu (om användare redan finns, gör ingenting.)
    function updateTypingUsers(username: string, socketId: string) {
      setTypingUsers(prev => {
        if (prev.some(user => user.id === socketId)) return prev;
        return [...prev, { username, id: socketId }];
      });
    }
    // Lyssnar på event från server när användare börjar skriva
    socket.on('send_typing_start', (username, socketId) =>
      updateTypingUsers(username, socketId)
    );
    // Lyssnar på event från server när användare slutar skriva och tar bort användaren ur typingUsers listan (arrayen)
    socket.on('send_typing_stop', socketId => {
      setTypingUsers(prev => prev.filter(user => user.id !== socketId));
    });

    // Avregistrerar lyssnaren i en cleanup funktion. Och endast lyssnaren med denna specifika funktion på unmount
    return () => {
      socket.off('send_typing_start', updateTypingUsers);
    };
  }, []);

  // Kollar storleken på skärmen och uppdaterar state utifrån skärmens bredd
  // Beroende på state renderas antingen mobile eller desktop komponenter
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    handleResize();
    // Avregistrerar lyssnaren i en cleanup funktion. Och endast lyssnaren med denna specifika funktion på unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Lyssnar på eventet och uppdaterar lokalt state med antal aktiva rum. Aktiva rum är ej i socket memory, har egen struktur.
  useEffect(() => {
    socket.on('send_public_rooms', rooms => {
      setRooms(rooms);
    });
  }, []);

  // Lyssnar på event och lägger till nya meddelande i lokala statet
  useEffect(() => {
    socket.on('received_message', (message: IMessage) => {
      setMessages(prev => [...prev, message]);
    });
  }, []);

  // Navigera till root route om användar objekt är falskt
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Sparar aktuellt rum i LS för att kunna meddela personer i rummet att användaren har lämnat (refresh / stänger fönster)
  useEffect(() => {
    // Sparar rummet användaren som lämnar vid refresh / stänger fönster. Skickar event med info om rummet samt att användaren slutar skriva
    // Sparar i LS pga state faller tillbaka på default vid omrendering = currentRoom blir då tomt
    const handleWindowClose = () => {
      const lsRoom = localStorage.getItem('CurrentRoom');
      socket.emit('leave_room', lsRoom);
      socket.emit('user_typing_stop', lsRoom);
    };

    window.addEventListener('beforeunload', handleWindowClose);

    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
    };
  }, []);

  // Uppdaterar LS när currentRoom state får nytt värde
  useEffect(() => {
    localStorage.setItem('CurrentRoom', currentRoom);
    // Sätter tillbaka till defaultvärde. Pga visar "user is typing" inuti det nya rummet (Om någon skriver när vi lämnar)
    setTypingUsers([]);

    return () => {
      localStorage.removeItem('CurrentRoom');
    };
  }, [currentRoom]);

  // Eftersom vi har autoConnect: false hanterar vi connection med socket.connect()
  // Kollar om användarnamn finns och sätter keyns value på user objektet.
  const connectUser = (username: string) => {
    if (!username) return;
    socket.connect();
    setUser({ username, id: '' });
  };

  // Lyssnar på connect eventet. Skickar användarnamn till server och uppdaterar rum. Nu har vi fått tillbaka id och uppdaterar key value (id) på user objektet
  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('username_connected', user?.username);
      setCurrentRoom('Lobby');
      if (user) setUser({ ...user, id: socket.id });

      navigate('/chat');
    });

    // Avregistrerar lyssnaren vid varje omrendrering
    return () => {
      socket.off('connect');
    };
  }, [user, navigate]);

  // Tömmer state och skickar event och disconnectar
  const disconnectUser = () => {
    setUser(null);
    setMessages([]);
    setCurrentRoom('');
    setRooms([]);
    navigate('/');
    socket.emit('leave_room', currentRoom);

    socket.disconnect();
  };

  // Används till att skapa och ansluta sig till rum.
  // Om rummet inte finns = skapar
  // Socket skapar ett rum automatiskt om man försöker ansluta till ett rum som inte finns.
  const createJoinRoom = (room: string) => {
    if (!room || currentRoom === room) return;

    socket.emit('leave_room', currentRoom);
    setMessages([]);
    setCurrentRoom(room);
    socket.emit('create_join_chatroom', room);
  };

  // Skapar ett meddelande objekt och skickar objektet som ett event till server
  const sendMessage = (message: string) => {
    const msg = {
      user,
      message,
      currentRoom,
    };
    socket.emit('message_from_client', msg);
  };

  // Returnerar användarna som finns i det angivna rummet
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
        createJoinRoom,
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
