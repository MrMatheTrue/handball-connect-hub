import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    Search,
    Filter,
    Crown,
    Shield,
    User as UserIcon,
    Edit,
    Trash2,
    Loader2,
    X,
    Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UserProfile {
    id: string;
    full_name: string;
    email: string | null;
    user_type: string;
    is_premium: boolean;
    avatar_url: string | null;
    phone: string | null;
    created_at: string | null;
}

const UserManagement = () => {
    const { toast } = useToast();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [deletingUser, setDeletingUser] = useState<UserProfile | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            toast({ title: 'Erro', description: 'Falha ao carregar usuários.', variant: 'destructive' });
        } else {
            setUsers(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();

        // Realtime subscription
        const channel = supabase
            .channel('profiles-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
                fetchUsers();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filteredUsers = users.filter(user =>
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const togglePremium = async (user: UserProfile) => {
        const newStatus = !user.is_premium;
        const { error } = await supabase
            .from('profiles')
            .update({ is_premium: newStatus })
            .eq('id', user.id);

        if (error) {
            toast({ title: 'Erro', description: 'Falha ao atualizar status premium.', variant: 'destructive' });
        } else {
            setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_premium: newStatus } : u));
            toast({ title: 'Status atualizado', description: `${user.full_name} agora é ${newStatus ? 'Premium' : 'Free'}.` });
        }
    };

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        setSaving(true);

        const { error } = await supabase
            .from('profiles')
            .update({
                full_name: editingUser.full_name,
                email: editingUser.email,
                phone: editingUser.phone,
                user_type: editingUser.user_type as any,
                is_premium: editingUser.is_premium,
            })
            .eq('id', editingUser.id);

        if (error) {
            toast({ title: 'Erro', description: 'Falha ao salvar alterações.', variant: 'destructive' });
        } else {
            setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
            toast({ title: 'Usuário atualizado', description: `Dados de ${editingUser.full_name} foram salvos.` });
            setEditingUser(null);
        }
        setSaving(false);
    };

    const handleDeleteUser = async () => {
        if (!deletingUser) return;
        setSaving(true);

        // Delete related profiles first, then the main profile
        const userType = deletingUser.user_type;
        if (userType === 'player') {
            await supabase.from('player_profiles').delete().eq('user_id', deletingUser.id);
        } else if (userType === 'coach') {
            await supabase.from('coach_profiles').delete().eq('user_id', deletingUser.id);
        } else if (userType === 'club') {
            await supabase.from('club_profiles').delete().eq('user_id', deletingUser.id);
        } else if (userType === 'agent') {
            await supabase.from('agent_profiles').delete().eq('user_id', deletingUser.id);
        }

        // Delete user roles
        await supabase.from('user_roles').delete().eq('user_id', deletingUser.id);

        // Delete profile
        const { error } = await supabase.from('profiles').delete().eq('id', deletingUser.id);

        if (error) {
            toast({ title: 'Erro', description: 'Falha ao excluir usuário. ' + error.message, variant: 'destructive' });
        } else {
            setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
            toast({ title: 'Usuário excluído', description: `${deletingUser.full_name} foi removido da plataforma.` });
        }
        setDeletingUser(null);
        setSaving(false);
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'player': return 'Atleta';
            case 'club': return 'Clube';
            case 'coach': return 'Técnico';
            case 'agent': return 'Agente';
            default: return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'player': return 'bg-blue-500/10 text-blue-500';
            case 'club': return 'bg-primary/10 text-primary';
            case 'coach': return 'bg-green-500/10 text-green-500';
            case 'agent': return 'bg-purple-500/10 text-purple-500';
            default: return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <>
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl border-accent-glow">
                <div className="p-6 border-b border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h3 className="text-xl font-bold">Base de Usuários ({users.length})</h3>
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
                            <Button variant="outline" size="icon" className="rounded-xl" onClick={fetchUsers}>
                                <Filter className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-secondary/20 text-muted-foreground text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-semibold">Usuário</th>
                                    <th className="px-6 py-4 font-semibold">Tipo</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-secondary/10 transition-colors group">
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border">
                                                    {user.avatar_url ? (
                                                        <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <UserIcon className="w-5 h-5 text-muted-foreground" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground flex items-center gap-1">
                                                        {user.full_name}
                                                        {user.is_premium && <Crown className="w-3 h-3 text-primary fill-primary" />}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold ${getTypeColor(user.user_type)}`}>
                                                {getTypeLabel(user.user_type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${user.is_premium ? 'bg-primary shadow-[0_0_8px_rgba(255,107,53,0.5)]' : 'bg-muted-foreground/30'}`} />
                                                <span className={user.is_premium ? 'text-primary font-medium' : 'text-muted-foreground'}>
                                                    {user.is_premium ? 'Premium' : 'Free'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`h-8 w-8 p-0 rounded-lg ${user.is_premium ? 'text-primary' : 'text-muted-foreground'}`}
                                                    onClick={() => togglePremium(user)}
                                                    title={user.is_premium ? "Remover Premium" : "Tornar Premium"}
                                                >
                                                    <Crown className={`w-4 h-4 ${user.is_premium ? 'fill-primary' : ''}`} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
                                                    onClick={() => setEditingUser({ ...user })}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-lg text-destructive hover:text-destructive/80"
                                                    onClick={() => setDeletingUser(user)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                <DialogContent className="sm:max-w-md glass-card border-accent-glow">
                    <DialogHeader>
                        <DialogTitle>Editar Usuário</DialogTitle>
                    </DialogHeader>
                    {editingUser && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <Input
                                    value={editingUser.full_name}
                                    onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                                    className="bg-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input
                                    value={editingUser.email || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    className="bg-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Telefone</Label>
                                <Input
                                    value={editingUser.phone || ''}
                                    onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                                    className="bg-secondary"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Tipo de Usuário</Label>
                                <Select
                                    value={editingUser.user_type}
                                    onValueChange={(v) => setEditingUser({ ...editingUser, user_type: v })}
                                >
                                    <SelectTrigger className="bg-secondary">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="player">Atleta</SelectItem>
                                        <SelectItem value="club">Clube</SelectItem>
                                        <SelectItem value="coach">Técnico</SelectItem>
                                        <SelectItem value="agent">Agente</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label>Status Premium</Label>
                                <Button
                                    variant={editingUser.is_premium ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setEditingUser({ ...editingUser, is_premium: !editingUser.is_premium })}
                                >
                                    <Crown className={`w-4 h-4 mr-1 ${editingUser.is_premium ? 'fill-primary-foreground' : ''}`} />
                                    {editingUser.is_premium ? 'Premium' : 'Free'}
                                </Button>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingUser(null)}>Cancelar</Button>
                        <Button variant="hero" onClick={handleSaveEdit} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Save className="w-4 h-4 mr-1" />}
                            Salvar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingUser} onOpenChange={(open) => !open && setDeletingUser(null)}>
                <AlertDialogContent className="glass-card border-accent-glow">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Usuário</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir <strong>{deletingUser?.full_name}</strong>? 
                            Esta ação é irreversível e removerá todos os dados associados.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Trash2 className="w-4 h-4 mr-1" />}
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default UserManagement;
