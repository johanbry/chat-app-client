//import { useState, ChangeEvent, FormEvent } from "react";

import { useChatContext } from "../context/ChatContext";
//import Button from "./Button";
import RoomCard from "./RoomCard";

import "./roomContainer.scss";

type Props = {};

const RoomContainer = (props: Props) => {
  const { rooms, createRoom, user, currentRoom } = useChatContext();
  // const [createChatRoom, setCreateChatRoom] = useState<string>("");

  // const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
  //   setCreateChatRoom(e.target.value);
  //   // createRoom(createChatRoom);
  // };

  // const handleCreateRoom = (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   createRoom(createChatRoom);
  // };

  return (
    <>
      <section className="room-list-wrapper">
        {rooms &&
          rooms.map((room, index) => <RoomCard key={index} room={room} />)}
      </section>
    </>
  );
};

export default RoomContainer;
