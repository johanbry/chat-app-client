import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { BiLogInCircle } from "react-icons/bi";

import { useChatContext } from "../context/ChatContext";
import InputField from "../components/InputField";
import Button from "../components/Button";

import "./homepage.scss";

type Props = {};

const HomePage = (props: Props) => {
  const { connectUser, isMobile } = useChatContext();
  const [username, setUsername] = useState("");

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleConnect = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) return;
    connectUser(username);
    setUsername("");
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
          {/* <label htmlFor="username">Please fill in username</label> */}
          <InputField
            type="text"
            placeholder="Enter username..."
            required
            value={username}
            onChange={handleInput}
            className="signIn"
          />
          {/* <Button text={"Connect"} disabled={!username} /> */}

          {isMobile ? (
            <Button text={"Connect"} disabled={!username} />
          ) : (
            <Button Icon={BiLogInCircle} disabled={!username} />
          )}
        </form>
      </section>
    </div>
  );
};

export default HomePage;
