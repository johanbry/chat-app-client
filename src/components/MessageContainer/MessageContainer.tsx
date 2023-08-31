import {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
  SyntheticEvent,
} from 'react';
import { BsSend } from 'react-icons/bs';
import { AiOutlineGif } from 'react-icons/ai';
import { BsEmojiSmile } from 'react-icons/bs';
import EmojiPicker from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';

import { EmojiClickData } from 'emoji-picker-react';
import { IGif } from '@giphy/js-types';

import { useChatContext } from '../../context/ChatContext';
import { socket } from '../../socket';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessageCard from '../MessageCard/MessageCard';
import { formatTypingUsers } from '../../utils/helpers';
import GifModal from '../GifModal/GifModal';

import './messageContainer.scss';

const MessageContainer = () => {
  const [message, setMessage] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [showGifModal, setShowGifModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);

  const { messages, sendMessage, currentRoom, user, isMobile, typingUsers } =
    useChatContext();

  const bottomElement = useRef<HTMLDivElement>(null);
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (message && !isTyping) {
      // Om isTyping=false, första knapptrycket, skicka start, annars har vi redan skickat start
      socket.emit('user_typing_start', user?.username, currentRoom);
      setIsTyping(true);
    }
    const timer = setTimeout(() => {
      socket.emit('user_typing_stop', currentRoom);
      setIsTyping(false);
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
    socket.emit('user_typing_stop', currentRoom);
  };

  const handleScrollToBottom = useCallback(() => {
    bottomElement?.current?.scrollIntoView(false);
  }, []);

  // Anropa scroll funktion när textmeddelande uppdateras och/eller funktion anropas ej om GIF meddelande
  useEffect(() => {
    if (messages.length < 1) return;
    // Kolla om sista meddelande innehåller prefix /gif:
    const isGifMsg = messages[messages.length - 1].message.includes('/gif:');
    if (isGifMsg) return;
    handleScrollToBottom();
  }, [messages, handleScrollToBottom]);

  const handleToggleGif = () => {
    setShowGifModal(!showGifModal);
    if (showEmojiModal) handleToggleEmoji();
  };

  const handleToggleEmoji = () => {
    setShowEmojiModal(!showEmojiModal);
    if (showGifModal) handleToggleGif();
  };

  const handleGifClick = (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => {
    e.preventDefault();
    handleToggleGif();
    sendMessage(`/gif:${gif.id}`);
    inputField.current?.focus();
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    const cursor = inputField.current?.selectionStart || 0;
    setMessage(
      prev => prev.substring(0, cursor) + emoji.emoji + prev.substring(cursor)
    );
    handleToggleEmoji();
    inputField.current?.focus();
  };

  return (
    <>
      {!isMobile && <ChatHeader />}
      <section className="chat-window">
        {messages.map((message, index) => (
          <MessageCard
            key={index}
            message={message}
            handleScrollToBottom={handleScrollToBottom}
          />
        ))}
        <div ref={bottomElement}></div>
      </section>

      {typingUsers.length > 0 && (
        <p className="typing-users">
          {formatTypingUsers(typingUsers)}
          <span className="bounching-container">
            <span className="bounchingDots"></span>
            <span className="bounchingDots"></span>
            <span className="bounchingDots"></span>
          </span>
        </p>
      )}

      {showGifModal && (
        <GifModal
          handleToggleGif={handleToggleGif}
          handleGifClick={handleGifClick}
        />
      )}

      {showEmojiModal && (
        <div className="emoji-modal-wrapper">
          <EmojiPicker
            theme={Theme.DARK}
            previewConfig={{ showPreview: false }}
            skinTonesDisabled={true}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-message-form">
        <InputField
          type={'text'}
          value={message}
          onChange={handleInput}
          required
          placeholder="Enter message here..."
          className="no-border"
          refId={inputField}
        />
        <Button
          Icon={BsEmojiSmile}
          disabled={false}
          className="icon-btn icon-send-btn"
          onClick={handleToggleEmoji}
          type="button"
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
