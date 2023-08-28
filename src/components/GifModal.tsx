import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { AiOutlineClose } from 'react-icons/ai';
import { useState } from 'react';

import InputField from './InputField';
import './gifModal.scss';
import Button from './Button';
import { useChatContext } from '../context/ChatContext';

type Props = {
  handleToggleGif: () => void;
  handleGifClick: (arg0: any, arg1: any) => void;
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
        // onGifClick={onGifClick}
        //fetchGifs={fetchGifs}
        key={searchGif}
        fetchGifs={!searchGif ? fetchGifs : fetchSearchGifs}
        //fetchGifs={!searchGif ? () => fetchGifs(0) : fetchSearchGifs}
        width={isMobile ? windowWidth : 480}
        columns={3}
        gutter={6}
      />
    </section>
  );
};

export default GifModal;
