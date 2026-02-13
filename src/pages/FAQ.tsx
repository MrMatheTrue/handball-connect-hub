import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "O que é o HandZone?",
    answer: "O HandZone é uma plataforma digital que conecta jogadores, clubes, técnicos e agentes do handebol. Nosso objetivo é facilitar o networking, a descoberta de talentos e a busca por oportunidades profissionais no mundo do handebol."
  },
  {
    question: "Como posso me cadastrar?",
    answer: "Basta clicar em 'Cadastrar' no canto superior direito, escolher seu tipo de perfil (Jogador, Clube, Técnico ou Agente), preencher seus dados e criar sua conta. Você também pode se cadastrar usando sua conta Google para maior praticidade."
  },
  {
    question: "O cadastro é gratuito?",
    answer: "Sim! O cadastro básico é totalmente gratuito. Com o plano gratuito, você pode criar seu perfil, navegar pela plataforma e ser encontrado por outros usuários. O plano Premium oferece recursos adicionais como mensagens diretas e acesso a dados de contato."
  },
  {
    question: "Qual a diferença entre o plano Free e Premium?",
    answer: "No plano Free você pode criar perfil, visualizar informações públicas e ser encontrado. No plano Premium, você tem acesso a dados de contato (emails, telefones), pode enviar mensagens diretas, visualizar vídeos completos e se candidatar a oportunidades exclusivas."
  },
  {
    question: "Como funciona para Jogadores?",
    answer: "Jogadores podem criar um perfil completo com informações físicas, posição, experiência, vídeos e fotos. Clubes e agentes Premium podem encontrá-los e entrar em contato diretamente. Jogadores Premium podem visualizar dados de clubes e técnicos."
  },
  {
    question: "Como funciona para Clubes?",
    answer: "Clubes podem criar seu perfil institucional, publicar oportunidades/vagas, buscar jogadores e técnicos, e gerenciar candidaturas. Com o plano Premium, têm acesso completo aos dados dos atletas cadastrados."
  },
  {
    question: "Como funciona para Técnicos?",
    answer: "Técnicos podem criar perfil destacando experiência, licenças e especializações. Podem buscar clubes, sinalizar disponibilidade no mercado e se candidatar a vagas destinadas a cargos técnicos."
  },
  {
    question: "Como funciona para Agentes?",
    answer: "Agentes podem cadastrar sua agência, listar países de atuação, publicar oportunidades para atletas e conectar-se diretamente com jogadores e clubes através da plataforma."
  },
  {
    question: "Posso cancelar minha assinatura Premium?",
    answer: "Sim, você pode cancelar sua assinatura a qualquer momento. O acesso Premium continua ativo até o final do período já pago."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim! Seguimos as diretrizes da LGPD (Lei Geral de Proteção de Dados). Seus dados são armazenados de forma segura, e você tem total controle sobre suas informações, podendo exportá-las ou excluí-las a qualquer momento."
  },
  {
    question: "Como entro em contato com o suporte?",
    answer: "Você pode nos contatar pelo email handzone.contato@gmail.com ou pelo WhatsApp (12) 99223-2791. Nossa equipe responde em até 24 horas úteis."
  },
  {
    question: "A plataforma está disponível em quais idiomas?",
    answer: "Atualmente, o HandZone está disponível em Português (Brasil), Espanhol e Inglês. Estamos trabalhando para adicionar mais idiomas em breve."
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-6">
              <HelpCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Central de Ajuda</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Perguntas <span className="gradient-text">Frequentes</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Encontre respostas para as dúvidas mais comuns sobre o HandZone.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="glass-card rounded-xl border-border px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center glass-card rounded-2xl p-8">
            <h3 className="text-xl font-bold mb-2">Ainda tem dúvidas?</h3>
            <p className="text-muted-foreground mb-4">
              Entre em contato conosco e teremos prazer em ajudar.
            </p>
            <a href="mailto:handzone.contato@gmail.com" className="text-primary hover:underline font-medium">
              handzone.contato@gmail.com
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
