import { IRoom, useChatContext } from "../context/ChatContext";
import "./roomCardDesktop.scss";

type Props = {
  room: IRoom;
  current: boolean;
};

const RoomCardDesktop = ({ room, current }: Props) => {
  const { createRoom } = useChatContext();

  const handleJoinRoom = () => {
    //!FIXME:
    createRoom(room.room);
  };

  return (
    <div
      className={`desktop-room-btn ${current ? "current" : ""}`}
      onClick={handleJoinRoom}
    >
      <h4>{room.room}</h4>
      <div>
        {room.users.map((user) => (
          <span key={user.id} className="user-tag">
            {user.username}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoomCardDesktop;
