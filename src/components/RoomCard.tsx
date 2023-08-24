import { IRoom, useChatContext } from "../context/ChatContext";
import "./roomCard.scss";

type Props = {
  room: IRoom;
};

const RoomCard = ({ room }: Props) => {
  const { isMobile, createRoom } = useChatContext();

  const handleJoinRoom = () => {
    //!FIXME:
    createRoom(room.room);
  };

  return (
    <>
      {isMobile ? (
        <button className="mobile-room-btn" onClick={handleJoinRoom}>
          {room.room} ({room.users.length})
        </button>
      ) : (
        <button onClick={handleJoinRoom}>
          {room.room}
          {room.users.map((user) => (
            <span key={user.id}>{user.username}</span>
          ))}
        </button>
      )}
    </>
  );
};

export default RoomCard;
