import { BiLogOutCircle } from 'react-icons/bi';

import Button from '../components/Button';
import { useChatContext } from '../context/ChatContext';
import './chatHeader.scss';

const ChatHeader = () => {
  const { disconnectUser, currentRoom, getUsersInRoom } = useChatContext();

  const usernames = getUsersInRoom(currentRoom)?.map(user => user.username);

  return (
    <div className="chat-header-wrapper">
      <div className="room-container">
        <p>{currentRoom}</p>
        <small>{usernames?.join(', ')}</small>
      </div>

      <Button
        Icon={BiLogOutCircle}
        disabled={false}
        onClick={disconnectUser}
        className="icon-btn transparent-btn"
      />
    </div>
  );
};

export default ChatHeader;
