import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { socket } from "../socket";

import Button from "./Button";
import InputField from "./InputField";
import ChatHeader from "./ChatHeader";
import { IUser } from "../context/ChatContext";

type Props = {};

const MessageContainer = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const { messages, sendMessage, currentRoom, user, isMobile, typingUsers } =
    useChatContext();

  useEffect(() => {
    if (message) {
      socket.emit("user_typing_start", user?.username, currentRoom);
    }
    const timer = setTimeout(() => {
      socket.emit("user_typing_stop", user?.username, currentRoom);
    }, 3000);

    return () => {
      console.log("clean up function run");
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
  };

  // const handleKeyDown = () => {
  //   socket.emit("user_typing", user.username, currentRoom);
  // };

  return (
    <>
      {!isMobile && <ChatHeader />}
      {messages.map((message, index) => (
        <div key={index}>
          <p>From: {message.from}</p>
          <p>Message: {message.message}</p>
          <p>Date: {message.date.toString()}</p>
        </div>
      ))}
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
