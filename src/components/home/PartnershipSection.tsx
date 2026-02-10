import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Handshake, Loader2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const PartnershipSection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    partnership_type: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.partnership_type) {
      toast({ title: "Selecione o tipo de parceria", variant: "destructive" });
      return;
    }
    setIsLoading(true);

    const { error } = await supabase.from('partnership_requests' as any).insert(form as any);

    if (error) {
      toast({ title: "Erro ao enviar", description: "Tente novamente mais tarde.", variant: "destructive" });
    } else {
      toast({ title: "Solicitação enviada!", description: "Entraremos em contato em breve." });
      setForm({ company_name: "", contact_name: "", email: "", phone: "", partnership_type: "", message: "" });
    }
    setIsLoading(false);
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-6">
              <Handshake className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Parcerias & Patrocínio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Quer ser <span className="gradient-text">parceiro</span>?
            </h2>
            <p className="text-muted-foreground">
              Entre em contato conosco para discutir oportunidades de patrocínio, parceria ou investimento.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 border-accent-glow space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome da Empresa *</Label>
                <Input
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  required
                  className="bg-secondary border-border"
                  placeholder="HandZone Sports"
                />
              </div>
              <div className="space-y-2">
                <Label>Nome do Contato *</Label>
                <Input
                  value={form.contact_name}
                  onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                  required
                  className="bg-secondary border-border"
                  placeholder="João Silva"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-secondary border-border"
                  placeholder="contato@empresa.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone *</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  required
                  className="bg-secondary border-border"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tipo de Parceria *</Label>
              <Select value={form.partnership_type} onValueChange={(v) => setForm({ ...form, partnership_type: v })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patrocinio">Patrocínio</SelectItem>
                  <SelectItem value="parceria">Parceria Comercial</SelectItem>
                  <SelectItem value="publicidade">Publicidade</SelectItem>
                  <SelectItem value="investimento">Investimento</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mensagem *</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                className="bg-secondary border-border min-h-28"
                placeholder="Descreva sua proposta..."
              />
            </div>

            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-5 h-5 mr-2" />}
              {isLoading ? "Enviando..." : "Enviar Proposta"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PartnershipSection;
