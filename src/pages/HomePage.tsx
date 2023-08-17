import { useState, ChangeEvent, FormEvent } from "react";

import { useChatContext } from "../context/ChatContext";
import InputField from "../components/InputField";
import Button from "../components/Button";

type Props = {};

const HomePage = (props: Props) => {
  const { connectUser } = useChatContext();
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
    <>
      <div>
        <h1>Chat App</h1>
      </div>
      <div>
        <form onSubmit={handleConnect}>
          <label htmlFor="username">Please fill in username</label>
          <InputField
            type="text"
            placeholder="Enter username..."
            required
            value={username}
            onChange={handleInput}
          />

          <Button text={"Connect"} disabled={!username} />
        </form>
      </div>
    </>
  );
};

export default HomePage;
