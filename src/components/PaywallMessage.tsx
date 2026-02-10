import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Lock, Crown, MessageSquare, Briefcase, FileText, Play } from 'lucide-react';

type PaywallType = 'message' | 'apply' | 'publish' | 'video' | 'custom';

interface PaywallMessageProps {
  type?: PaywallType;
  title?: string;
  message?: string;
  buttonText?: string;
  compact?: boolean;
}

const PAYWALL_CONFIGS = {
  message: {
    title: 'Assine para enviar mensagens',
    message: 'Usuários premium podem entrar em contato diretamente.',
    buttonText: 'Ver Planos Premium',
    icon: MessageSquare,
    actionLabel: 'Enviar Mensagem',
  },
  apply: {
    title: 'Assine para se candidatar',
    message: 'Tenha acesso ilimitado às melhores oportunidades.',
    buttonText: 'Ver Planos Premium',
    icon: Briefcase,
    actionLabel: 'Candidatar-se',
  },
  publish: {
    title: 'Assine para publicar vagas',
    message: 'Clubes e agentes premium podem publicar oportunidades.',
    buttonText: 'Ver Planos Premium',
    icon: FileText,
    actionLabel: 'Publicar',
  },
  video: {
    title: 'Assine para ver vídeos',
    message: 'Vídeos de lances e metodologia estão disponíveis para usuários premium.',
    buttonText: 'Ver Planos Premium',
    icon: Play,
    actionLabel: 'Ver Vídeo',
  },
  custom: {
    title: 'Recurso Premium',
    message: 'Este recurso está disponível apenas para assinantes.',
    buttonText: 'Ver Planos Premium',
    icon: Lock,
    actionLabel: 'Acessar',
  },
};

const PaywallMessage = ({
  type = 'custom',
  title,
  message,
  buttonText,
  compact = false,
}: PaywallMessageProps) => {
  const config = PAYWALL_CONFIGS[type];
  const Icon = config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;
  const displayButtonText = buttonText || config.buttonText;

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 border border-primary/20">
        <Lock className="w-4 h-4 text-primary flex-shrink-0" />
        <span className="text-xs text-muted-foreground">{displayMessage}</span>
        <Link to="/premium" className="ml-auto">
          <Button variant="hero" size="sm" className="h-6 text-xs px-2 gap-1">
            <Crown className="w-3 h-3" />
            Assinar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 border-accent-glow text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-light/20 flex items-center justify-center">
        <Icon className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{displayTitle}</h3>
      <p className="text-muted-foreground text-sm mb-4">{displayMessage}</p>
      <Link to="/premium">
        <Button variant="hero" className="gap-2">
          <Crown className="w-4 h-4" />
          {buttonText}
        </Button>
      </Link>
    </div>
  );
};

export default PaywallMessage;
