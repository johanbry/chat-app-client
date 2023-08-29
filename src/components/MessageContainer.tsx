import {
  ChangeEvent,
  FormEvent,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { BsSend } from "react-icons/bs";
import { AiOutlineGif } from "react-icons/ai";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import { EmojiClickData } from "emoji-picker-react";

import { useChatContext } from "../context/ChatContext";
import { socket } from "../socket";
import Button from "./Button";
import InputField from "./InputField";
import ChatHeader from "./ChatHeader";
import MessageCard from "./MessageCard";

import "./messageContainer.scss";
import { formatTypingUsers } from "../utils/helpers";
import GifModal from "./GifModal";

type Props = {};

const MessageContainer = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [showGifModal, setShowGifModal] = useState(false);
  const [showEmojiModal, setShowEmojiModal] = useState(false);

  const { messages, sendMessage, currentRoom, user, isMobile, typingUsers } =
    useChatContext();
  const chatWindow = useRef<HTMLDivElement>(null);
  const bottomElement = useRef<HTMLDivElement>(null);

  //!FIX, skicka bara start en gång (lokalt isTyping-state?)
  useEffect(() => {
    if (message && !isTyping) {
      // Om istping=false, första knapptrycket, skicka start, annars har vi redan skickat start
      socket.emit("user_typing_start", user?.username, currentRoom);
      setIsTyping(true);
    }
    const timer = setTimeout(() => {
      socket.emit("user_typing_stop", currentRoom);
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
    setMessage("");
    socket.emit("user_typing_stop", currentRoom);
  };

  useEffect(() => {
    // bottomElement?.current?.scrollIntoView({
    //   behavior: "smooth",
    //   block: "end",
    //   inline: "end",
    // });
    if (chatWindow.current) {
      //Scroll to the latest message
      console.log("scrollheigt", chatWindow.current.scrollHeight);
      console.log("scrollheigt+300", chatWindow.current.scrollHeight + 300);

      chatWindow.current.scrollTop = chatWindow.current.scrollHeight + 300;
    }
  }, [messages]);

  const handleToggleGif = () => {
    setShowGifModal(!showGifModal);
    if (showEmojiModal) handleToggleEmoji();
  };

  const handleToggleEmoji = () => {
    setShowEmojiModal(!showEmojiModal);
    if (showGifModal) handleToggleGif();
  };

  const handleGifClick = (gif, e) => {
    e.preventDefault();
    console.log("GifClick", gif);
    handleToggleGif();

    sendMessage(`/gif:${gif.id}`);
  };

  const handleEmojiClick = (emoji: EmojiClickData) => {
    console.log(emoji);
    setMessage((prev) => {
      return prev + emoji.emoji;
    });
    handleToggleEmoji();
  };

  return (
    <>
      {!isMobile && <ChatHeader />}
      <section className="chat-window" ref={chatWindow}>
        {messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}
        <div ref={bottomElement} style={{ height: 20 }}></div>
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
            theme="dark"
            previewConfig={{ showPreview: false }}
            skinTonesDisabled={true}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      )}

      <form onSubmit={handleSendMessage} className="chat-message-form">
        <InputField
          type={"text"}
          value={message}
          onChange={handleInput}
          required
          placeholder="Enter message here..."
          className="no-border"
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
