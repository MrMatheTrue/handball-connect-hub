import React from 'react';
import { Users, FileText, Briefcase, MessageSquare, TrendingUp } from "lucide-react";
import {
    getPlayers,
    getClubs,
    getCoaches,
    getAgents,
    getOpportunities,
    getArticles,
    getConversations
} from "@/data/mockData";

const AdminStats = () => {
    const stats = [
        {
            label: 'Total de Usuários',
            value: getPlayers().length + getClubs().length + getCoaches().length + getAgents().length,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            label: 'Vagas Ativas',
            value: getOpportunities().length,
            icon: Briefcase,
            color: 'text-primary',
            bg: 'bg-primary/10'
        },
        {
            label: 'Notícias/Artigos',
            value: getArticles().length,
            icon: FileText,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            label: 'Conversas Ativas',
            value: getConversations().length,
            icon: MessageSquare,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="glass-card rounded-2xl p-6 border-accent-glow hover:translate-y-[-4px] transition-all duration-300"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                            <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                        </div>
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-xs text-green-500">
                        <TrendingUp className="w-3 h-3" />
                        <span>+12% desde o último mês</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStats;
