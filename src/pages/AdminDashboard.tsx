import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useUser } from "@/contexts/UserContext";
import { Navigate } from "react-router-dom";
import {
    Users,
    FileText,
    MessageSquare,
    Shield,
    Settings,
    Search,
    LayoutDashboard,
    Handshake
} from "lucide-react";
import UserManagement from "@/components/admin/UserManagement";
import ArticleModeration from "@/components/admin/ArticleModeration";
import GlobalMessages from "@/components/admin/GlobalMessages";
import AdminStats from "@/components/admin/AdminStats";
import AdminSettings from "@/components/admin/AdminSettings";
import PartnershipManagement from "@/components/admin/PartnershipManagement";

const AdminDashboard = () => {
    const { isAdmin } = useUser();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'articles' | 'partnerships' | 'messages' | 'settings'>('overview');

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    const menuItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
        { id: 'users', label: 'Gerenciar Usuários', icon: Users },
        { id: 'articles', label: 'Moderação de Notícias', icon: FileText },
        { id: 'partnerships', label: 'Parcerias', icon: Handshake },
        { id: 'messages', label: 'Monitor de Conversas', icon: MessageSquare },
        { id: 'settings', label: 'Configurações', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-64 flex-shrink-0">
                        <div className="glass-card rounded-2xl p-4 sticky top-24">
                            <div className="flex items-center gap-2 px-4 py-3 mb-6">
                                <Shield className="w-6 h-6 text-primary" />
                                <h1 className="font-bold text-lg">Master Admin</h1>
                            </div>
                            <nav className="space-y-1">
                                {menuItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id as any)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                            ? 'bg-primary text-primary-foreground shadow-lg glow-orange'
                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                            }`}
                                    >
                                        <item.icon className="w-4 h-4" />
                                        {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    <div className="flex-1 min-w-0">
                        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight">
                                    {menuItems.find(i => i.id === activeTab)?.label}
                                </h2>
                                <p className="text-muted-foreground mt-1 text-lg">
                                    Painel de controle macro da plataforma HandZone.
                                </p>
                            </div>
                            <div className="relative group max-w-xs w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Pesquisar..."
                                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
                                />
                            </div>
                        </div>

                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeTab === 'overview' && <AdminStats />}
                            {activeTab === 'users' && <UserManagement />}
                            {activeTab === 'articles' && <ArticleModeration />}
                            {activeTab === 'partnerships' && <PartnershipManagement />}
                            {activeTab === 'messages' && <GlobalMessages />}
                            {activeTab === 'settings' && <AdminSettings />}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default AdminDashboard;
