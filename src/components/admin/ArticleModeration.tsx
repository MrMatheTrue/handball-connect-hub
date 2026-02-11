import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Trash2,
    Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

interface Article {
    id: string;
    title: string;
    content: string;
    summary: string | null;
    category: string | null;
    image_url: string | null;
    is_published: boolean | null;
    created_at: string | null;
    author_id: string | null;
    author_name?: string;
}

const ArticleModeration = () => {
    const { toast } = useToast();
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'published' | 'unpublished'>('all');
    const [deletingArticle, setDeletingArticle] = useState<Article | null>(null);
    const [saving, setSaving] = useState(false);

    const fetchArticles = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('articles')
            .select('*, profiles:author_id(full_name)')
            .order('created_at', { ascending: false });

        if (error) {
            toast({ title: 'Erro', description: 'Falha ao carregar notícias.', variant: 'destructive' });
        } else {
            setArticles((data || []).map((a: any) => ({
                ...a,
                author_name: a.profiles?.full_name || 'Desconhecido',
            })));
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchArticles();

        const channel = supabase
            .channel('articles-changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'articles' }, () => {
                fetchArticles();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const filteredArticles = articles.filter(article => {
        if (filter === 'all') return true;
        if (filter === 'published') return article.is_published;
        return !article.is_published;
    });

    const togglePublish = async (article: Article) => {
        const newStatus = !article.is_published;
        const { error } = await supabase
            .from('articles')
            .update({ is_published: newStatus })
            .eq('id', article.id);

        if (error) {
            toast({ title: 'Erro', description: 'Falha ao atualizar status.', variant: 'destructive' });
        } else {
            setArticles(prev => prev.map(a => a.id === article.id ? { ...a, is_published: newStatus } : a));
            toast({
                title: newStatus ? 'Notícia Aprovada' : 'Notícia Despublicada',
                description: `O status da notícia foi atualizado com sucesso.`,
            });
        }
    };

    const handleDeleteArticle = async () => {
        if (!deletingArticle) return;
        setSaving(true);

        const { error } = await supabase
            .from('articles')
            .delete()
            .eq('id', deletingArticle.id);

        if (error) {
            toast({ title: 'Erro', description: 'Falha ao excluir notícia.', variant: 'destructive' });
        } else {
            setArticles(prev => prev.filter(a => a.id !== deletingArticle.id));
            toast({ title: 'Notícia excluída', description: 'A notícia foi removida com sucesso.' });
        }
        setDeletingArticle(null);
        setSaving(false);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 bg-secondary/30 p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'all' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Todos ({articles.length})
                        </button>
                        <button
                            onClick={() => setFilter('unpublished')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'unpublished' ? 'bg-yellow-500/10 text-yellow-500' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Pendentes ({articles.filter(a => !a.is_published).length})
                        </button>
                        <button
                            onClick={() => setFilter('published')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === 'published' ? 'bg-green-500/10 text-green-500' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Publicados ({articles.filter(a => a.is_published).length})
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center p-12">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredArticles.length > 0 ? filteredArticles.map((article) => (
                            <div key={article.id} className="glass-card rounded-2xl p-6 border-accent-glow hover:bg-secondary/10 transition-colors">
                                <div className="flex flex-col lg:flex-row gap-6">
                                    <div className="w-full lg:w-48 h-32 rounded-xl overflow-hidden bg-secondary flex-shrink-0 border border-border">
                                        {article.image_url ? (
                                            <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                <Eye className="w-8 h-8 opacity-20" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4 mb-2">
                                            <div>
                                                <h4 className="text-lg font-bold text-foreground line-clamp-1">{article.title}</h4>
                                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                                                    <span>Por <strong>{article.author_name}</strong></span>
                                                    <span>•</span>
                                                    <span>{formatDate(article.created_at)}</span>
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold flex items-center gap-1 ${article.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                {article.is_published ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                {article.is_published ? 'Publicado' : 'Pendente'}
                                            </span>
                                        </div>

                                        <p className="text-sm text-muted-foreground line-clamp-2 italic mb-4">
                                            "{article.summary || article.content.substring(0, 120)}"
                                        </p>

                                        <div className="flex items-center justify-between gap-4 border-t border-border/50 pt-4">
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                {article.category && (
                                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-secondary/50 rounded-md">{article.category}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {!article.is_published ? (
                                                    <Button
                                                        onClick={() => togglePublish(article)}
                                                        className="h-9 px-4 text-xs gap-1.5 rounded-xl bg-green-500 hover:bg-green-600 text-white shadow-lg"
                                                    >
                                                        <CheckCircle className="w-3.5 h-3.5" />
                                                        Aprovar
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => togglePublish(article)}
                                                        className="h-9 px-4 text-xs gap-1.5 rounded-xl text-yellow-500 border-yellow-500/50 hover:bg-yellow-500/10"
                                                    >
                                                        <Clock className="w-3.5 h-3.5" />
                                                        Despublicar
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 w-9 p-0 text-destructive hover:text-destructive/80 rounded-xl"
                                                    onClick={() => setDeletingArticle(article)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
                )}
            </div>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deletingArticle} onOpenChange={(open) => !open && setDeletingArticle(null)}>
                <AlertDialogContent className="glass-card border-accent-glow">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir Notícia</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir "<strong>{deletingArticle?.title}</strong>"? 
                            Esta ação é irreversível.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteArticle}
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

export default ArticleModeration;
