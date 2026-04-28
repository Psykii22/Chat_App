import { useEffect } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from '../components/Sidebar';
import ChatBox from '../components/ChatBox';
import Navbar from '../components/Navbar';

const Home = () => {
  const { initSocket, disconnectSocket } = useChatStore();
  const { authUser } = useAuthStore();

  useEffect(() => {
    if (authUser) {
      initSocket();
    }
    return () => {
      disconnectSocket();
    };
  }, [authUser, initSocket, disconnectSocket]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Navbar />
      <div className="flex-1 flex overflow-hidden max-w-7xl w-full mx-auto p-4 gap-4">
        <Sidebar />
        <ChatBox />
      </div>
    </div>
  );
};

export default Home;