import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { socket } from "../socket";

import Button from "./Button";
import InputField from "./InputField";
import ChatHeader from "./ChatHeader";
import MessageCard from "./MessageCard";
import { IUser } from "../context/ChatContext";

import "./messageContainer.scss";

type Props = {};

const MessageContainer = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const { messages, sendMessage, currentRoom, user, isMobile, typingUsers } =
    useChatContext();
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

  return (
    <>
      {!isMobile && <ChatHeader />}
      <section className="chat-window">
        {messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))}
      </section>

      {typingUsers.length > 0 &&
        typingUsers.map((user, index) => (
          <p key={index}>{user.username} is typing...</p>
        ))}
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
        <Button text={"Send message"} disabled={!message} />
      </form>
    </>
  );
};

export default MessageContainer;
