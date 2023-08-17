import { useState, ChangeEvent, FormEvent } from "react";

import { useChatContext } from "../context/ChatContext";
import InputField from "./InputField";
import Button from "./Button";

type Props = {};

const RoomContainer = (props: Props) => {
  const { rooms, createRoom } = useChatContext();
  const [createChatRoom, setCreateChatRoom] = useState<string>("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateChatRoom(e.target.value);
    // createRoom(createChatRoom);
  };

  const handleCreateRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createRoom(createChatRoom);
  };

  return (
    <>
      {rooms &&
        rooms.map((room, index) => (
          <div key={index}>
            <button>{room.room}</button>
            {room.users.map((user) => (
              <p key={user.id}>{user.username}</p>
            ))}
          </div>
        ))}

      <form onSubmit={handleCreateRoom}>
        <InputField
          type="text"
          value={createChatRoom}
          onChange={handleInput}
          required
        />
        <Button text={"Create room"} disabled={!createChatRoom} />
      </form>
    </>
  );
};

export default RoomContainer;
