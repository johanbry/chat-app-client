import { IMessage, useChatContext } from "../context/ChatContext";
import "./messageCard.scss";

type Props = {
  message: IMessage;
};

const MessageCard = ({ message }: Props) => {
  const { user } = useChatContext();
  return (
    <div className="chat-message-wrapper">
      {message.from === "system" ? (
        <p className="system-message">{message.message}</p>
      ) : message.from === user?.username ? (
        <article className="user-message-container own-container">
          <small>{message.from}</small>
          <p className="user-message own">{message.message}</p>
          <small>{message.date.toString()}</small>
          <div className="clip-path-right"></div>
        </article>
      ) : (
        <article className="user-message-container other-container">
          <small>{message.from}</small>
          <p className="user-message other">{message.message}</p>
          <small>{message.date.toString()}</small>
          <div className="clip-path-left"></div>
        </article>
      )}
    </div>
  );
};

export default MessageCard;
