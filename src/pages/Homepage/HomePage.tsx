import { useState, ChangeEvent, FormEvent } from 'react';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';
import { BiLogInCircle } from 'react-icons/bi';

import { useChatContext } from '../../context/ChatContext';
import InputField from '../../components/InputField/InputField';
import Button from '../../components/Button/Button';

import './homepage.scss';

const HomePage = () => {
  const { connectUser, isMobile } = useChatContext();
  const [username, setUsername] = useState('');

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleConnect = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) return;
    connectUser(username);
    setUsername('');
  };

  return (
    <div className="homepage-wrapper">
      <section className="homepage-logo-container">
        <HiChatBubbleLeftRight />
        <h1>ChatApp</h1>
      </section>
      <span className="divider"></span>
      <section className="homepage-form-container">
        <form onSubmit={handleConnect}>
          <InputField
            type="text"
            placeholder="Enter username..."
            required
            value={username}
            onChange={handleInput}
            className="no-border-right"
          />
          {isMobile ? (
            <Button text={'Connect'} disabled={!username} />
          ) : (
            <Button
              Icon={BiLogInCircle}
              disabled={!username}
              className="sign-in-desktop-btn icon-btn
            "
            />
          )}
        </form>
      </section>
    </div>
  );
};

export default HomePage;
