import { IRoom, useChatContext } from "../context/ChatContext";
import "./roomCardDesktop.scss";

type Props = {
  room: IRoom;
};

const RoomCardDesktop = ({ room }: Props) => {
  const { createRoom } = useChatContext();

  const handleJoinRoom = () => {
    //!FIXME:
    createRoom(room.room);
  };

  return (
    <div className="desktop-room-btn" onClick={handleJoinRoom}>
      <h4>{room.room}</h4>
      <div>
        {room.users.map((user) => (
          <span key={user.id}>{user.username}</span>
        ))}
      </div>
    </div>
  );
};

export default RoomCardDesktop;
