import { IoAddCircleOutline } from "react-icons/io5";
import { BiLogOutCircle } from "react-icons/bi";

import Button from "../components/Button";
import { useChatContext } from "../context/ChatContext";
import "./chatHeader.scss";

type Props = {
  handleShowModal: () => void;
};

const ChatHeader = ({ handleShowModal }: Props) => {
  const { disconnectUser, currentRoom, rooms, isMobile, getUsersInRoom } =
    useChatContext();

  const usernames = getUsersInRoom(currentRoom)?.map((user) => user.username);

  return (
    <div className="chat-header-wrapper">
      {isMobile && (
        <Button
          Icon={BiLogOutCircle}
          disabled={false}
          onClick={disconnectUser}
        />
      )}
      <div className="room-container">
        <p>{currentRoom}</p>
        <small>{usernames?.join(", ")}</small>
      </div>

      {isMobile && (
        <Button
          Icon={IoAddCircleOutline}
          disabled={false}
          onClick={() => handleShowModal()}
        />
      )}
    </div>
  );
};

export default ChatHeader;
