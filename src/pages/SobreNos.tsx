import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Target, Heart, Globe } from "lucide-react";

const SobreNos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Sobre o <span className="gradient-text">HandZone</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça a história e a missão por trás da plataforma que está transformando o handebol.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Nossa História</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O HandZone foi fundado em 2024, nascendo da necessidade real de conectar a comunidade do handebol. Identificamos que muitos atletas talentosos, técnicos qualificados e clubes em busca de reforços tinham dificuldade de se encontrar em um único lugar.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nossa plataforma foi desenvolvida para ser o ecossistema definitivo do handebol, facilitando contratações, networking e a visibilidade do esporte. Hoje, conectamos profissionais de diversos países, promovendo o crescimento da modalidade através da tecnologia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Missão</h3>
              <p className="text-muted-foreground text-sm">
                Conectar talentos do handebol com oportunidades profissionais em todo o mundo.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Valores</h3>
              <p className="text-muted-foreground text-sm">
                Transparência, inclusão, inovação e paixão pelo esporte.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">Visão</h3>
              <p className="text-muted-foreground text-sm">
                Ser a principal plataforma global de networking para o handebol profissional.
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-muted-foreground leading-relaxed">
              Quer saber mais sobre o HandZone ou tem alguma sugestão? Estamos sempre abertos a ouvir a comunidade do handebol.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-muted-foreground">📧 <a href="mailto:handzone.contato@gmail.com" className="text-primary hover:underline">handzone.contato@gmail.com</a></p>
              <p className="text-muted-foreground">📱 <a href="https://wa.me/5512992232791" className="text-primary hover:underline">(12) 99223-2791</a></p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SobreNos;
