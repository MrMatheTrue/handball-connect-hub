import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Building2, Users, Mail, Lock, Eye, EyeOff, ArrowRight, Check, GraduationCap, Plus, X, Upload } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { getPlayers, savePlayers, getClubs, saveClubs, getAgents, saveAgents, getCoaches, saveCoaches, POSITIONS, COUNTRIES, LEVELS, STATUSES, COACH_SPECIALIZATIONS } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import LocationSelector from "@/components/common/LocationSelector";

const Cadastro = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useUser();
  const [step, setStep] = useState(1);
  const [profileType, setProfileType] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Basic account data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Player specific data
  const [playerData, setPlayerData] = useState({
    birthDate: "",
    nationality: "",
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
    country: "",
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
    country: "",
    state: "",
    city: "",
    description: "",
  });

  // Coach specific data
  const [coachData, setCoachData] = useState({
    birthDate: "",
    nationality: "",
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

  // Helper functions to update data - EXACT pattern from CreateOpportunity
  const updatePlayerData = (field: string, value: string) => {
    setPlayerData(prev => ({ ...prev, [field]: value }));
  };

  const updateCoachData = (field: string, value: string) => {
    setCoachData(prev => ({ ...prev, [field]: value }));
  };

  const updateClubData = (field: string, value: string) => {
    setClubData(prev => ({ ...prev, [field]: value }));
  };

  const updateAgentData = (field: string, value: string) => {
    setAgentData(prev => ({ ...prev, [field]: value }));
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userId = `user-${Date.now()}`;
    const profileId = `${profileType}-${Date.now()}`;

    if (profileType === "jogador") {
      const players = getPlayers();
      const newPlayer = {
        id: profileId,
        name: formData.name,
        email: formData.email,
        birthDate: playerData.birthDate,
        nationality: playerData.nationality,
        state: playerData.state,
        city: playerData.city,
        height: parseInt(playerData.height) || 0,
        weight: parseInt(playerData.weight) || 0,
        position: playerData.position,
        dominantHand: playerData.dominantHand,
        level: playerData.level,
        status: playerData.status,
        clubHistory: playerData.clubHistory.filter(h => h.club && h.period),
        description: playerData.description,
        videoLinks: playerData.videoLinks.filter(v => v),
        createdAt: new Date().toISOString().split('T')[0],
        userId,
        isPremiumProfile: false,
      };
      savePlayers([...players, newPlayer]);
      login({
        name: formData.name,
        email: formData.email,
        type: 'player',
        isPremium: false,
        profileId,
      });
    } else if (profileType === "tecnico") {
      const coaches = getCoaches();
      const newCoach = {
        id: profileId,
        name: formData.name,
        email: formData.email,
        birthDate: coachData.birthDate,
        nationality: coachData.nationality,
        state: coachData.state,
        city: coachData.city,
        experience: coachData.experience,
        specialization: coachData.specialization,
        level: coachData.level,
        status: coachData.status,
        clubHistory: coachData.clubHistory.filter(h => h.club && h.period),
        certifications: coachData.certifications.filter(c => c),
        description: coachData.description,
        videoLinks: [],
        createdAt: new Date().toISOString().split('T')[0],
        userId,
        isPremiumProfile: false,
      };
      saveCoaches([...coaches, newCoach]);
      login({
        name: formData.name,
        email: formData.email,
        type: 'coach',
        isPremium: false,
        profileId,
      });
    } else if (profileType === "clube") {
      const clubs = getClubs();
      const newClub = {
        id: profileId,
        name: formData.name,
        email: formData.email,
        country: clubData.country,
        state: clubData.state,
        city: clubData.city,
        league: clubData.league,
        history: clubData.history,
        gymnasium: clubData.gymnasium,
        description: clubData.description,
        founded: parseInt(clubData.founded) || undefined,
        photos: [],
        createdAt: new Date().toISOString().split('T')[0],
        userId,
      };
      saveClubs([...clubs, newClub]);
      login({
        name: formData.name,
        email: formData.email,
        type: 'club',
        isPremium: false,
        profileId,
      });
    } else if (profileType === "agente") {
      const agents = getAgents();
      const newAgent = {
        id: profileId,
        name: formData.name,
        email: formData.email,
        agency: agentData.agency,
        country: agentData.country,
        state: agentData.state,
        city: agentData.city,
        description: agentData.description,
        clientIds: [],
        createdAt: new Date().toISOString().split('T')[0],
        userId,
      };
      saveAgents([...agents, newAgent]);
      login({
        name: formData.name,
        email: formData.email,
        type: 'agent',
        isPremium: false,
        profileId,
      });
    }

    toast({
      title: t("auth.registerSuccess"),
      description: t("auth.registerSuccessDesc", "Bem-vindo ao HandZone. Explore a plataforma!"),
    });

    navigate("/dashboard");
  };

  const renderProfileFields = () => {
    if (profileType === "jogador") {
      return (
        <div className="space-y-6">
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
            onCountryChange={(v) => updatePlayerData("nationality", v)}
            onStateChange={(v) => updatePlayerData("state", v)}
            onCityChange={(v) => updatePlayerData("city", v)}
            countryLabel="Nacionalidade"
          />

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
            onCountryChange={(v) => updateCoachData("nationality", v)}
            onStateChange={(v) => updateCoachData("state", v)}
            onCityChange={(v) => updateCoachData("city", v)}
            countryLabel="Nacionalidade"
          />

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
          <LocationSelector
            country={clubData.country}
            state={clubData.state}
            city={clubData.city}
            onCountryChange={(v) => updateClubData("country", v)}
            onStateChange={(v) => updateClubData("state", v)}
            onCityChange={(v) => updateClubData("city", v)}
          />

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
            onCountryChange={(v) => updateAgentData("country", v)}
            onStateChange={(v) => updateAgentData("state", v)}
            onCityChange={(v) => updateAgentData("city", v)}
          />

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
                  onClick={() => setStep(2)}
                >
                  {t("listing.continue", "Continuar")}
                  <ArrowRight className="w-5 h-5" />
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
                    <Button type="submit" variant="hero" className="flex-1" size="lg">
                      {t("listing.createProfile")}
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
