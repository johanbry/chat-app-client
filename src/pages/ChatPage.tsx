import { useState } from 'react';

import RoomContainer from '../components/RoomContainer';
import RoomContainerDesktop from '../components/RoomContainerDesktop';
import MessageContainer from '../components/MessageContainer';
import { useChatContext } from '../context/ChatContext';
import ChatHeader from '../components/ChatHeader';
import CreateRoomModal from '../components/CreateRoomModal';

import './chatpage.scss';

const ChatPage = () => {
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
      {isMobile ? (
        <section className="chat-page-container-mobile">
          <ChatHeader />
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
