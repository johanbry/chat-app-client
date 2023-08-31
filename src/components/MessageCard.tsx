import { useEffect, useState } from 'react';
import { Gif } from '@giphy/react-components';
import { IGif } from '@giphy/js-types';
import { GiphyFetch } from '@giphy/js-fetch-api';

import { useChatContext } from '../context/ChatContext';
import { IMessage } from '../interfaces/interfaces';
import './messageCard.scss';
import { formatDate } from '../utils/helpers';

///import image from '../assets/logo.png';

type Props = {
  message: IMessage;
  handleScrollToBottom: () => void;
};

const MessageCard = ({ message, handleScrollToBottom }: Props) => {
  const { user } = useChatContext();
  const [gif, setGif] = useState<IGif | null>(null);
  //const [gif, setGif] = useState<string | null>(null);

  let messageType;

  if (message.from === 'system') messageType = 'system';
  else if (message.from === user?.username) messageType = 'own';
  else messageType = 'other';

  useEffect(() => {
    const fetchGif = async () => {
      const giphy = message.message.indexOf('/gif:');
      if (giphy > -1) {
        const id = message.message.substring(giphy + 5, message.message.length);
        if (id) {
          const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);
          const { data } = await gf.gif(id);
          setGif(data);
        }
      }
    };
    fetchGif();
  }, [message.message]);

  useEffect(() => {
    handleScrollToBottom();
  }, [gif, handleScrollToBottom]);

  return (
    <div className="chat-message-wrapper">
      {messageType === 'system' ? (
        <p className="system-message">{message.message}</p>
      ) : (
        <article className={`user-message-container ${messageType}-container`}>
          <small>{message.from}</small>

          {gif ? (
            <Gif
              gif={gif}
              width={300}
              noLink
              className={`user-message ${messageType}`}
            />
          ) : (
            <p className={`user-message ${messageType}`}>{message.message}</p>
          )}
          {/* </p> */}

          <small>{formatDate(message.date)}</small>
          <div
            className={`${
              messageType === 'own' ? 'clip-path-right' : 'clip-path-left'
            }`}
          ></div>
        </article>
      )}
    </div>
  );
};

export default MessageCard;
