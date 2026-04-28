import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { useAuthStore } from './useAuthStore';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.MODE === 'development' ? 'http://localhost:5000' : '/';
var socket;

export const useChatStore = create((set, get) => ({
  chats: [],
  selectedChat: null,
  messages: [],
  isChatsLoading: false,
  isMessagesLoading: false,
  isSendingMessage: false,
  socketConnected: false,

  initSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    if (!authUser) return;

    socket = io(ENDPOINT);
    socket.emit('setup', authUser);
    socket.on('connected', () => set({ socketConnected: true }));

    socket.on('message recieved', (newMessageRecieved) => {
      const { selectedChat, messages } = get();
      
      if (!selectedChat || selectedChat._id !== newMessageRecieved.chat._id) {
        // Notification logic could go here
      } else {
        set({ messages: [...messages, newMessageRecieved] });
      }
    });
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      set({ socketConnected: false });
    }
  },

  fetchChats: async () => {
    set({ isChatsLoading: true });
    try {
      const res = await axiosInstance.get('/chat');
      set({ chats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch chats');
    } finally {
      set({ isChatsLoading: false });
    }
  },

  createGroupChat: async (name, users) => {
    try {
      const res = await axiosInstance.post('/chat/group', {
        name,
        users: JSON.stringify(users.map((u) => u._id)),
      });
      set({ chats: [res.data, ...get().chats] });
      toast.success('Group Chat Created!');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create group');
      return false;
    }
  },

  accessChat: async (userId) => {
    try {
      const res = await axiosInstance.post('/chat', { userId });
      
      if (!get().chats.find((c) => c._id === res.data._id)) {
        set({ chats: [res.data, ...get().chats] });
      }
      set({ selectedChat: res.data });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Error fetching the chat');
    }
  },

  setSelectedChat: (chat) => {
    set({ selectedChat: chat });
    if (chat && socket) {
      socket.emit('join chat', chat._id);
    }
  },

  fetchMessages: async () => {
    const { selectedChat } = get();
    if (!selectedChat) return;

    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/message/${selectedChat._id}`);
      set({ messages: res.data });
      if (socket) {
        socket.emit('join chat', selectedChat._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to fetch messages');
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (content, imageFile) => {
    const { selectedChat, messages } = get();
    set({ isSendingMessage: true });
    try {
      let res;
      if (imageFile) {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('chatId', selectedChat._id);
        formData.append('image', imageFile);
        
        res = await axiosInstance.post('/message', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axiosInstance.post('/message', {
          content,
          chatId: selectedChat._id,
        });
      }

      set({ messages: [...messages, res.data] });
      if (socket) {
        socket.emit('new message', res.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send message');
    } finally {
      set({ isSendingMessage: false });
    }
  },
}));
