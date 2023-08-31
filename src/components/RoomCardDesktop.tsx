import { useChatContext } from '../context/ChatContext';
import { IRoom } from '../interfaces/interfaces';
import './roomCardDesktop.scss';

type Props = {
  room: IRoom;
  current: boolean;
};

const RoomCardDesktop = ({ room, current }: Props) => {
  const { createJoinRoom } = useChatContext();

  const handleJoinRoom = () => {
    createJoinRoom(room.room);
  };

  return (
    <div
      className={`desktop-room-btn ${current ? 'current' : ''}`}
      onClick={handleJoinRoom}
    >
      <h4>{room.room}</h4>
      <div>
        {room.users.map(user => (
          <span key={user.id} className="user-tag">
            {user.username}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RoomCardDesktop;
