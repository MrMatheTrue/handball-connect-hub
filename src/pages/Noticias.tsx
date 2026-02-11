import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Clock, User, ArrowRight, ChevronLeft, ChevronRight, FileText, Plus } from "lucide-react";
import { getArticles, saveArticles, Article } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const ITEMS_PER_PAGE = 6;

const Noticias = () => {
  const { currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newPost, setNewPost] = useState({
    title: "",
    category: "Notícias",
    excerpt: "",
    content: "",
    imageUrl: "",
  });

  const [allArticles, setAllArticles] = useState(getArticles());

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(allArticles.map(a => a.category))];
    return cats;
  }, [allArticles]);

  // Filter articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      // Show approved articles to everyone
      if (article.status === 'approved') {
        const matchesSearch = !searchQuery ||
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory || article.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }

      // Show pending articles ONLY to their authors
      if (article.status === 'pending' && currentUser && article.authorId === currentUser.id) {
        return true; // Author sees their own pending posts
      }

      return false;
    });
  }, [allArticles, searchQuery, selectedCategory, currentUser]);

  // Featured article is always the first one
  const featuredArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const otherArticles = filteredArticles.slice(1);

  // Pagination for other articles
  const totalPages = Math.ceil(otherArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = otherArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const handleCreatePost = () => {
    if (!currentUser) {
      toast.error("Você precisa estar logado para postar uma notícia.");
      return;
    }

    if (!newPost.title || !newPost.content || !newPost.excerpt) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const isHandZone = currentUser.email.toLowerCase() === "admin@handzone.com";

    const article: Article = {
      id: `article-${Date.now()}`,
      title: newPost.title,
      category: newPost.category,
      excerpt: newPost.excerpt,
      content: newPost.content,
      imageUrl: newPost.imageUrl || undefined,
      author: isHandZone ? "Redação HandZone" : currentUser.name,
      authorId: isHandZone ? 'admin' : currentUser.id,
      publishedAt: new Date().toISOString(),
      readTime: "5 min",
      featured: false,
      status: isHandZone ? 'approved' : 'pending',
      authorRole: isHandZone ? 'admin' : 'user',
    };

    const updatedArticles = [article, ...allArticles];
    saveArticles(updatedArticles);
    setAllArticles(updatedArticles); // Update local state to trigger re-render

    setIsModalOpen(false);
    setNewPost({ title: "", category: "Notícias", excerpt: "", content: "", imageUrl: "" });

    if (isHandZone) {
      toast.success("Notícia publicada com sucesso!");
    } else {
      toast.success("Notícia enviada para análise do administrador.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-12">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Notícias
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-4 mb-4">
              Últimas do <span className="gradient-text">Handebol</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Fique por dentro de tudo que acontece no mundo do handebol. Notícias, transferências, entrevistas e análises.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h2 className="text-xl font-bold">Explorar Conteúdo</h2>
            {currentUser && (
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Postar Notícia
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] glass-card border-accent-glow">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Criar Nova Postagem</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Título da Notícia</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Novo reforço no Taubaté"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        className="bg-secondary"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Categoria</Label>
                      <select
                        id="category"
                        className="flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                      >
                        <option value="Notícias">Notícias</option>
                        <option value="Transferências">Transferências</option>
                        <option value="Ligas">Ligas</option>
                        <option value="Seleções">Seleções</option>
                        <option value="Entrevistas">Entrevistas</option>
                        <option value="Análises">Análises</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="excerpt">Resumo (será exibido no card)</Label>
                      <Input
                        id="excerpt"
                        placeholder="Breve descrição da notícia..."
                        value={newPost.excerpt}
                        onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                        className="bg-secondary"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="content">Conteúdo Completo</Label>
                      <Textarea
                        id="content"
                        placeholder="Escreva o artigo completo aqui..."
                        className="min-h-[200px] bg-secondary"
                        value={newPost.content}
                        onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl">URL da Imagem de Capa (opcional)</Label>
                      <Input
                        id="imageUrl"
                        placeholder="https://exemplo.com/imagem.jpg"
                        value={newPost.imageUrl}
                        onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                        className="bg-secondary"
                      />
                      {newPost.imageUrl && (
                        <div className="h-32 rounded-lg overflow-hidden bg-secondary border border-border">
                          <img src={newPost.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button variant="hero" onClick={handleCreatePost}>Publicar Notícia</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Search */}
          <div className="glass-card rounded-2xl p-6 mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Buscar notícias..."
                className="pl-12 h-12 bg-secondary border-border"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => { setSelectedCategory(""); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20"
                  }`}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20"
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              <span className="text-foreground font-semibold">{filteredArticles.length}</span> artigos encontrados
            </p>
          </div>

          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-8">
              <Link to={`/noticia/${featuredArticle.id}`} className="group glass-card rounded-2xl overflow-hidden card-hover block">
                <div className="grid lg:grid-cols-2">
                  <div className="relative h-64 lg:h-auto bg-gradient-to-br from-primary/30 to-orange-light/20 overflow-hidden">
                    {featuredArticle.imageUrl ? (
                      <img src={featuredArticle.imageUrl} alt={featuredArticle.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-display text-8xl text-primary/30">HZ</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex gap-2 items-center mb-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold w-fit">
                        {featuredArticle.category}
                      </span>
                      {featuredArticle.status === 'pending' && (
                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-semibold border border-yellow-500/30">
                          Pendente
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-foreground group-hover:text-primary transition-colors mb-4">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        {featuredArticle.author}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {formatDate(featuredArticle.publishedAt)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {featuredArticle.readTime}
                      </div>
                    </div>
                    <Button variant="hero" className="w-fit group/btn">
                      Ler Artigo
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedArticles.map((article) => (
              <Link
                to={`/noticia/${article.id}`}
                key={article.id}
                className="group glass-card rounded-2xl overflow-hidden card-hover"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary/20 to-orange-light/10 overflow-hidden">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-display text-5xl text-primary/30">HZ</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 rounded-md bg-primary/20 text-primary text-xs font-semibold backdrop-blur-sm">
                      {article.category}
                    </span>
                    {article.status === 'pending' && (
                      <span className="px-2 py-1 rounded-md bg-yellow-500/20 text-yellow-500 text-xs font-semibold backdrop-blur-sm border border-yellow-500/30">
                        Pendente
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(article.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Empty State */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Nenhum artigo encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Tente ajustar sua busca ou selecionar outra categoria.
              </p>
              <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory(""); setCurrentPage(1); }}>
                Limpar filtros
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Noticias;
