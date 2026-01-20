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
import { getAgents, saveAgents, COUNTRIES, Agent } from "@/data/mockData";
import { Upload, Users, Save } from "lucide-react";
import LocationSelector from "@/components/common/LocationSelector";

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    agency: "",
    country: "",
    state: "",
    city: "",
    description: "",
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.country) newErrors.country = "País é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Erro de validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      agency: formData.agency || undefined,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      description: formData.description,
      photoUrl: photoPreview || undefined,
      agencyLogoUrl: logoPreview || undefined,
      clientIds: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    const agents = getAgents();
    agents.push(newAgent);
    saveAgents(agents);

    toast({
      title: "Perfil criado com sucesso!",
      description: "Seu perfil de agente foi criado e está disponível para visualização.",
    });

    navigate(`/agente/${newAgent.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Page Header */}
          <div className="mb-8">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Criar Perfil
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mt-4 mb-4">
              Perfil de <span className="gradient-text">Agente</span>
            </h1>
            <p className="text-muted-foreground">
              Preencha as informações abaixo para criar seu perfil de agente.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photos Upload */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Foto e Logo
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-light/10 flex items-center justify-center border-2 border-dashed border-primary/30 overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Users className="w-10 h-10 text-primary/40" />
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <Label htmlFor="photo-upload">
                      <Button type="button" variant="glass" size="sm" asChild>
                        <span>Sua Foto</span>
                      </Button>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-light/10 flex items-center justify-center border-2 border-dashed border-primary/30 overflow-hidden">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl text-primary/40">Logo</span>
                    )}
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Label htmlFor="logo-upload">
                      <Button type="button" variant="glass" size="sm" asChild>
                        <span>Logo Agência</span>
                      </Button>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Informações Pessoais</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Seu nome completo"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="seu@email.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agency">Nome da Agência</Label>
                  <Input
                    id="agency"
                    name="agency"
                    value={formData.agency}
                    onChange={handleInputChange}
                    placeholder="Nome da sua agência (opcional)"
                  />
                </div>

                <LocationSelector
                  country={formData.country}
                  state={formData.state}
                  city={formData.city}
                  onCountryChange={(v) => handleSelectChange("country", v)}
                  onStateChange={(v) => handleSelectChange("state", v)}
                  onCityChange={(v) => handleSelectChange("city", v)}
                  className="mt-4 col-span-2"
                />
              </div>
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Descrição</h2>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva sua experiência, especialização e serviços oferecidos..."
                rows={5}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="glass" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" variant="hero" className="gap-2">
                <Save className="w-4 h-4" />
                Criar Perfil
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateAgent;
