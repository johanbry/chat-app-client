import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { AiOutlineClose } from 'react-icons/ai';
import { SyntheticEvent, useState } from 'react';
import { IGif } from '@giphy/js-types';

import InputField from './InputField';
import './gifModal.scss';
import Button from './Button';
import { useChatContext } from '../context/ChatContext';

type Props = {
  handleToggleGif: () => void;
  handleGifClick: (
    arg0: IGif,
    arg1: SyntheticEvent<HTMLElement, Event>
  ) => void;
};

const GifModal = ({ handleToggleGif, handleGifClick }: Props) => {
  const [searchGif, setSearchGif] = useState('');
  const giphyFetch = import.meta.env.VITE_GIPHY_API_KEY;
  const { windowWidth, isMobile } = useChatContext();

  const gf = new GiphyFetch(giphyFetch);
  const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 });

  const fetchSearchGifs = () => gf.search(searchGif);

  return (
    <section className="gif-modal-wrapper">
      <div className="search-gif-container">
        <InputField
          type="text"
          value={searchGif}
          onChange={e => setSearchGif(e.target.value)}
          required={false}
          placeholder="Search gif..."
        />
        <Button
          Icon={AiOutlineClose}
          disabled={false}
          onClick={() => handleToggleGif()}
          className="icon-btn "
        />
      </div>
      <Grid
        onGifClick={(gif, e) => handleGifClick(gif, e)}
        key={searchGif}
        fetchGifs={!searchGif ? fetchGifs : fetchSearchGifs}
        width={isMobile ? windowWidth : 480}
        columns={3}
        gutter={6}
      />
      <div className="giphy-terms">
        <p>
          Powered By{' '}
          <a
            href="https://support.giphy.com/hc/en-us/articles/360020027752-GIPHY-User-Terms-of-Service"
            target="_blank"
            rel="noopener noreferer"
          >
            GIPHY
          </a>
        </p>
      </div>
    </section>
  );
};

export default GifModal;
