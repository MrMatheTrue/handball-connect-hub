import React, { useState, useEffect } from 'react';
import {
    getArticles,
    saveArticles,
    updateArticleStatus
} from "@/data/mockData";
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    MessageSquare,
    Filter,
    Search,
    ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ArticleModeration = () => {
    const { toast } = useToast();
    const [articles, setArticles] = useState(getArticles());
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');

    const filteredArticles = articles.filter(article => {
        if (filter === 'all') return true;
        return article.status === filter;
    });

    const handleStatusChange = (id: string, newStatus: 'approved' | 'pending') => {
        updateArticleStatus(id, newStatus);
        setArticles(getArticles());

        toast({
            title: newStatus === 'approved' ? "Notícia Aprovada" : "Notícia Pendente",
            description: `O status da notícia foi atualizado com sucesso.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Pendentes
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'approved' ? 'bg-green-500/10 text-green-500' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Aprovados
                    </button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                    <div key={article.id} className="glass-card rounded-2xl p-6 border-accent-glow hover:bg-secondary/10 transition-colors">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Thumbnail */}
                            <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden bg-secondary flex-shrink-0 border border-border">
                                {article.imageUrl ? (
                                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                        <Eye className="w-8 h-8 opacity-20" />
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <div>
                                        <h4 className="text-lg font-bold text-foreground line-clamp-1">{article.title}</h4>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                            <span>Por <strong>{article.author}</strong></span>
                                            <span>•</span>
                                            <span>{article.publishedAt}</span>
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold flex items-center gap-1 ${article.status === 'approved' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {article.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                        {article.status === 'approved' ? 'Aprovado' : 'Pendente'}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground line-clamp-2 italic mb-4">
                                    "{article.excerpt}"
                                </p>

                                <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-4">
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary/50 rounded-md">{article.category}</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" className="h-9 px-3 text-xs gap-1.5 rounded-xl">
                                            <Eye className="w-3.5 h-3.5" />
                                            Visualizar
                                        </Button>
                                        {article.status === 'pending' ? (
                                            <Button
                                                onClick={() => handleStatusChange(article.id, 'approved')}
                                                className="h-9 px-4 text-xs gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg glow-green"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" />
                                                Aprovar
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outline"
                                                onClick={() => handleStatusChange(article.id, 'pending')}
                                                className="h-9 px-4 text-xs gap-1.5 rounded-xl text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10"
                                            >
                                                <Clock className="w-3.5 h-3.5" />
                                                Tornar Pendente
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-destructive hover:text-destructive/80 rounded-xl">
                                            <XCircle className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 glass-card rounded-2xl border-dashed">
                        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground">Nenhuma notícia encontrada com este filtro.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArticleModeration;
