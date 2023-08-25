//import { useState, ChangeEvent, FormEvent } from "react";

import { useChatContext } from "../context/ChatContext";
import { IoAddCircleOutline } from "react-icons/io5";

import Button from "./Button";
import RoomCard from "./RoomCard";

import "./roomContainer.scss";

type Props = {
  handleShowModal: () => void;
};

const RoomContainer = ({ handleShowModal }: Props) => {
  const { rooms } = useChatContext();

  return (
    <>
      <div className="room-list-wrapper">
        {rooms &&
          rooms.map((room, index) => <RoomCard key={index} room={room} />)}
        {handleShowModal && (
          <Button
            Icon={IoAddCircleOutline}
            disabled={false}
            onClick={() => handleShowModal()}
            className="icon-btn transparent-btn"
          />
        )}
      </div>
    </>
  );
};

export default RoomContainer;
