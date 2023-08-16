import { useChatContext } from "../context/ChatContext";
import { useState } from "react";

type Props = {};

const HomePage = (props: Props) => {
  const { connectUser } = useChatContext();
  const [username, setUsername] = useState("");

  const handleConnect = (e: React.FormEvent<HTMLFormElement>) => {
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
          <input
            type="text"
            placeholder="username..."
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button type="submit">Connect</button>
        </form>
      </div>
    </>
  );
};

export default HomePage;
