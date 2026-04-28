import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { Send, Image as ImageIcon, Loader2, X, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChatBox = () => {
  const { selectedChat, messages, fetchMessages, sendMessage, isMessagesLoading, isSendingMessage } = useChatStore();
  const { authUser } = useAuthStore();
  const [newMessage, setNewMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imageFile) return;

    await sendMessage(newMessage, imageFile);
    setNewMessage('');
    setImageFile(null);
  };

  const getChatName = (chat) => {
    if (!chat) return '';
    if (chat.isGroupChat) return chat.chatName;
    const otherUser = chat.users.find(u => u._id !== authUser._id);
    return otherUser ? otherUser.username : 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    if (!chat) return '?';
    if (chat.isGroupChat) return chat.chatName.charAt(0).toUpperCase();
    const otherUser = chat.users.find(u => u._id !== authUser._id);
    return otherUser ? otherUser.username.charAt(0).toUpperCase() : '?';
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 bg-card rounded-xl shadow-sm border flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <MessageSquare className="size-12 mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-card rounded-xl shadow-sm border flex flex-col overflow-hidden min-h-0">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3 bg-background/50 shrink-0">
        <Avatar>
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getChatAvatar(selectedChat)}
          </AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">{getChatName(selectedChat)}</h2>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 min-h-0 bg-accent/30">
        <div className="space-y-4 p-4">
          {isMessagesLoading ? (
            <div className="flex justify-center mt-10">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : (
            messages.map((m) => {
              const isOwn = m.sender._id === authUser._id;
              return (
                <div key={m._id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                  {!isOwn && selectedChat.isGroupChat && (
                    <div className="text-[11px] text-muted-foreground mb-1 ml-1">{m.sender.username}</div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl max-w-[75%] shadow-sm ${
                    isOwn 
                      ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                      : 'bg-background border text-foreground rounded-tl-sm'
                  }`}>
                    {m.image && (
                      <img 
                        src={import.meta.env.MODE === 'development' ? `http://localhost:5000${m.image}` : m.image} 
                        alt="attachment" 
                        className="rounded-lg max-w-full h-auto mb-2 object-cover"
                      />
                    )}
                    {m.content && <div className="text-sm">{m.content}</div>}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1 mx-1">
                    {format(new Date(m.createdAt), 'hh:mm a')}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 bg-background border-t flex items-end gap-2">
        <label className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-full cursor-pointer transition-colors shrink-0 mb-1">
          <ImageIcon className="size-5" />
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>
        
        <div className="flex-1 flex flex-col min-w-0">
          {imageFile && (
            <div className="text-xs text-primary mb-2 truncate bg-primary/10 px-3 py-1.5 rounded-md w-fit flex items-center gap-2">
              <span className="truncate max-w-[150px]">Attached: {imageFile.name}</span>
              <button 
                type="button" 
                onClick={() => setImageFile(null)}
                className="hover:text-red-500"
              >
                <X className="size-3" />
              </button>
            </div>
          )}
          <Input
            className="w-full bg-accent/50 border-transparent focus-visible:ring-1 focus-visible:ring-primary rounded-full px-4"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          size="icon"
          className="rounded-full shrink-0 mb-1"
          disabled={(!newMessage.trim() && !imageFile) || isSendingMessage}
        >
          {isSendingMessage ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
        </Button>
      </form>
    </div>
  );
};

export default ChatBox;
