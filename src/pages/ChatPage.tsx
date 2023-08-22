import RoomContainer from "../components/RoomContainer";
import MessageContainer from "../components/MessageContainer";
import Button from "../components/Button";
import { useChatContext } from "../context/ChatContext";

type Props = {};

const ChatPage = (props: Props) => {
  const { disconnectUser } = useChatContext();

  return (
    <>
      <h1>ChatPage</h1>
      <Button text={"Sign out"} disabled={false} onClick={disconnectUser} />
      <RoomContainer />

      <MessageContainer />
    </>
  );
};

export default ChatPage;
