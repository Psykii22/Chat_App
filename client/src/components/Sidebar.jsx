import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Users, Plus, Search, Loader2, X } from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Sidebar = () => {
  const { chats, fetchChats, selectedChat, setSelectedChat, accessChat, createGroupChat } = useChatStore();
  const { authUser } = useAuthStore();
  
  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Group state
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    setIsSearching(true);
    try {
      const { data } = await axiosInstance.get(`/auth/users?search=${searchQuery}`);
      setSearchResults(data);
    } catch (error) {
      toast.error('Failed to search users');
    } finally {
      setIsSearching(false);
    }
  };

  const startChat = async (userId) => {
    await accessChat(userId);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const getChatName = (chat) => {
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users.find(u => u._id !== authUser._id);
    return otherUser ? otherUser.username : 'Unknown User';
  };
  
  const getChatAvatar = (chat) => {
    if (chat.isGroupChat) return chat.chatName.charAt(0).toUpperCase();
    const otherUser = chat.users.find(u => u._id !== authUser._id);
    return otherUser ? otherUser.username.charAt(0).toUpperCase() : '?';
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName || selectedUsers.length < 2) {
      toast.error('Please enter a name and select at least 2 users');
      return;
    }
    const success = await createGroupChat(groupName, selectedUsers);
    if (success) {
      setIsGroupOpen(false);
      setGroupName('');
      setSelectedUsers([]);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleGroupSearch = async (query) => {
    setSearchQuery(query);
    if (!query) return;
    try {
      const { data } = await axiosInstance.get(`/auth/users?search=${query}`);
      setSearchResults(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddUserToGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast.error('User already added');
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDeleteUserFromGroup = (userToDelete) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== userToDelete._id));
  };

  return (
    <div className="w-1/3 bg-card rounded-xl shadow-sm border flex-col hidden sm:flex">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="size-5 text-primary" />
          Chats
        </h2>
        <div className="flex gap-2">
          <Dialog open={isSearchOpen} onOpenChange={(open) => { setIsSearchOpen(open); setSearchResults([]); setSearchQuery(''); }}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Search className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Search Users</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSearch} className="flex gap-2 mt-4">
                <Input
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit" disabled={isSearching}>
                  {isSearching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
                </Button>
              </form>
              <ScrollArea className="max-h-[300px] mt-4">
                <div className="space-y-2">
                  {searchResults.map((user) => (
                    <div 
                      key={user._id} 
                      onClick={() => startChat(user._id)}
                      className="flex items-center gap-3 p-2 hover:bg-accent rounded-lg cursor-pointer transition-colors border border-transparent hover:border-border"
                    >
                      <Avatar>
                        <AvatarImage src={user.profilePic} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-sm">{user.username}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>

          <Dialog open={isGroupOpen} onOpenChange={(open) => { setIsGroupOpen(open); setSearchResults([]); setSearchQuery(''); setSelectedUsers([]); }}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full text-primary">
                <Plus className="size-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Group Chat</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <Input
                  placeholder="Group Name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Input
                  placeholder="Search users to add..."
                  onChange={(e) => handleGroupSearch(e.target.value)}
                />
                
                {selectedUsers.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedUsers.map((u) => (
                      <span key={u._id} className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        {u.username}
                        <button onClick={() => handleDeleteUserFromGroup(u)} className="hover:text-red-500">
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <ScrollArea className="max-h-[200px]">
                  <div className="space-y-1">
                    {searchResults?.slice(0, 4).map((user) => (
                      <div 
                        key={user._id} 
                        onClick={() => handleAddUserToGroup(user)}
                        className="px-3 py-2 hover:bg-accent cursor-pointer rounded-md text-sm border border-transparent hover:border-border"
                      >
                        {user.username}
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsGroupOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateGroup}>Create Group</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => setSelectedChat(chat)}
              className={`p-3 rounded-lg cursor-pointer transition-colors flex items-center gap-3 ${
                selectedChat?._id === chat._id ? 'bg-primary text-primary-foreground' : 'hover:bg-accent bg-card border'
              }`}
            >
              <Avatar className="size-10">
                <AvatarFallback className={selectedChat?._id === chat._id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary font-medium"}>
                  {getChatAvatar(chat)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <div className="font-semibold text-sm">{getChatName(chat)}</div>
                {chat.latestMessage && (
                  <div className={`text-xs truncate mt-0.5 ${selectedChat?._id === chat._id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    <span className="font-medium">{chat.latestMessage.sender.username}: </span>
                    {chat.latestMessage.content || "Image"}
                  </div>
                )}
              </div>
            </div>
          ))}
          {chats.length === 0 && (
            <div className="text-center text-muted-foreground mt-10 text-sm">
              No chats yet. Search for users to start chatting!
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
