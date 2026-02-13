import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const TermosDeUso = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Termos de Uso</h1>
          <div className="glass-card rounded-2xl p-8 space-y-6 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">1. Aceitação dos Termos</h2>
              <p>Ao acessar e usar a plataforma HandZone, você concorda em cumprir e ficar vinculado a estes Termos de Uso. Se você não concordar com alguma parte destes termos, não poderá usar nossos serviços.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">2. Descrição do Serviço</h2>
              <p>O HandZone é uma plataforma digital que conecta jogadores, clubes, técnicos e agentes de handebol, permitindo a criação de perfis profissionais, publicação de oportunidades e comunicação entre os usuários.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">3. Cadastro e Conta</h2>
              <p>Para utilizar a plataforma, o usuário deve criar uma conta fornecendo informações verídicas e atualizadas. O usuário é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">4. Uso Aceitável</h2>
              <p>O usuário se compromete a não: (a) publicar conteúdo falso, difamatório ou ilegal; (b) violar direitos de propriedade intelectual; (c) usar a plataforma para fins comerciais não autorizados; (d) tentar acessar contas de outros usuários; (e) enviar spam ou comunicações não solicitadas.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">5. Conteúdo do Usuário</h2>
              <p>O usuário mantém os direitos sobre o conteúdo que publica, mas concede ao HandZone uma licença não exclusiva para exibir, distribuir e promover tal conteúdo dentro da plataforma.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">6. Planos e Pagamentos</h2>
              <p>O HandZone oferece planos gratuitos e Premium. As assinaturas Premium são cobradas conforme o plano escolhido e podem ser canceladas a qualquer momento. Não há reembolso para períodos parciais.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">7. Limitação de Responsabilidade</h2>
              <p>O HandZone não se responsabiliza por acordos, contratos ou transações realizadas entre usuários fora da plataforma. A plataforma é um meio de conexão e não garante resultados específicos.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">8. Modificações</h2>
              <p>O HandZone se reserva o direito de modificar estes termos a qualquer momento. As alterações serão comunicadas aos usuários e entrarão em vigor imediatamente após a publicação.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold text-foreground mb-3">9. Contato</h2>
              <p>Para dúvidas sobre estes termos, entre em contato: <a href="mailto:handzone.contato@gmail.com" className="text-primary hover:underline">handzone.contato@gmail.com</a></p>
            </section>
            <p className="text-sm">Última atualização: Fevereiro de 2026</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermosDeUso;
