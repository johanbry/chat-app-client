import { ChangeEvent, FormEvent, useState, useEffect, useRef } from "react";
import { BsSend } from "react-icons/bs";
import { useChatContext } from "../context/ChatContext";
import { socket } from "../socket";

import Button from "./Button";
import InputField from "./InputField";
import ChatHeader from "./ChatHeader";
import MessageCard from "./MessageCard";
import { IUser } from "../context/ChatContext";

import "./messageContainer.scss";
import { formatTypingUsers } from "../utils/helpers";

type Props = {};

const MessageContainer = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const { messages, sendMessage, currentRoom, user, isMobile, typingUsers } =
    useChatContext();
  const chatWindow = useRef<HTMLDivElement>(null);

  //!FIX, skicka bara start en gång (lokalt isTyping-state?)
  useEffect(() => {
    if (message) {
      socket.emit("user_typing_start", user?.username, currentRoom);
    }
    const timer = setTimeout(() => {
      socket.emit("user_typing_stop", currentRoom);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // createRoom(createChatRoom);
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  // const handleKeyDown = () => {
  //   socket.emit("user_typing", user.username, currentRoom);
  // };

  //const chatWindow = useRef(null);

  useEffect(() => {
    if (chatWindow.current) {
      // Scroll to the latest message
      chatWindow.current.scrollTop = chatWindow.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {!isMobile && <ChatHeader />}
      <section className="chat-window" ref={chatWindow}>
        {messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}
      </section>

      {/* {typingUsers.length > 0 &&
        typingUsers.map((user, index) => (
          <p key={index}>{user.username} is typing...</p>
        ))} */}
      {typingUsers.length > 0 && (
        <p className="typing-users">{formatTypingUsers(typingUsers)}</p>
      )}
      <form onSubmit={handleSendMessage}>
        <InputField
          type={"text"}
          value={message}
          //onKeyDown={handleKeyDown}
          // onKeyDown={handleUserTyping}
          onChange={handleInput}
          required
          placeholder="Enter message here..."
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
