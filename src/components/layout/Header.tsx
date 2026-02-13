import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, User, Briefcase, Building2, Users, Shield, Globe, LogOut } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { isAdmin, isLoggedIn, currentUser, logout } = useUser();

  const languages = [
    { code: "pt-BR", label: "Português", flag: "🇧🇷" },
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { href: "/jogadores", label: t("nav.players"), icon: User },
    { href: "/tecnicos", label: t("nav.coaches"), icon: Users },
    { href: "/clubes", label: t("nav.clubs"), icon: Building2 },
    { href: "/agentes", label: t("nav.agents"), icon: Users },
    { href: "/oportunidades", label: t("nav.opportunities"), icon: Briefcase },
    { href: "/noticias", label: t("nav.news") },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg glow-orange group-hover:scale-110 transition-transform overflow-hidden">
              <img src="/logo.png" alt="HZ" className="w-full h-full object-cover" />
            </div>
            <span className="font-display text-2xl tracking-wider gradient-text hidden sm:block">
              HANDZONE
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 ${isActive("/admin")
                  ? "text-primary bg-primary/10"
                  : "text-primary hover:bg-primary/10"
                  }`}
              >
                <Shield className="w-4 h-4" />
                {t("nav.admin")}
              </Link>
            )}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                  <Globe className="w-4 h-4" />
                  <span>{currentLanguage.code.split('-')[0].toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Search className="w-5 h-5" />
            </Button>

            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="glass" size="sm" className="gap-2">
                    <User className="w-4 h-4" />
                    {currentUser?.name?.split(' ')[0] || 'Dashboard'}
                  </Button>
                </Link>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-foreground">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="glass" size="sm">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button variant="hero" size="sm">
                    {t("nav.register")}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
                  <Globe className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass border-white/10">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => changeLanguage(lang.code)}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden glass border-t border-white/5 animate-fade-in">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.href)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
              >
                {link.icon && <link.icon className="w-5 h-5" />}
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${isActive("/admin")
                  ? "text-primary bg-primary/10"
                  : "text-primary hover:bg-primary/10"
                  }`}
              >
                <Shield className="w-5 h-5" />
                {t("nav.admin")}
              </Link>
            )}
            <div className="flex gap-2 pt-4 mt-2 border-t border-border">
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" className="flex-1" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="glass" className="w-full">
                      Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" className="flex-shrink-0" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex-1">
                    <Button variant="glass" className="w-full">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link to="/cadastro" className="flex-1">
                    <Button variant="hero" className="w-full">
                      {t("nav.register")}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
