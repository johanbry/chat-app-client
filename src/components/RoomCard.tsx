import { useChatContext } from '../context/ChatContext';
import { IRoom } from '../interfaces/interfaces';
import './roomCard.scss';

type Props = {
  room: IRoom;
};

const RoomCard = ({ room }: Props) => {
  const { createJoinRoom } = useChatContext();

  const handleJoinRoom = () => {
    createJoinRoom(room.room);
  };

  return (
    <button className="mobile-room-btn" onClick={handleJoinRoom}>
      {room.room} ({room.users.length})
    </button>
  );
};

export default RoomCard;
