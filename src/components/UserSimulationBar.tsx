import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Crown, User, Building2, Users, LogOut, LogIn } from 'lucide-react';

const UserSimulationBar = () => {
  const { currentUser, isPremium, userType, isLoggedIn, togglePremium, setUserType, logout, login } = useUser();

  const handleLogin = () => {
    login({
      name: 'João Silva',
      email: 'joao@handzone.com',
      type: 'player',
      isPremium: false,
      profileId: 'player-1',
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 glass-card rounded-2xl p-4 border-accent-glow max-w-sm">
      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <span className="text-xs font-bold text-primary">DEV</span>
        </div>
        <span className="text-xs text-muted-foreground font-medium">Simulação de Usuário</span>
      </div>

      {isLoggedIn ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-orange-light/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">
                {currentUser?.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Status Premium</span>
              <Button
                variant={isPremium ? "hero" : "glass"}
                size="sm"
                onClick={togglePremium}
                className="h-7 text-xs gap-1"
              >
                <Crown className="w-3 h-3" />
                {isPremium ? 'Premium' : 'Gratuito'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tipo de Perfil</span>
              <div className="flex gap-1">
                <Button
                  variant={userType === 'player' ? 'hero' : 'ghost'}
                  size="sm"
                  onClick={() => setUserType('player')}
                  className="h-7 w-7 p-0"
                  title="Jogador"
                >
                  <User className="w-3 h-3" />
                </Button>
                <Button
                  variant={userType === 'club' ? 'hero' : 'ghost'}
                  size="sm"
                  onClick={() => setUserType('club')}
                  className="h-7 w-7 p-0"
                  title="Clube"
                >
                  <Building2 className="w-3 h-3" />
                </Button>
                <Button
                  variant={userType === 'agent' ? 'hero' : 'ghost'}
                  size="sm"
                  onClick={() => setUserType('agent')}
                  className="h-7 w-7 p-0"
                  title="Agente"
                >
                  <Users className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full h-7 text-xs gap-1 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-3 h-3" />
              Sair
            </Button>
          </div>
        </>
      ) : (
        <Button
          variant="hero"
          size="sm"
          onClick={handleLogin}
          className="w-full h-8 text-xs gap-1"
        >
          <LogIn className="w-3 h-3" />
          Simular Login
        </Button>
      )}
    </div>
  );
};

export default UserSimulationBar;
