import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useChatContext } from "../context/ChatContext";
import { socket } from "../socket";

import Button from "./Button";
import InputField from "./InputField";
import ChatHeader from "./ChatHeader";

type Props = {};

const MessageContainer = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const [userTyping, setUserTyping] = useState<Set<string> | null>(null);
  const { messages, sendMessage, currentRoom, user, isMobile } =
    useChatContext();

  useEffect(() => {
    socket.on("send_typing_info", (username) => {
      console.log(username, currentRoom);
      const newSet = new Set(userTyping);
      newSet.add(username);
      setUserTyping(newSet);

      setTimeout(() => {
        const newSet = new Set(userTyping);
        newSet.delete(username);
        setUserTyping(newSet);
      }, 5000);

      //showUserTyping(username);
      //setUserTyping(username);
    });
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    // createRoom(createChatRoom);
  };

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(message);
  };

  const handleKeyDown = () => {
    socket.emit("user_typing", user.username, currentRoom);
  };

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
      {/* {userTyping &&
        userTyping.size > 0 &&
        Array.from(userTyping).map((user) => (
          <p key={user}>{user} is typing...</p>
        ))} */}
      <form onSubmit={handleSendMessage}>
        <InputField
          type={"text"}
          value={message}
          onKeyDown={handleKeyDown}
          onChange={handleInput}
          required
        />
        <Button text={"Send message"} disabled={!message} />
      </form>
    </>
  );
};

export default MessageContainer;
