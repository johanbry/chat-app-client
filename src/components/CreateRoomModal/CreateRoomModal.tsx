import { useState, ChangeEvent, FormEvent, MouseEvent } from 'react';

import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import { useChatContext } from '../../context/ChatContext';

import './createRoomModal.scss';

type Props = {
  handleCloseModal: () => void;
};

const CreateRoomModal = ({ handleCloseModal }: Props) => {
  const { createJoinRoom } = useChatContext();
  const [createChatRoom, setCreateChatRoom] = useState<string>('');

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setCreateChatRoom(e.target.value);
  };

  const handleCreateRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createJoinRoom(createChatRoom);
    handleCloseModal();
  };

  const handleBackgroundClick = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    if (e.target == e.currentTarget) {
      handleCloseModal();
    }
  };

  return (
    <div className="modal-background" onClick={e => handleBackgroundClick(e)}>
      <div className="modal-wrapper">
        <h1>Create Room</h1>
        <form onSubmit={handleCreateRoom}>
          <InputField
            type="text"
            value={createChatRoom}
            onChange={handleInput}
            placeholder="Enter room name..."
            required
            autofocus
          />
          <div>
            <Button
              onClick={handleCloseModal}
              text={'Cancel'}
              disabled={false}
              type="button"
            />
            <Button text={'Create room'} disabled={!createChatRoom} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoomModal;
