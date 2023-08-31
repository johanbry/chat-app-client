import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import { SlMagnifier } from 'react-icons/sl';
import { SyntheticEvent, useState } from 'react';
import { IGif } from '@giphy/js-types';

import InputField from '../InputField/InputField';
import './gifModal.scss';
import { useChatContext } from '../../context/ChatContext';

type Props = {
  handleGifClick: (
    arg0: IGif,
    arg1: SyntheticEvent<HTMLElement, Event>
  ) => void;
};

const GifModal = ({ handleGifClick }: Props) => {
  const [searchGif, setSearchGif] = useState('');
  const giphyFetch = import.meta.env.VITE_GIPHY_API_KEY;
  const { windowWidth, isMobile } = useChatContext();

  const gf = new GiphyFetch(giphyFetch);
  const fetchGifs = (offset: number) => gf.trending({ offset, limit: 10 });

  const fetchSearchGifs = () => gf.search(searchGif);

  return (
    <section className="gif-modal-wrapper">
      <div className="search-gif-container">
        <span className="search-gif-icon">{<SlMagnifier />}</span>
        <InputField
          type="text"
          value={searchGif}
          onChange={e => setSearchGif(e.target.value)}
          required={false}
          placeholder="Search gif..."
          className="gif-input"
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
