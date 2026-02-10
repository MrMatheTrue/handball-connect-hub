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
import { getClubs, saveClubs, COUNTRIES, Club } from "@/data/mockData";
import { Upload, Image, Plus, X, Building2, Save } from "lucide-react";
import LocationSelector from "@/components/common/LocationSelector";

const LEAGUES = [
  "Liga Nacional",
  "Liga Asobal",
  "Bundesliga",
  "Lidl Starligue",
  "EHF Champions League",
  "Outra",
];

const CreateClub = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    state: "",
    city: "",
    league: "",
    gymnasium: "",
    founded: "",
    history: "",
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

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPhotos(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.country) newErrors.country = "País é obrigatório";
    if (!formData.league) newErrors.league = "Liga é obrigatória";

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

    const newClub: Club = {
      id: `club-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      league: formData.league,
      gymnasium: formData.gymnasium,
      founded: parseInt(formData.founded) || undefined,
      history: formData.history,
      description: formData.description,
      logoUrl: logoPreview || undefined,
      photos: photos,
      createdAt: new Date().toISOString().split("T")[0],
    };

    const clubs = getClubs();
    clubs.push(newClub);
    saveClubs(clubs);

    toast({
      title: "Clube criado com sucesso!",
      description: "O perfil do clube foi criado e está disponível para visualização.",
    });

    navigate(`/clube/${newClub.id}`);
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
              Perfil de <span className="gradient-text">Clube</span>
            </h1>
            <p className="text-muted-foreground">
              Preencha as informações abaixo para criar o perfil do clube.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Logo Upload */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Logo do Clube
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-light/10 flex items-center justify-center border-2 border-dashed border-primary/30 overflow-hidden">
                  {logoPreview ? (
                    <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 className="w-12 h-12 text-primary/40" />
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
                    <Button type="button" variant="glass" asChild>
                      <span>Escolher Logo</span>
                    </Button>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG ou SVG. Máximo 5MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Informações Básicas</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Clube *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nome oficial do clube"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email de Contato *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contato@clube.com"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="founded">Ano de Fundação</Label>
                  <Input
                    id="founded"
                    name="founded"
                    type="number"
                    value={formData.founded}
                    onChange={handleInputChange}
                    placeholder="1900"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Liga *</Label>
                  <Select value={formData.league} onValueChange={(v) => handleSelectChange("league", v)}>
                    <SelectTrigger className={errors.league ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEAGUES.map(league => (
                        <SelectItem key={league} value={league}>{league}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.league && <p className="text-sm text-destructive">{errors.league}</p>}
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Localização</h2>
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

            {/* Infrastructure */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Infraestrutura</h2>
              <div className="space-y-2">
                <Label htmlFor="gymnasium">Ginásio / Arena</Label>
                <Input
                  id="gymnasium"
                  name="gymnasium"
                  value={formData.gymnasium}
                  onChange={handleInputChange}
                  placeholder="Nome do ginásio principal"
                />
              </div>
            </div>

            {/* History */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">História do Clube</h2>
              <Textarea
                name="history"
                value={formData.history}
                onChange={handleInputChange}
                placeholder="Conte a história do clube, conquistas, tradição..."
                rows={5}
              />
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Descrição</h2>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Breve descrição do clube e seus objetivos..."
                rows={3}
              />
            </div>

            {/* Photos Gallery */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  Galeria de Fotos
                </h2>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosChange}
                  className="hidden"
                  id="photos-upload"
                />
                <Label htmlFor="photos-upload">
                  <Button type="button" variant="ghost" size="sm" asChild className="gap-1">
                    <span>
                      <Plus className="w-4 h-4" />
                      Adicionar
                    </span>
                  </Button>
                </Label>
              </div>

              {photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removePhoto(index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhuma foto adicionada. Clique em "Adicionar" para incluir fotos do clube.
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="glass" onClick={() => navigate(-1)}>
                Cancelar
              </Button>
              <Button type="submit" variant="hero" className="gap-2">
                <Save className="w-4 h-4" />
                Criar Clube
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CreateClub;
