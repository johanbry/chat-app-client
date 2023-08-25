import { IRoom, useChatContext } from "../context/ChatContext";
import "./roomCard.scss";

type Props = {
  room: IRoom;
};

const RoomCard = ({ room }: Props) => {
  const { createRoom } = useChatContext();

  const handleJoinRoom = () => {
    //!FIXME:
    createRoom(room.room);
  };

  return (
    <button className="mobile-room-btn" onClick={handleJoinRoom}>
      {room.room} ({room.users.length})
    </button>
  );
};

export default RoomCard;
