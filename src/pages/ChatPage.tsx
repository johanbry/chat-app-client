import { useState } from "react";

import RoomContainer from "../components/RoomContainer";
import RoomContainerDesktop from "../components/RoomContainerDesktop";
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
    <>
      {/* // <div className="chat-page-container">
    //   {isMobile && <ChatHeader handleShowModal={handleShowModal} />}
    //   <RoomContainer />
    //   <MessageContainer />
    //   {showModal && <CreateRoomModal handleCloseModal={handleCloseModal} />} */}

      {isMobile ? (
        <section className="chat-page-container-mobile">
          <ChatHeader handleShowModal={handleShowModal} />
          <RoomContainer handleShowModal={handleShowModal} />
          <MessageContainer />
        </section>
      ) : (
        <section className="chat-page-container-desktop">
          <RoomContainerDesktop handleShowModal={handleShowModal} />
          <div className="chat-window-container-desktop">
            <MessageContainer />
          </div>
        </section>
      )}
      {showModal && <CreateRoomModal handleCloseModal={handleCloseModal} />}
    </>
  );
};

export default ChatPage;
