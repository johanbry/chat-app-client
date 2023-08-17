import { ChangeEvent, useState } from "react";
import { useChatContext } from "../context/ChatContext";

import Button from "./Button";
import InputField from "./InputField";

type Props = {};

const MessageContainer = (props: Props) => {
  const [message, setMessage] = useState<string>("");
  const { messages, sendMessage } = useChatContext();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    // createRoom(createChatRoom);
  };

  const handleSendMessage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <>
      {messages.map((message, index) => (
        <div key={index}>
          <p>From: {message.from}</p>
          <p>Message: {message.message}</p>
          <p>Date: {message.date.toString()}</p>
        </div>
      ))}
      <form onSubmit={handleSendMessage}>
        <InputField
          type={"text"}
          value={message}
          onChange={handleInput}
          required
        />
        <Button text={"Send message"} disabled={!message} />
      </form>
    </>
  );
};

export default MessageContainer;
