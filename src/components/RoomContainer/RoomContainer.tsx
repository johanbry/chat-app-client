import { IoAddCircleOutline } from 'react-icons/io5';

import { useChatContext } from '../../context/ChatContext';
import Button from '../Button/Button';
import RoomCard from '../RoomCard/RoomCard';

import './roomContainer.scss';

type Props = {
  handleShowModal: () => void;
};

const RoomContainer = ({ handleShowModal }: Props) => {
  const { rooms } = useChatContext();

  return (
    <>
      <div className="room-list-wrapper">
        <div className="room-list">
          {rooms &&
            rooms.map((room, index) => <RoomCard key={index} room={room} />)}
        </div>
        <div className="room-create-wrapper">
          {handleShowModal && (
            <Button
              Icon={IoAddCircleOutline}
              disabled={false}
              onClick={() => handleShowModal()}
              className="icon-btn transparent-btn create-btn "
            />
          )}
        </div>
      </div>
    </>
  );
};

export default RoomContainer;
