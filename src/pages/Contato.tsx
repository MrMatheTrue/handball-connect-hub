import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const Contato = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Fale <span className="gradient-text">Conosco</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Estamos aqui para ajudar. Entre em contato através dos canais abaixo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <a href="mailto:handzone.contato@gmail.com" className="glass-card rounded-2xl p-8 flex items-start gap-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">Email</h3>
                <p className="text-primary">handzone.contato@gmail.com</p>
                <p className="text-muted-foreground text-sm mt-1">Respondemos em até 24h úteis</p>
              </div>
            </a>

            <a href="https://wa.me/5512992232791" target="_blank" rel="noopener noreferrer" className="glass-card rounded-2xl p-8 flex items-start gap-4 hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                <p className="text-primary">(12) 99223-2791</p>
                <p className="text-muted-foreground text-sm mt-1">Segunda a Sexta, 9h às 18h</p>
              </div>
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;
