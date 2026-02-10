import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/contexts/UserContext";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(email, password);

    if (result.error) {
      toast({
        title: "Erro ao entrar",
        description: result.error,
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      toast({
        title: "Login realizado!",
        description: "Bem-vindo de volta ao HandZone.",
      });
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center shadow-lg glow-orange">
                  <span className="font-display text-2xl text-primary-foreground">HZ</span>
                </div>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                {t("auth.welcome")}
              </h1>
              <p className="text-muted-foreground">
                {t("auth.loginSubtitle")}
              </p>
            </div>

            {/* Login Form */}
            <div className="glass-card rounded-2xl p-8 border-accent-glow">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("auth.email")}</Label>
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

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">{t("auth.password")}</Label>
                    <Link
                      to="/recuperar-senha"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      {t("auth.forgotPassword")}
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="pl-12 pr-12 h-12 bg-secondary border-border"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                  {isLoading ? "Entrando..." : t("auth.login")}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-muted-foreground text-sm">
                  {t("auth.noAccount")}{" "}
                  <Link
                    to="/cadastro"
                    className="text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    {t("nav.register")}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Login;
