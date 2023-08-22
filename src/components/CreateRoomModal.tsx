import { useState, ChangeEvent, FormEvent } from "react";

import Button from "./Button";
import InputField from "./InputField";
import { useChatContext } from "../context/ChatContext";

type Props = {
  handleCloseModal: () => void;
};

const CreateRoomModal = ({ handleCloseModal }: Props) => {
  const { createRoom } = useChatContext();
  const [createChatRoom, setCreateChatRoom] = useState<string>("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateChatRoom(e.target.value);
    // createRoom(createChatRoom);
  };

  const handleCreateRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createRoom(createChatRoom);
    handleCloseModal();
  };
  return (
    <div
      style={{
        zIndex: 99,
        backgroundColor: "rgba(92, 70, 140, 0.8)",

        height: "100vh",
        width: "100vw",
        color: "#fff",
        position: "absolute",
        top: 0,
      }}
    >
      <div>
        <h1>Create Room</h1>
        <form onSubmit={handleCreateRoom}>
          <InputField
            type="text"
            value={createChatRoom}
            onChange={handleInput}
            required
          />
          <div>
            <Button
              onClick={() => handleCloseModal()}
              text={"Cancel"}
              disabled={false}
            />
            <Button text={"Create room"} disabled={!createChatRoom} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
