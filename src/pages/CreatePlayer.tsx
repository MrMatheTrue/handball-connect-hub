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
import { getPlayers, savePlayers, POSITIONS, COUNTRIES, LEVELS, STATUSES, Player } from "@/data/mockData";
import { Upload, Video, Plus, X, User, Save } from "lucide-react";
import LocationSelector from "@/components/common/LocationSelector";

const CreatePlayer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [videoLinks, setVideoLinks] = useState<string[]>([""]);
  const [clubHistory, setClubHistory] = useState<{ club: string; period: string }[]>([{ club: "", period: "" }]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "",
    nationality: "",
    state: "",
    city: "",
    height: "",
    weight: "",
    position: "",
    dominantHand: "Destro" as "Destro" | "Canhoto",
    level: "",
    status: "",
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

  const addVideoLink = () => {
    setVideoLinks([...videoLinks, ""]);
  };

  const removeVideoLink = (index: number) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index));
  };

  const updateVideoLink = (index: number, value: string) => {
    const newLinks = [...videoLinks];
    newLinks[index] = value;
    setVideoLinks(newLinks);
  };

  const addClubHistory = () => {
    setClubHistory([...clubHistory, { club: "", period: "" }]);
  };

  const removeClubHistory = (index: number) => {
    setClubHistory(clubHistory.filter((_, i) => i !== index));
  };

  const updateClubHistory = (index: number, field: "club" | "period", value: string) => {
    const newHistory = [...clubHistory];
    newHistory[index][field] = value;
    setClubHistory(newHistory);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    if (!formData.birthDate) newErrors.birthDate = "Data de nascimento é obrigatória";
    if (!formData.nationality) newErrors.nationality = "Nacionalidade é obrigatória";
    if (!formData.position) newErrors.position = "Posição é obrigatória";
    if (!formData.level) newErrors.level = "Nível é obrigatório";
    if (!formData.status) newErrors.status = "Status é obrigatório";

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

    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      birthDate: formData.birthDate,
      nationality: formData.nationality,
      state: formData.state,
      city: formData.city,
      height: parseInt(formData.height) || 0,
      weight: parseInt(formData.weight) || 0,
      position: formData.position,
      dominantHand: formData.dominantHand,
      level: formData.level as Player["level"],
      status: formData.status as Player["status"],
      clubHistory: clubHistory.filter(h => h.club.trim()),
      description: formData.description,
      photoUrl: photoPreview || undefined,
      videoLinks: videoLinks.filter(v => v.trim()),
      createdAt: new Date().toISOString().split("T")[0],
      isPremiumProfile: false,
    };

    const players = getPlayers();
    players.push(newPlayer);
    savePlayers(players);

    toast({
      title: "Perfil criado com sucesso!",
      description: "Seu perfil de jogador foi criado e está disponível para visualização.",
    });

    navigate(`/jogador/${newPlayer.id}`);
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
              Perfil de <span className="gradient-text">Jogador</span>
            </h1>
            <p className="text-muted-foreground">
              Preencha as informações abaixo para criar seu perfil de jogador.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                Foto de Perfil
              </h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-orange-light/10 flex items-center justify-center border-2 border-dashed border-primary/30 overflow-hidden">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-12 h-12 text-primary/40" />
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
                    <Button type="button" variant="glass" asChild>
                      <span>Escolher Foto</span>
                    </Button>
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG ou GIF. Máximo 5MB.
                  </p>
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
                  <Label htmlFor="birthDate">Data de Nascimento *</Label>
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className={errors.birthDate ? "border-destructive" : ""}
                  />
                  {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate}</p>}
                </div>

                <LocationSelector
                  country={formData.nationality}
                  state={formData.state}
                  city={formData.city}
                  onCountryChange={(v) => handleSelectChange("nationality", v)}
                  onStateChange={(v) => handleSelectChange("state", v)}
                  onCityChange={(v) => handleSelectChange("city", v)}
                  className="mt-4 col-span-2"
                />
              </div>
            </div>

            {/* Physical Attributes */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Características Físicas</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={formData.height}
                    onChange={handleInputChange}
                    placeholder="185"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={formData.weight}
                    onChange={handleInputChange}
                    placeholder="80"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Mão Dominante</Label>
                  <Select value={formData.dominantHand} onValueChange={(v) => handleSelectChange("dominantHand", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Destro">Destro</SelectItem>
                      <SelectItem value="Canhoto">Canhoto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Informações Profissionais</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Posição *</Label>
                  <Select value={formData.position} onValueChange={(v) => handleSelectChange("position", v)}>
                    <SelectTrigger className={errors.position ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map(pos => (
                        <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.position && <p className="text-sm text-destructive">{errors.position}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Nível *</Label>
                  <Select value={formData.level} onValueChange={(v) => handleSelectChange("level", v)}>
                    <SelectTrigger className={errors.level ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.level && <p className="text-sm text-destructive">{errors.level}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select value={formData.status} onValueChange={(v) => handleSelectChange("status", v)}>
                    <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(status => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                </div>
              </div>
            </div>

            {/* Club History */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Histórico de Clubes</h2>
                <Button type="button" variant="ghost" size="sm" onClick={addClubHistory} className="gap-1">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-4">
                {clubHistory.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex-1 grid sm:grid-cols-2 gap-4">
                      <Input
                        placeholder="Nome do clube"
                        value={item.club}
                        onChange={(e) => updateClubHistory(index, "club", e.target.value)}
                      />
                      <Input
                        placeholder="Período (ex: 2020-2023)"
                        value={item.period}
                        onChange={(e) => updateClubHistory(index, "period", e.target.value)}
                      />
                    </div>
                    {clubHistory.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeClubHistory(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Descrição</h2>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Descreva suas habilidades, experiência e objetivos..."
                rows={5}
              />
            </div>

            {/* Video Links */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Video className="w-5 h-5 text-primary" />
                  Links de Vídeos
                </h2>
                <Button type="button" variant="ghost" size="sm" onClick={addVideoLink} className="gap-1">
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
              <div className="space-y-4">
                {videoLinks.map((link, index) => (
                  <div key={index} className="flex gap-4">
                    <Input
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={link}
                      onChange={(e) => updateVideoLink(index, e.target.value)}
                      className="flex-1"
                    />
                    {videoLinks.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeVideoLink(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <p className="text-sm text-muted-foreground">
                  Cole links do YouTube ou Vimeo para mostrar seus destaques.
                </p>
              </div>
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

export default CreatePlayer;
