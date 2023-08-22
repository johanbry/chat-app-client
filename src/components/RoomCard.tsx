import { IRoom, useChatContext } from "../context/ChatContext";
import "./roomCard.scss";

type Props = {
  room: IRoom;
};

const RoomCard = ({ room }: Props) => {
  const { isMobile } = useChatContext();
  return (
    <>
      {isMobile ? (
        <button className="mobile-room-btn">
          {room.room} ({room.users.length})
        </button>
      ) : (
        <button>
          {room.room}
          {room.users.map((user) => (
            <span>{user.username}</span>
          ))}
        </button>
      )}
    </>
  );
};

export default RoomCard;
