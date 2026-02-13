import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Privacidade = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Política de Privacidade</h1>
          <div className="glass-card rounded-2xl p-8 space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Coleta de Dados</h2>
              <p>Coletamos informações pessoais que você nos fornece diretamente ao se cadastrar, como nome, email, telefone, data de nascimento, localização e informações profissionais relacionadas ao handebol. Também coletamos dados de uso da plataforma automaticamente.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Uso dos Dados</h2>
              <p>Utilizamos seus dados para: (a) fornecer e manter nossos serviços; (b) personalizar sua experiência; (c) permitir a conexão entre usuários; (d) processar pagamentos; (e) enviar comunicações importantes sobre a plataforma.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Compartilhamento</h2>
              <p>Seus dados de perfil público são visíveis para outros usuários conforme as regras de acesso (Free/Premium). Dados sensíveis como email e telefone só são acessíveis a usuários Premium autorizados, conforme as regras de privacidade da plataforma. Não vendemos seus dados para terceiros.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Proteção de Dados</h2>
              <p>Empregamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda ou destruição. Utilizamos criptografia e servidores seguros para armazenar suas informações.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Seus Direitos (LGPD)</h2>
              <p>Conforme a Lei Geral de Proteção de Dados (LGPD), você tem direito a: (a) acessar seus dados; (b) corrigir dados incompletos ou desatualizados; (c) solicitar a exclusão de seus dados; (d) revogar o consentimento; (e) solicitar a portabilidade dos dados.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Cookies</h2>
              <p>Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para entender como os usuários interagem com nossos serviços. Você pode gerenciar suas preferências de cookies nas configurações do seu navegador.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Retenção de Dados</h2>
              <p>Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão da conta, seus dados serão removidos em até 30 dias, exceto quando a retenção for necessária por obrigação legal.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Contato do DPO</h2>
              <p>Para exercer seus direitos ou esclarecer dúvidas sobre privacidade: <a href="mailto:handzone.contato@gmail.com" className="text-primary hover:underline">handzone.contato@gmail.com</a></p>
            </section>
            <p className="text-sm">Última atualização: Fevereiro de 2026</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacidade;
