import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, User, ChevronLeft, ArrowRight } from "lucide-react";

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticleData = async () => {
      try {
        setLoading(true);
        // Fetch current article
        const { data: articleData, error: articleError } = await supabase
          .from('articles')
          .select('*, profiles:author_id(full_name)')
          .eq('id', id)
          .single();

        if (articleError) throw articleError;

        const formattedArticle = {
          id: articleData.id,
          title: articleData.title,
          content: articleData.content,
          excerpt: articleData.summary || "",
          category: articleData.category || "Notícias",
          author: articleData.profiles?.full_name || "Anônimo",
          authorId: articleData.author_id,
          imageUrl: articleData.image_url,
          publishedAt: articleData.created_at,
          readTime: "5 min",
          featured: false,
          status: articleData.is_published ? 'approved' : 'pending',
          authorRole: 'user',
        };

        setArticle(formattedArticle);

        // Fetch related articles
        const { data: relatedData } = await supabase
          .from('articles')
          .select('*, profiles:author_id(full_name)')
          .eq('category', articleData.category)
          .neq('id', id)
          .eq('is_published', true)
          .limit(3);

        const formattedRelated = (relatedData || []).map(a => ({
          id: a.id,
          title: a.title,
          content: a.content,
          excerpt: a.summary || "",
          category: a.category || "Notícias",
          author: a.profiles?.full_name || "Anônimo",
          imageUrl: a.image_url,
          publishedAt: a.created_at,
          readTime: "5 min",
        }));

        setRelatedArticles(formattedRelated);
      } catch (error: any) {
        console.error("Error fetching article:", error);
        toast.error("Erro ao carregar artigo.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticleData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-48 pb-16">
          <div className="container mx-auto px-4 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Carregando artigo...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold mb-4">Artigo não encontrado</h1>
            <p className="text-muted-foreground mb-8">
              O artigo que você está procurando não existe ou foi removido.
            </p>
            <Link to="/noticias">
              <Button variant="hero">Ver Notícias</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="w-4 h-4" />
            Voltar
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <article className="glass-card rounded-2xl overflow-hidden">
                {/* Featured Image */}
                <div className="relative h-64 sm:h-96 bg-gradient-to-br from-primary/30 to-orange-light/20">
                  {article.imageUrl ? (
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img src="/logo.png" alt="HZ" className="w-32 h-32 object-contain opacity-30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                      {article.category}
                    </span>
                    {article.status === 'pending' && (
                      <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-sm font-semibold border border-yellow-500/30">
                        Análise Pendente
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-10">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-6">
                    {article.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8 pb-6 border-b border-border">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {article.readTime} de leitura
                    </div>
                  </div>

                  <div className="prose prose-lg prose-invert max-w-none">
                    {article.content.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="glass-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Artigos Relacionados</h2>
                  <div className="space-y-4">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.id}
                        to={`/noticia/${relatedArticle.id}`}
                        className="block group"
                      >
                        <div className="flex gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                          <div className="w-20 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-orange-light/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            <img src="/logo.png" alt="HZ" className="w-full h-full object-cover opacity-50" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {relatedArticle.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1">
                              {relatedArticle.readTime}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter CTA */}
              <div className="glass-card rounded-2xl p-6 border-accent-glow">
                <h3 className="font-semibold mb-2">Fique por dentro!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Receba as últimas notícias do handebol diretamente no seu email.
                </p>
                <Button variant="hero" className="w-full">
                  Inscrever-se
                </Button>
              </div>

              {/* Categories */}
              <div className="glass-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold mb-4">Categorias</h2>
                <div className="flex flex-wrap gap-2">
                  {["Seleções", "Ligas", "Transferências", "Entrevistas", "Análises"].map((cat) => (
                    <Link
                      key={cat}
                      to={`/noticias?categoria=${cat}`}
                      className="px-3 py-1.5 rounded-lg text-sm bg-secondary text-muted-foreground hover:text-foreground hover:bg-primary/20 transition-all"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Mais Notícias</h2>
              <Link to="/noticias">
                <Button variant="ghost" className="gap-2 text-primary">
                  Ver todas
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((item) => (
                <Link key={item.id} to={`/noticia/${item.id}`}>
                  <div className="group glass-card rounded-2xl overflow-hidden card-hover">
                    <div className="relative h-48 bg-gradient-to-br from-primary/20 to-orange-light/10">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <img src="/logo.png" alt="HZ" className="w-20 h-20 object-contain opacity-30" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 rounded-md bg-primary/20 text-primary text-xs font-semibold">
                          {item.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-3 line-clamp-2">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.publishedAt).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.readTime}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArticleDetail;
