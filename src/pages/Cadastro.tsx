import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Building2, Users, Mail, Lock, Eye, EyeOff, ArrowRight, Check, GraduationCap, Plus, X, Upload, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/contexts/UserContext";
import { POSITIONS, COUNTRIES, LEVELS, STATUSES, COACH_SPECIALIZATIONS } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";
import LocationSelector from "@/components/common/LocationSelector";

const Cadastro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signup } = useUser();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [profileType, setProfileType] = useState<string | null>(localStorage.getItem('hz_pending_profile_type'));
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Basic account data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Player specific data
  const [playerData, setPlayerData] = useState({
    birthDate: "",
    nationality: "Brasil",
    state: "",
    city: "",
    height: "",
    weight: "",
    position: "",
    dominantHand: "Destro" as "Destro" | "Canhoto",
    level: "Amador" as "Amador" | "Semiprofissional" | "Profissional",
    status: "Disponível" as "Disponível" | "Contrato atual" | "Buscando clube" | "Em negociação",
    description: "",
    videoLinks: [""],
    clubHistory: [{ club: "", period: "" }],
  });

  // Club specific data
  const [clubData, setClubData] = useState({
    country: "Brasil",
    state: "",
    city: "",
    league: "",
    history: "",
    gymnasium: "",
    description: "",
    founded: "",
  });

  // Agent specific data
  const [agentData, setAgentData] = useState({
    agency: "",
    country: "Brasil",
    state: "",
    city: "",
    description: "",
  });

  // Coach specific data
  const [coachData, setCoachData] = useState({
    birthDate: "",
    nationality: "Brasil",
    state: "",
    city: "",
    experience: "",
    specialization: "",
    level: "Amador" as "Amador" | "Semiprofissional" | "Profissional",
    status: "Disponível" as "Disponível" | "Contrato atual" | "Buscando clube" | "Em negociação",
    description: "",
    certifications: [""],
    clubHistory: [{ club: "", period: "", role: "" }],
  });

  const profileTypes = [
    {
      id: "jogador",
      icon: User,
      title: t("profiles.player.title"),
      description: t("profiles.player.registerDesc", "Quero criar meu perfil como atleta de handebol"),
    },
    {
      id: "tecnico",
      icon: GraduationCap,
      title: t("nav.coaches"),
      description: t("profiles.coach.registerDesc", "Sou técnico, preparador físico ou membro de comissão técnica"),
    },
    {
      id: "clube",
      icon: Building2,
      title: t("profiles.club.title"),
      description: t("profiles.club.registerDesc", "Represento um clube ou time de handebol"),
    },
    {
      id: "agente",
      icon: Users,
      title: t("profiles.agent.title"),
      description: t("profiles.agent.registerDesc", "Sou agente e represento atletas"),
    },
  ];

  const addClubHistory = () => {
    if (profileType === "jogador") {
      setPlayerData({
        ...playerData,
        clubHistory: [...playerData.clubHistory, { club: "", period: "" }],
      });
    } else if (profileType === "tecnico") {
      setCoachData({
        ...coachData,
        clubHistory: [...coachData.clubHistory, { club: "", period: "", role: "" }],
      });
    }
  };

  const removeClubHistory = (index: number) => {
    if (profileType === "jogador") {
      setPlayerData({
        ...playerData,
        clubHistory: playerData.clubHistory.filter((_, i) => i !== index),
      });
    } else if (profileType === "tecnico") {
      setCoachData({
        ...coachData,
        clubHistory: coachData.clubHistory.filter((_, i) => i !== index),
      });
    }
  };

  const addVideoLink = () => {
    setPlayerData({
      ...playerData,
      videoLinks: [...playerData.videoLinks, ""],
    });
  };

  const addCertification = () => {
    setCoachData({
      ...coachData,
      certifications: [...coachData.certifications, ""],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptedTerms) {
      toast({
        title: "Termos obrigatórios",
        description: "Você deve aceitar os termos de aceite para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Map profile type to user_type enum
    const userTypeMap: Record<string, 'player' | 'club' | 'agent' | 'coach'> = {
      jogador: 'player',
      tecnico: 'coach',
      clube: 'club',
      agente: 'agent',
    };
    const userType = userTypeMap[profileType || 'jogador'];

    const result = await signup(formData.email, formData.password, formData.name, userType);

    if (result.error) {
      toast({
        title: "Erro ao criar conta",
        description: result.error,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Update user_type and terms acceptance on profile after signup
    await new Promise(resolve => setTimeout(resolve, 1000));

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        user_type: userType,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        privacy_accepted: true,
        data_sharing_consent: true,
      } as any).eq('id', user.id);
    }

    toast({
      title: t("auth.registerSuccess"),
      description: t("auth.registerSuccessDesc", "Bem-vindo ao HandZone. Explore a plataforma!"),
    });

    setIsLoading(false);
    navigate("/dashboard");
  };

  const renderProfileFields = () => {
    if (profileType === "jogador") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("cadastro.birthDate", "Data de Nascimento")} *</Label>
              <Input
                type="date"
                value={playerData.birthDate}
                onChange={(e) => setPlayerData({ ...playerData, birthDate: e.target.value })}
                required
                className="bg-secondary border-border"
              />
            </div>
            <LocationSelector
              country={playerData.nationality}
              state={playerData.state}
              city={playerData.city}
              onCountryChange={(v) => setPlayerData({ ...playerData, nationality: v })}
              onStateChange={(v) => setPlayerData({ ...playerData, state: v })}
              onCityChange={(v) => setPlayerData({ ...playerData, city: v })}
              className="mt-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("cadastro.height", "Altura (cm)")} *</Label>
              <Input
                type="number"
                value={playerData.height}
                onChange={(e) => setPlayerData({ ...playerData, height: e.target.value })}
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("cadastro.weight", "Peso (kg)")} *</Label>
              <Input
                type="number"
                value={playerData.weight}
                onChange={(e) => setPlayerData({ ...playerData, weight: e.target.value })}
                required
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("listing.position")} *</Label>
              <Select value={playerData.position} onValueChange={(v) => setPlayerData({ ...playerData, position: v })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder={t("listing.allPositions")} />
                </SelectTrigger>
                <SelectContent>
                  {POSITIONS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("cadastro.dominantHand", "Mão Dominante")} *</Label>
              <Select value={playerData.dominantHand} onValueChange={(v) => setPlayerData({ ...playerData, dominantHand: v as any })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Destro">{t("cadastro.rightHanded", "Destro")}</SelectItem>
                  <SelectItem value="Canhoto">{t("cadastro.leftHanded", "Canhoto")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("listing.level")} *</Label>
              <Select value={playerData.level} onValueChange={(v) => setPlayerData({ ...playerData, level: v as any })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("listing.status")} *</Label>
              <Select value={playerData.status} onValueChange={(v) => setPlayerData({ ...playerData, status: v as any })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sobre você</Label>
            <Textarea
              value={playerData.description}
              onChange={(e) => setPlayerData({ ...playerData, description: e.target.value })}
              placeholder="Conte um pouco sobre sua carreira e objetivos..."
              className="bg-secondary border-border min-h-24"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("cadastro.clubHistory", "Histórico de Clubes")}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addClubHistory}>
                <Plus className="w-4 h-4 mr-1" /> {t("listing.add", "Adicionar")}
              </Button>
            </div>
            {playerData.clubHistory.map((history, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={t("cadastro.clubName", "Nome do clube")}
                  value={history.club}
                  onChange={(e) => {
                    const newHistory = [...playerData.clubHistory];
                    newHistory[index].club = e.target.value;
                    setPlayerData({ ...playerData, clubHistory: newHistory });
                  }}
                  className="bg-secondary border-border flex-1"
                />
                <Input
                  placeholder={t("cadastro.period", "Período (ex: 2020-2023)")}
                  value={history.period}
                  onChange={(e) => {
                    const newHistory = [...playerData.clubHistory];
                    newHistory[index].period = e.target.value;
                    setPlayerData({ ...playerData, clubHistory: newHistory });
                  }}
                  className="bg-secondary border-border w-40"
                />
                {index > 0 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeClubHistory(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("cadastro.videoLinks", "Links de Vídeos (YouTube/Vimeo)")}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addVideoLink}>
                <Plus className="w-4 h-4 mr-1" /> {t("listing.add", "Adicionar")}
              </Button>
            </div>
            {playerData.videoLinks.map((link, index) => (
              <Input
                key={index}
                placeholder="https://youtube.com/watch?v=..."
                value={link}
                onChange={(e) => {
                  const newLinks = [...playerData.videoLinks];
                  newLinks[index] = e.target.value;
                  setPlayerData({ ...playerData, videoLinks: newLinks });
                }}
                className="bg-secondary border-border"
              />
            ))}
          </div>
        </div>
      );
    }

    if (profileType === "tecnico") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Nascimento *</Label>
              <Input
                type="date"
                value={coachData.birthDate}
                onChange={(e) => setCoachData({ ...coachData, birthDate: e.target.value })}
                required
                className="bg-secondary border-border"
              />
            </div>
            <LocationSelector
              country={coachData.nationality}
              state={coachData.state}
              city={coachData.city}
              onCountryChange={(v) => setCoachData({ ...coachData, nationality: v })}
              onStateChange={(v) => setCoachData({ ...coachData, state: v })}
              onCityChange={(v) => setCoachData({ ...coachData, city: v })}
              className="mt-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("cadastro.specialization", "Especialização")} *</Label>
              <Select value={coachData.specialization} onValueChange={(v) => setCoachData({ ...coachData, specialization: v })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder={t("listing.clear")} />
                </SelectTrigger>
                <SelectContent>
                  {COACH_SPECIALIZATIONS.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("listing.experience")} *</Label>
              <Input
                placeholder={t("cadastro.experiencePlaceholder", "Ex: 10 anos")}
                value={coachData.experience}
                onChange={(e) => setCoachData({ ...coachData, experience: e.target.value })}
                required
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nível *</Label>
              <Select value={coachData.level} onValueChange={(v) => setCoachData({ ...coachData, level: v as any })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status *</Label>
              <Select value={coachData.status} onValueChange={(v) => setCoachData({ ...coachData, status: v as any })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("cadastro.aboutYou", "Sobre você")}</Label>
            <Textarea
              value={coachData.description}
              onChange={(e) => setCoachData({ ...coachData, description: e.target.value })}
              placeholder={t("cadastro.coachDescPlaceholder", "Conte um pouco sobre sua experiência e metodologia...")}
              className="bg-secondary border-border min-h-24"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("cadastro.certifications", "Certificações")}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addCertification}>
                <Plus className="w-4 h-4 mr-1" /> {t("listing.add", "Adicionar")}
              </Button>
            </div>
            {coachData.certifications.map((cert, index) => (
              <Input
                key={index}
                placeholder="Ex: Licença Pro CBHb"
                value={cert}
                onChange={(e) => {
                  const newCerts = [...coachData.certifications];
                  newCerts[index] = e.target.value;
                  setCoachData({ ...coachData, certifications: newCerts });
                }}
                className="bg-secondary border-border"
              />
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>{t("cadastro.professionalHistory", "Histórico Profissional")}</Label>
              <Button type="button" variant="ghost" size="sm" onClick={addClubHistory}>
                <Plus className="w-4 h-4 mr-1" /> {t("listing.add", "Adicionar")}
              </Button>
            </div>
            {coachData.clubHistory.map((history, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={t("cadastro.clubName", "Nome do clube")}
                  value={history.club}
                  onChange={(e) => {
                    const newHistory = [...coachData.clubHistory];
                    newHistory[index].club = e.target.value;
                    setCoachData({ ...coachData, clubHistory: newHistory });
                  }}
                  className="bg-secondary border-border flex-1"
                />
                <Input
                  placeholder={t("cadastro.role", "Função")}
                  value={history.role}
                  onChange={(e) => {
                    const newHistory = [...coachData.clubHistory];
                    newHistory[index].role = e.target.value;
                    setCoachData({ ...coachData, clubHistory: newHistory });
                  }}
                  className="bg-secondary border-border w-32"
                />
                <Input
                  placeholder={t("cadastro.period", "Período")}
                  value={history.period}
                  onChange={(e) => {
                    const newHistory = [...coachData.clubHistory];
                    newHistory[index].period = e.target.value;
                    setCoachData({ ...coachData, clubHistory: newHistory });
                  }}
                  className="bg-secondary border-border w-32"
                />
                {index > 0 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeClubHistory(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (profileType === "clube") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <LocationSelector
              country={clubData.country}
              state={clubData.state}
              city={clubData.city}
              onCountryChange={(v) => setClubData({ ...clubData, country: v })}
              onStateChange={(v) => setClubData({ ...clubData, state: v })}
              onCityChange={(v) => setClubData({ ...clubData, city: v })}
              className="mt-4"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("cadastro.leagueLabel", "Liga / Campeonato")} *</Label>
              <Input
                value={clubData.league}
                onChange={(e) => setClubData({ ...clubData, league: e.target.value })}
                required
                className="bg-secondary border-border"
              />
            </div>
            <div className="space-y-2">
              <Label>{t("cadastro.gymnasium", "Ginásio / Arena")}</Label>
              <Input
                value={clubData.gymnasium}
                onChange={(e) => setClubData({ ...clubData, gymnasium: e.target.value })}
                className="bg-secondary border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("cadastro.clubHistoryLabel", "História do Clube")}</Label>
            <Textarea
              value={clubData.history}
              onChange={(e) => setClubData({ ...clubData, history: e.target.value })}
              placeholder={t("cadastro.clubHistoryPlaceholder", "Conte a história e conquistas do clube...")}
              className="bg-secondary border-border min-h-24"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("cadastro.description", "Descrição")}</Label>
            <Textarea
              value={clubData.description}
              onChange={(e) => setClubData({ ...clubData, description: e.target.value })}
              placeholder={t("cadastro.clubDescPlaceholder", "Descreva o clube, sua estrutura e objetivos...")}
              className="bg-secondary border-border min-h-24"
            />
          </div>
        </div>
      );
    }

    if (profileType === "agente") {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("cadastro.agencyLabel", "Agência (opcional)")}</Label>
              <Input
                value={agentData.agency}
                onChange={(e) => setAgentData({ ...agentData, agency: e.target.value })}
                placeholder={t("cadastro.agencyPlaceholder", "Nome da agência")}
                className="bg-secondary border-border"
              />
            </div>
            <LocationSelector
              country={agentData.country}
              state={agentData.state}
              city={agentData.city}
              onCountryChange={(v) => setAgentData({ ...agentData, country: v })}
              onStateChange={(v) => setAgentData({ ...agentData, state: v })}
              onCityChange={(v) => setAgentData({ ...agentData, city: v })}
              className="mt-4 col-span-2"
            />
          </div>

          <div className="space-y-2">
            <Label>{t("cadastro.agentAbout", "Sobre você e sua atuação")}</Label>
            <Textarea
              value={agentData.description}
              onChange={(e) => setAgentData({ ...agentData, description: e.target.value })}
              placeholder={t("cadastro.agentDescPlaceholder", "Descreva sua experiência, especializações e como você pode ajudar atletas...")}
              className="bg-secondary border-border min-h-32"
            />
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-light flex items-center justify-center shadow-lg glow-orange">
                  <span className="font-display text-2xl text-primary-foreground">HZ</span>
                </div>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                Crie sua conta no HandZone
              </h1>
              <p className="text-muted-foreground">
                {step === 1 ? "Escolha o tipo de perfil" : step === 2 ? "Preencha seus dados" : "Complete seu perfil"}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    }`}>
                    {step > s ? <Check className="w-4 h-4" /> : s}
                  </div>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    {s === 1 ? t("auth.stepType") : s === 2 ? t("auth.stepAccount") : t("auth.stepProfile")}
                  </span>
                  {s < 3 && <div className="w-8 h-0.5 bg-border" />}
                </div>
              ))}
            </div>

            {/* Step 1: Profile Type Selection */}
            {step === 1 && (
              <div className="glass-card rounded-2xl p-8 border-accent-glow">
                <div className="space-y-4">
                  {profileTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setProfileType(type.id)}
                      className={`w-full p-6 rounded-xl border-2 text-left transition-all ${profileType === type.id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-secondary/50 hover:border-primary/50"
                        }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${profileType === type.id
                          ? "bg-gradient-to-br from-primary to-orange-light"
                          : "bg-muted"
                          }`}>
                          <type.icon className={`w-6 h-6 ${profileType === type.id ? "text-primary-foreground" : "text-muted-foreground"
                            }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {type.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {type.description}
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${profileType === type.id
                          ? "border-primary bg-primary"
                          : "border-muted-foreground"
                          }`}>
                          {profileType === type.id && (
                            <Check className="w-4 h-4 text-primary-foreground" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <Button
                  variant="hero"
                  className="w-full mt-6"
                  size="lg"
                  disabled={!profileType}
                  onClick={() => {
                    if (profileType) {
                      localStorage.setItem('hz_pending_profile_type', profileType);
                    }
                    setStep(2);
                  }}
                >
                  {t("listing.continue", "Continuar")}
                  <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">ou</span>
                  <div className="flex-1 h-px bg-border" />
                </div>

                <Button
                  variant="outline"
                  className="w-full h-12 gap-3"
                  onClick={async () => {
                    if (profileType) {
                      localStorage.setItem('hz_pending_profile_type', profileType);
                    }
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: window.location.origin + '/cadastro',
                      }
                    });
                    if (error) {
                      toast({ title: "Erro", description: error.message, variant: "destructive" });
                    }
                  }}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Cadastrar com Google
                </Button>
              </div>
            )}

            {/* Step 2: Account Details */}
            {step === 2 && (
              <div className="glass-card rounded-2xl p-8 border-accent-glow">
                <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      {profileType === "clube" ? t("cadastro.clubNameLabel", "Nome do Clube") : t("cadastro.fullName", "Nome completo")}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder={profileType === "clube" ? t("cadastro.clubName", "Nome do clube") : t("cadastro.yourName", "Seu nome")}
                        className="pl-12 h-12 bg-secondary border-border"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-12 h-12 bg-secondary border-border"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie uma senha forte"
                        className="pl-12 pr-12 h-12 bg-secondary border-border"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="glass"
                      className="flex-1"
                      size="lg"
                      onClick={() => setStep(1)}
                    >
                      {t("cadastro.back", "Voltar")}
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1" size="lg">
                      {t("listing.continue", "Continuar")}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Profile Details */}
            {step === 3 && (
              <div className="glass-card rounded-2xl p-8 border-accent-glow">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {renderProfileFields()}

                  {/* Terms acceptance */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                      className="mt-0.5"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
                      Eu li e aceito os{" "}
                      <Link to="/termos" target="_blank" className="text-primary hover:underline font-medium">
                        termos de aceite
                      </Link>
                      , a{" "}
                      <Link to="/privacidade" target="_blank" className="text-primary hover:underline font-medium">
                        política de privacidade
                      </Link>
                      {" "}e consinto com o compartilhamento dos meus dados de contato com usuários Premium da plataforma, conforme a LGPD.
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="glass"
                      className="flex-1"
                      size="lg"
                      onClick={() => setStep(2)}
                    >
                      Voltar
                    </Button>
                    <Button type="submit" variant="hero" className="flex-1" size="lg" disabled={isLoading || !acceptedTerms}>
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                      {isLoading ? "Criando..." : t("listing.createProfile")}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {t("auth.hasAccount")}{" "}
                <Link
                  to="/login"
                  className="text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  {t("auth.login")}
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="text-center text-xs text-muted-foreground mt-6">
              {t("cadastro.termsAgreement", "Ao criar uma conta, você concorda com nossos")}{" "}
              <Link to="/termos" className="text-primary hover:underline">
                {t("footer.links.terms")}
              </Link>{" "}
              {t("cadastro.and", "e")}{" "}
              <Link to="/privacidade" className="text-primary hover:underline">
                {t("footer.links.privacy")}
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Cadastro;
