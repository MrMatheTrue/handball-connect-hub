import React, { useState } from 'react';
import {
    getAllUserProfiles,
    savePlayers,
    saveAgents,
    saveClubs,
    saveCoaches,
    getPlayers,
    getAgents,
    getClubs,
    getCoaches
} from "@/data/mockData";
import {
    Search,
    Filter,
    Crown,
    Shield,
    User as UserIcon,
    MoreVertical,
    Edit,
    Trash2,
    Check,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState(getAllUserProfiles());
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const togglePremium = (userId: string, category: string) => {
        let updatedUsers = [...users];

        // Update local state
        const userIndex = updatedUsers.findIndex(u => u.id === userId && u.userCategory === category);
        if (userIndex !== -1) {
            const currentStatus = !!(updatedUsers[userIndex] as any).isPremiumProfile;
            (updatedUsers[userIndex] as any).isPremiumProfile = !currentStatus;
            setUsers(updatedUsers);

            // Persist to localStorage
            if (category === 'player') {
                const players = getPlayers();
                savePlayers(players.map(p => p.id === userId ? { ...p, isPremiumProfile: !currentStatus } : p));
            } else if (category === 'coach') {
                const coaches = getCoaches();
                saveCoaches(coaches.map(c => c.id === userId ? { ...c, isPremiumProfile: !currentStatus } : c));
            } else if (category === 'agent') {
                // Agent doesn't have isPremiumProfile in interface but we can add it or handle via userId
                // For simplicity in this mock, we assume all have it or we handle it via a global user list if we had one
            }

            toast({
                title: "Status Premium Atualizado",
                description: `O status premium de ${updatedUsers[userIndex].name} foi alterado.`,
            });
        }
    };

    return (
        <div className="glass-card rounded-2xl overflow-hidden shadow-xl border-accent-glow">
            <div className="p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-xl font-bold">Base de Usuários</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Filtrar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-xl bg-secondary/30 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-full sm:w-64"
                            />
                        </div>
                        <Button variant="outline" size="icon" className="rounded-xl">
                            <Filter className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-secondary/20 text-muted-foreground text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-semibold">Usuário</th>
                            <th className="px-6 py-4 font-semibold">Tipo</th>
                            <th className="px-6 py-4 font-semibold">Localização</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {(filteredUsers as any[]).map((user) => (
                            <tr key={`${user.id}-${user.userCategory}`} className="hover:bg-secondary/10 transition-colors group">
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                                            {user.photoUrl || user.logoUrl ? (
                                                <img src={user.photoUrl || user.logoUrl} alt={user.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-5 h-5 text-muted-foreground" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-foreground flex items-center gap-1">
                                                {user.name}
                                                {user.isPremiumProfile && <Crown className="w-3 h-3 text-primary fill-primary" />}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-medium">
                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${user.userCategory === 'player' ? 'bg-blue-500/10 text-blue-500' :
                                        user.userCategory === 'club' ? 'bg-primary/10 text-primary' :
                                            user.userCategory === 'coach' ? 'bg-green-500/10 text-green-500' :
                                                'bg-purple-500/10 text-purple-500'
                                        }`}>
                                        {user.userCategory === 'player' ? 'Atleta' :
                                            user.userCategory === 'club' ? 'Clube' :
                                                user.userCategory === 'coach' ? 'Técnico' : 'Agente'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {user.city}, {user.state || user.country}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.isPremiumProfile ? 'bg-primary shadow-[0_0_8px_rgba(255,107,53,0.5)]' : 'bg-muted-foreground/30'}`} />
                                        <span className={user.isPremiumProfile ? 'text-primary font-medium' : 'text-muted-foreground'}>
                                            {user.isPremiumProfile ? 'Premium' : 'Free'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`h-8 w-8 p-0 rounded-lg ${user.isPremiumProfile ? 'text-primary' : 'text-muted-foreground'}`}
                                            onClick={() => togglePremium(user.id, user.userCategory)}
                                            title={user.isPremiumProfile ? "Remover Premium" : "Tornar Premium"}
                                        >
                                            <Crown className={`w-4 h-4 ${user.isPremiumProfile ? 'fill-primary' : ''}`} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground">
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive/80">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
