import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const RecuperarSenha = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setSent(true);
      toast({ title: "Email enviado!", description: "Verifique sua caixa de entrada para redefinir a senha." });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg glow-orange overflow-hidden">
                  <img src="/logo.png" alt="HZ" className="w-full h-full object-cover" />
                </div>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Recuperar Senha</h1>
              <p className="text-muted-foreground">
                Informe seu email para receber um link de redefinição de senha.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 border-accent-glow">
              {sent ? (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                  <h2 className="text-xl font-semibold">Email enviado!</h2>
                  <p className="text-muted-foreground text-sm">
                    Enviamos um link de redefinição para <strong>{email}</strong>.
                    Verifique sua caixa de entrada e spam.
                  </p>
                  <Link to="/login">
                    <Button variant="ghost" className="gap-2 mt-4">
                      <ArrowLeft className="w-4 h-4" />
                      Voltar ao Login
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-12 h-12 bg-secondary border-border"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                    {isLoading ? "Enviando..." : "Enviar Link de Recuperação"}
                  </Button>

                  <div className="text-center">
                    <Link to="/login" className="text-sm text-primary hover:text-primary/80 flex items-center justify-center gap-1">
                      <ArrowLeft className="w-4 h-4" />
                      Voltar ao Login
                    </Link>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecuperarSenha;
