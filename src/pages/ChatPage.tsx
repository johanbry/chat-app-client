import RoomContainer from "../components/RoomContainer";
import MessageContainer from "../components/MessageContainer";

type Props = {};

const ChatPage = (props: Props) => {
  return (
    <>
      <h1>ChatPage</h1>
      <RoomContainer />

      <MessageContainer />
    </>
  );
};

export default ChatPage;
