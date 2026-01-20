import React, { useState } from 'react';
import {
    getConversations,
    getMessages,
    getAllUserProfiles
} from "@/data/mockData";
import {
    MessageSquare,
    Search,
    User,
    Clock,
    Eye,
    ShieldAlert,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const GlobalMessages = () => {
    const conversations = getConversations();
    const messages = getMessages();
    const users = getAllUserProfiles();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedConv, setSelectedConv] = useState<string | null>(null);

    const getParticipant = (id: string) => users.find(u => u.id === id) || { name: 'Desconhecido', id };

    const filteredConversations = conversations.filter(conv => {
        const participants = conv.participantIds.map(id => getParticipant(id).name.toLowerCase());
        return participants.some(name => name.includes(searchTerm.toLowerCase()));
    });

    const selectedMessages = selectedConv
        ? messages.filter(m =>
            (m.senderId === conversations.find(c => c.id === selectedConv)?.participantIds[0] &&
                m.receiverId === conversations.find(c => c.id === selectedConv)?.participantIds[1]) ||
            (m.senderId === conversations.find(c => c.id === selectedConv)?.participantIds[1] &&
                m.receiverId === conversations.find(c => c.id === selectedConv)?.participantIds[0])
        )
        : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
            {/* Conversations List */}
            <div className="lg:col-span-1 glass-card rounded-2xl flex flex-col overflow-hidden">
                <div className="p-4 border-b border-border">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Filtrar conversas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-secondary/30 border border-border text-sm focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conv) => {
                        const p1 = getParticipant(conv.participantIds[0]);
                        const p2 = getParticipant(conv.participantIds[1]);

                        return (
                            <button
                                key={conv.id}
                                onClick={() => setSelectedConv(conv.id)}
                                className={`w-full p-4 border-b border-border/50 text-left transition-colors hover:bg-secondary/20 ${selectedConv === conv.id ? 'bg-secondary/40' : ''}`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </div>
                                        <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                                            {p1.name} e {p2.name}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-muted-foreground">{conv.lastMessageTime}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate italic">
                                    "{conv.lastMessage}"
                                </p>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Message View */}
            <div className="lg:col-span-2 glass-card rounded-2xl flex flex-col overflow-hidden border-accent-glow">
                {selectedConv ? (
                    <>
                        <div className="p-4 border-b border-border bg-secondary/10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center overflow-hidden">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center overflow-hidden">
                                        <User className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">
                                        {getParticipant(conversations.find(c => c.id === selectedConv)!.participantIds[0]).name} x {getParticipant(conversations.find(c => c.id === selectedConv)!.participantIds[1]).name}
                                    </h4>
                                    <p className="text-[10px] text-primary flex items-center gap-1">
                                        <ShieldAlert className="w-3 h-3" /> Monitoramento Admin Ativo
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-xs">
                                Exportar Histórico
                            </Button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {selectedMessages.map((msg) => {
                                const sender = getParticipant(msg.senderId);
                                return (
                                    <div key={msg.id} className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-foreground">{sender.name}</span>
                                            <span className="text-[9px] text-muted-foreground">{msg.timestamp}</span>
                                        </div>
                                        <div className="p-3 rounded-2xl bg-secondary/30 border border-border max-w-[80%] text-sm">
                                            {msg.content}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                        <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-6">
                            <Eye className="w-10 h-10 text-muted-foreground opacity-30" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Monitoramento Global</h3>
                        <p className="text-muted-foreground max-w-sm">
                            Selecione uma conversa lateral para monitorar a interação entre usuários. Todas as conversas são registradas para segurança da plataforma.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GlobalMessages;
