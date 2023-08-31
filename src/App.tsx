import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/Homepage/HomePage';
import ChatPage from './pages/ChatPage/ChatPage';

import './_global.scss';

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </main>
  );
};

export default App;
