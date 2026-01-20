import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, MessageCircle } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { getMessages, saveMessages, Message } from '@/data/mockData';
import { toast } from 'sonner';

interface ChatInterfaceProps {
  recipientId: string;
  recipientName: string;
  recipientType?: string; // Type of user being messaged
  onClose: () => void;
}

const ChatInterface = ({ recipientId, recipientName, recipientType, onClose }: ChatInterfaceProps) => {
  const { currentUser, isPremium } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const allMessages = getMessages();
    const filtered = allMessages.filter(
      (m) =>
        (m.senderId === currentUser?.id && m.receiverId === recipientId) ||
        (m.senderId === recipientId && m.receiverId === currentUser?.id)
    );
    setMessages(filtered);
  }, [currentUser?.id, recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser) return;

    if (!isPremium) {
      toast.error("Apenas usuários premium podem enviar mensagens.");
      return;
    }

    // Messaging Rules:
    // Athlete ("player") can only message Clubs, Coaches, and Agents.
    // Clubs, Agents, and Coaches can message everyone.
    if (currentUser.type === 'player' && recipientType === 'player') {
      toast.error("Atletas não podem enviar mensagens para outros atletas.");
      return;
    }

    const message: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      receiverId: recipientId,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    const allMessages = getMessages();
    const updatedMessages = [...allMessages, message];
    saveMessages(updatedMessages);
    setMessages([...messages, message]);
    setNewMessage('');

    // Simulate response after 2 seconds
    setTimeout(() => {
      const responseMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        senderId: recipientId,
        receiverId: currentUser.id,
        content: `Obrigado pela mensagem, ${currentUser.name.split(' ')[0]}! Entraremos em contato em breve.`,
        timestamp: new Date().toISOString(),
        read: false,
      };
      const msgs = getMessages();
      saveMessages([...msgs, responseMessage]);
      setMessages((prev) => [...prev, responseMessage]);
    }, 2000);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="w-full max-w-lg glass-card rounded-2xl border-accent-glow overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-orange-light/20 flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{recipientName}</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-sm py-8">
              Inicie uma conversa com {recipientName}
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${message.senderId === currentUser?.id
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-secondary text-foreground rounded-bl-sm'
                    }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.senderId === currentUser?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-secondary/30">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 h-10 bg-background border-border"
            />
            <Button type="submit" variant="hero" size="sm" className="h-10 px-4">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
