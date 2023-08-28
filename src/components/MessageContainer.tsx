import { ChangeEvent, FormEvent, useState, useEffect, useRef } from 'react';
import { BsSend } from 'react-icons/bs';
import { AiOutlineGif } from 'react-icons/ai';

import { useChatContext } from '../context/ChatContext';
import { socket } from '../socket';
import Button from './Button';
import InputField from './InputField';
import ChatHeader from './ChatHeader';
import MessageCard from './MessageCard';

import './messageContainer.scss';
import { formatTypingUsers } from '../utils/helpers';
import GifModal from './GifModal';

type Props = {};

const MessageContainer = (props: Props) => {
  const [message, setMessage] = useState<string>('');
  const [showGifModal, setShowGifModal] = useState(false);

  const { messages, sendMessage, currentRoom, user, isMobile, typingUsers } =
    useChatContext();
  const chatWindow = useRef<HTMLDivElement>(null);

  //!FIX, skicka bara start en gång (lokalt isTyping-state?)
  useEffect(() => {
    if (message) {
      socket.emit('user_typing_start', user?.username, currentRoom);
    }
    const timer = setTimeout(() => {
      socket.emit('user_typing_stop', currentRoom);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  useEffect(() => {
    if (chatWindow.current) {
      // Scroll to the latest message
      chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
    }
  }, [messages]);

  const handleToggleGif = () => {
    setShowGifModal(!showGifModal);
  };

  const handleGifClick = (gif, e) => {
    e.preventDefault();
    console.log('GifClick', gif);
    handleToggleGif();
    setMessage(`/gif/${gif.id}`);

    //! FUNGERAR EJ!!!!!!
    sendMessage(message);
  };

  return (
    <>
      {!isMobile && <ChatHeader />}
      <section className="chat-window" ref={chatWindow}>
        {messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}
      </section>

      {typingUsers.length > 0 && (
        <p className="typing-users">{formatTypingUsers(typingUsers)}</p>
      )}
      {showGifModal && (
        <GifModal
          handleToggleGif={handleToggleGif}
          handleGifClick={handleGifClick}
        />
      )}
      <form onSubmit={handleSendMessage} className="chat-message-form">
        <InputField
          type={'text'}
          value={message}
          onChange={handleInput}
          required
          placeholder="Enter message here..."
          className="no-border"
        />

        <Button
          Icon={AiOutlineGif}
          disabled={false}
          className="icon-btn icon-send-btn"
          onClick={handleToggleGif}
          type="button"
        />
        <Button
          Icon={BsSend}
          disabled={!message}
          className="icon-btn icon-send-btn"
        />
      </form>
    </>
  );
};

export default MessageContainer;
