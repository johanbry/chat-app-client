import { IoAddCircleOutline } from "react-icons/io5";

import Button from "../components/Button";
import { useChatContext } from "../context/ChatContext";
import RoomCardDesktop from "./RoomCardDesktop";

import "./roomContainerDesktop.scss";

type Props = {
  handleShowModal?: () => void;
};

const RoomContainerDesktop = ({ handleShowModal }: Props) => {
  const { rooms } = useChatContext();

  return (
    <div className="sidebar-container">
      <h2>Chat rooms</h2>
      <div className="sidebar-room-wrapper">
        {rooms &&
          rooms.map((room, index) => (
            <RoomCardDesktop key={index} room={room} />
          ))}
      </div>
      <div>
        {handleShowModal && (
          <Button
            Icon={IoAddCircleOutline}
            disabled={false}
            onClick={() => handleShowModal()}
            className="icon-btn transparent-btn large-btn"
          />
        )}
      </div>
    </div>
  );
};

export default RoomContainerDesktop;
