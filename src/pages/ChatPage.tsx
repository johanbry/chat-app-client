import { useState } from "react";

import RoomContainer from "../components/RoomContainer";
import MessageContainer from "../components/MessageContainer";
import Button from "../components/Button";
import { useChatContext } from "../context/ChatContext";
import ChatHeader from "../components/ChatHeader";
import CreateRoomModal from "../components/CreateRoomModal";

import "./chatpage.scss";

type Props = {};

const ChatPage = (props: Props) => {
  const [showModal, setShowModal] = useState(false);
  const { isMobile } = useChatContext();

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="chat-page-container">
      {/* <h1>ChatPage</h1> */}
      {isMobile && <ChatHeader handleShowModal={handleShowModal} />}
      <RoomContainer />
      <MessageContainer />
      {showModal && <CreateRoomModal handleCloseModal={handleCloseModal} />}
    </div>
  );
};

export default ChatPage;
