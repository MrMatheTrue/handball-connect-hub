import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Users, Search, MessageSquare, Trophy, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "1. Crie seu Perfil",
    description: "Cadastre-se gratuitamente como Jogador, Clube, Técnico ou Agente. Preencha suas informações, adicione fotos e vídeos para se destacar."
  },
  {
    icon: Search,
    title: "2. Explore a Plataforma",
    description: "Navegue pelos perfis de jogadores, clubes, técnicos e agentes. Use os filtros para encontrar exatamente o que procura."
  },
  {
    icon: MessageSquare,
    title: "3. Conecte-se",
    description: "Com o plano Premium, envie mensagens diretas, acesse dados de contato e candidate-se a oportunidades exclusivas."
  },
  {
    icon: Trophy,
    title: "4. Alcance seus Objetivos",
    description: "Seja encontrado por clubes, feche contratos, encontre talentos ou expanda sua rede no mundo do handebol."
  },
];

const ComoFunciona = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Como Funciona o <span className="gradient-text">HandZone</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              O HandZone é a plataforma que conecta talentos do handebol com oportunidades únicas. Veja como é simples começar.
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="glass-card rounded-2xl p-8 flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <step.icon className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center glass-card rounded-2xl p-10 border-accent-glow">
            <h2 className="text-2xl font-bold mb-4">Pronto para começar?</h2>
            <p className="text-muted-foreground mb-6">
              Junte-se a milhares de profissionais do handebol que já estão usando o HandZone para impulsionar suas carreiras.
            </p>
            <a href="/cadastro" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity">
              Criar Conta Gratuita <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ComoFunciona;
