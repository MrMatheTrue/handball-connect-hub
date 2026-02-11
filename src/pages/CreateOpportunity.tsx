import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { getOpportunities, saveOpportunities, POSITIONS, COACH_SPECIALIZATIONS, Opportunity } from "@/data/mockData";
import PaywallMessage from "@/components/PaywallMessage";
import { Briefcase, Save, Crown, Lock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import LocationSelector from "@/components/common/LocationSelector";

const CONTRACT_TYPES = [
  "Temporada Completa",
  "6 meses",
  "1 Temporada",
  "2 Temporadas",
  "A definir",
];

const CreateOpportunity = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, isPremium, userType } = useUser();

  const canPublish = (userType === 'club' || userType === 'agent' || userType === 'coach') && isPremium;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    position: "",
    requirements: "",
    country: "",
    state: "",
    city: "",
    contractType: "",
    salary: "",
    expirationDate: "",
    type: "player" as "player" | "coach",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Título é obrigatório";
    if (!formData.description.trim()) newErrors.description = "Descrição é obrigatória";
    if (!formData.position) newErrors.position = "Posição é obrigatória";
    if (!formData.country) newErrors.country = "País é obrigatório";
    if (!formData.contractType) newErrors.contractType = "Tipo de contrato é obrigatório";
    if (!formData.expirationDate) newErrors.expirationDate = "Data de expiração é obrigatória";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canPublish) {
      toast({
        title: "Acesso restrito",
        description: "Apenas clubes e agentes premium podem publicar vagas.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newOpportunity: Opportunity = {
      id: `opp-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      position: formData.position,
      requirements: formData.requirements,
      location: `${formData.city}, ${formData.state}, ${formData.country}`,
      contractType: formData.contractType,
      salary: formData.salary || undefined,
      expirationDate: formData.expirationDate,
      clubId: userType === 'club' ? currentUser?.profileId : undefined,
      agentId: userType === 'agent' ? currentUser?.profileId : undefined,
      clubName: currentUser?.name || "Anônimo",
      featured: false,
      createdAt: new Date().toISOString().split("T")[0],
      applicantIds: [],
      type: formData.type,
    };

    const opportunities = getOpportunities();
    opportunities.unshift(newOpportunity);
    saveOpportunities(opportunities);

    toast({
      title: "Vaga publicada com sucesso!",
      description: "Sua vaga está disponível para candidaturas.",
    });

    navigate(`/oportunidade/${newOpportunity.id}`);
  };

  // Show paywall for non-premium users or restricted roles
  if (!isPremium || (userType !== 'club' && userType !== 'agent' && userType !== 'coach')) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <div className="glass-card rounded-2xl p-8 text-center border-accent-glow">
              <Lock className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Publicar Vagas</h1>

              {userType !== 'club' && userType !== 'agent' && userType !== 'coach' ? (
                <>
                  <p className="text-muted-foreground mb-6">
                    Apenas técnicos, clubes e agentes podem publicar vagas na plataforma.
                    Altere seu tipo de usuário para acessar esta funcionalidade.
                  </p>
                  <Link to="/dashboard">
                    <Button variant="hero">Ir para Dashboard</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground mb-6">
                    Assine o plano Premium para publicar vagas e encontrar os melhores talentos.
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <Crown className="w-5 h-5 text-primary" />
                    <span className="text-lg font-semibold">R$ 50,00/mês</span>
                  </div>
                  <Link to="/premium">
                    <Button variant="hero" size="lg">
                      Assinar Premium
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const positions = formData.type === 'coach' ? COACH_SPECIALIZATIONS : POSITIONS;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Nova Vaga
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
              Publicar <span className="gradient-text">Oportunidade</span>
            </h1>
            <p className="text-muted-foreground">
              Preencha as informações abaixo para publicar uma nova vaga.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Type Selection */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Tipo de Vaga</h2>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => handleSelectChange("type", "player")}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.type === 'player'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                    }`}
                >
                  <Briefcase className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'player' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-medium">Jogador</p>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectChange("type", "coach")}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all ${formData.type === 'coach'
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                    }`}
                >
                  <Briefcase className={`w-8 h-8 mx-auto mb-2 ${formData.type === 'coach' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="font-medium">Comissão Técnica</p>
                </button>
              </div>
            </div>

            {/* Basic Information */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Informações da Vaga</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="title">Título da Vaga *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Armador Esquerdo para temporada 2024"
                    className={errors.title ? "border-destructive" : ""}
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Posição *</Label>
                  <Select value={formData.position} onValueChange={(v) => handleSelectChange("position", v)}>
                    <SelectTrigger className={errors.position ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
                </div>

                <div className="space-y-4 sm:col-span-2">
                  <h3 className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Localização *
                  </h3>
                  <LocationSelector
                    country={formData.country}
                    state={formData.state}
                    city={formData.city}
                    onCountryChange={(v) => handleSelectChange("country", v)}
                    onStateChange={(v) => handleSelectChange("state", v)}
                    onCityChange={(v) => handleSelectChange("city", v)}
                    className="mt-2"
                  />
                  {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Tipo de Contrato *</Label>
                  <Select value={formData.contractType} onValueChange={(v) => handleSelectChange("contractType", v)}>
                    <SelectTrigger className={errors.contractType ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTRACT_TYPES.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.contractType && <p className="text-sm text-destructive">{errors.contractType}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salary">Salário</Label>
                  <Input
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Ex: R$ 5.000 - R$ 8.000/mês"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Data de Expiração *</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={handleInputChange}
                    className={errors.expirationDate ? "border-destructive" : ""}
                  />
                  {errors.expirationDate && <p className="text-sm text-destructive">{errors.expirationDate}</p>}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Descrição da Vaga *</h2>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva a vaga em detalhes: responsabilidades, expectativas, benefícios..."
                rows={5}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>

            {/* Requirements */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Requisitos</h2>
              <Textarea
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                placeholder="Liste os requisitos: experiência necessária, habilidades, certificações..."
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="glass" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" variant="hero" className="gap-2">
                <Save className="w-4 h-4" />
                Publicar Vaga
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateOpportunity;
