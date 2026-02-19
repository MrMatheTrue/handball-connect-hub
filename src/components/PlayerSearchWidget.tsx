import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import {
    Search, Sparkles, User, MapPin, Ruler, Trophy,
    Loader2, Bell, BellOff, ChevronRight, RefreshCw, X
} from "lucide-react";

interface PlayerResult {
    id: string;
    user_id: string;
    full_name: string;
    position: string | null;
    nationality: string | null;
    height: number | null;
    weight: number | null;
    availability_status: string | null;
    current_club: string | null;
    experience_years: number | null;
    avatar_url: string | null;
    score: number; // relevance score
}

interface ParsedCriteria {
    position?: string;
    nationality?: string;
    height_min?: number;
    height_max?: number;
    level?: string;
    status?: string;
    experience_min?: number;
}

const GROQ_API_KEY = "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"; // Usuário deve configurar sua chave Groq gratuita
const GROQ_MODEL = "llama-3.1-8b-instant";

export default function PlayerSearchWidget() {
    const { currentUser, userType } = useUser();
    const [description, setDescription] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [results, setResults] = useState<PlayerResult[]>([]);
    const [searched, setSearched] = useState(false);
    const [savedSearchId, setSavedSearchId] = useState<string | null>(null);
    const [notificationsOn, setNotificationsOn] = useState(false);
    const [parsedCriteria, setParsedCriteria] = useState<ParsedCriteria>({});
    const ACTIVE_KEY = GROQ_API_KEY;

    // Verificar se já tem busca ativa salva
    useEffect(() => {
        if (!currentUser) return;
        supabase
            .from("player_search_requests" as any)
            .select("id, search_description, parsed_criteria, status")
            .eq("requester_id", currentUser.id)
            .eq("status", "active")
            .order("created_at", { ascending: false })
            .limit(1)
            .then(({ data }) => {
                if (data && data.length > 0) {
                    const existing = data[0] as any;
                    setSavedSearchId(existing.id);
                    setDescription(existing.search_description);
                    setNotificationsOn(true);
                    setParsedCriteria(existing.parsed_criteria || {});
                }
            });
    }, [currentUser]);

    const parseWithGroq = async (text: string): Promise<ParsedCriteria> => {
        const key = GROQ_API_KEY;
        if (!key || key === "gsk_free") return {};

        try {
            const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${key}`,
                },
                body: JSON.stringify({
                    model: GROQ_MODEL,
                    max_tokens: 300,
                    messages: [
                        {
                            role: "system",
                            content: `Você é um assistente especialista em handebol. Extraia critérios de busca de jogadores do texto e retorne APENAS um JSON válido com estes campos opcionais:
{
  "position": string (uma de: Goleiro, Ponta Esquerda, Armador Esquerdo, Armador Central, Armador Direito, Ponta Direita, Pivô),
  "nationality": string (país em português),
  "height_min": number (cm),
  "height_max": number (cm),
  "status": string (Disponível, Buscando clube, Em negociação),
  "experience_min": number (anos)
}
Retorne apenas o JSON, sem texto adicional.`,
                        },
                        { role: "user", content: text },
                    ],
                }),
            });

            const data = await res.json();
            const content = data.choices?.[0]?.message?.content || "{}";
            const clean = content.replace(/```json|```/g, "").trim();
            return JSON.parse(clean);
        } catch {
            return {};
        }
    };

    const searchPlayers = async (criteria: ParsedCriteria): Promise<PlayerResult[]> => {
        let query = supabase
            .from("player_profiles" as any)
            .select(`
        id, user_id, position, nationality, height, weight,
        availability_status, current_club, experience_years,
        profiles(full_name, avatar_url)
      `)
            .limit(20);

        if (criteria.position) {
            query = query.ilike("position", `%${criteria.position}%`);
        }
        if (criteria.nationality) {
            query = query.ilike("nationality", `%${criteria.nationality}%`);
        }
        if (criteria.height_min) {
            query = query.gte("height", criteria.height_min);
        }
        if (criteria.height_max) {
            query = query.lte("height", criteria.height_max);
        }
        if (criteria.status) {
            query = query.ilike("availability_status", `%${criteria.status}%`);
        }
        if (criteria.experience_min) {
            query = query.gte("experience_years", criteria.experience_min);
        }

        const { data, error } = await query;
        if (error || !data) return [];

        return (data as any[]).map((p, i) => ({
            id: p.id,
            user_id: p.user_id,
            full_name: p.profiles?.full_name || "Atleta",
            position: p.position,
            nationality: p.nationality,
            height: p.height,
            weight: p.weight,
            availability_status: p.availability_status,
            current_club: p.current_club,
            experience_years: p.experience_years,
            avatar_url: p.profiles?.avatar_url,
            score: 100 - i * 5,
        }));
    };

    const handleSearch = async () => {
        if (!description.trim()) return;
        setIsSearching(true);
        setSearched(false);

        try {
            // 1. Parsear com IA
            const criteria = await parseWithGroq(description);
            setParsedCriteria(criteria);

            // 2. Buscar jogadores
            let players = await searchPlayers(criteria);

            // 3. Se sem filtros (sem chave Groq) busca todos disponíveis
            if (Object.keys(criteria).length === 0) {
                players = await searchPlayers({ status: "Disponível" });
            }

            // 4. Fallback: busca semelhantes se vazio
            if (players.length === 0 && criteria.position) {
                const similar = await searchPlayers({});
                players = similar.slice(0, 6);
            }

            setResults(players);
            setSearched(true);

            // 5. Salvar busca no banco para notificações futuras
            if (currentUser) {
                const { data: saved } = await supabase
                    .from("player_search_requests" as any)
                    .upsert({
                        id: savedSearchId || undefined,
                        requester_id: currentUser.id,
                        requester_type: userType,
                        requester_email: currentUser.email,
                        search_description: description,
                        parsed_criteria: criteria,
                        status: "active",
                    }, { onConflict: "id" })
                    .select("id")
                    .single();

                if (saved) {
                    setSavedSearchId((saved as any).id);
                    setNotificationsOn(true);
                }
            }
        } catch (e) {
            toast({ title: "Erro na busca", description: "Tente novamente.", variant: "destructive" });
        }

        setIsSearching(false);
    };

    const toggleNotifications = async () => {
        if (!savedSearchId) return;
        const newStatus = notificationsOn ? "expired" : "active";
        await supabase
            .from("player_search_requests" as any)
            .update({ status: newStatus })
            .eq("id", savedSearchId);
        setNotificationsOn(!notificationsOn);
        toast({
            title: notificationsOn ? "Notificações desativadas" : "Notificações ativadas",
            description: notificationsOn
                ? "Você não receberá mais alertas desta busca."
                : "Você será notificado quando novos atletas compatíveis se cadastrarem.",
        });
    };

    const saveGroqKey = () => {
        localStorage.setItem("hz_groq_key", groqKey);
        setShowKeyInput(false);
        toast({ title: "Chave salva!", description: "A IA está pronta para buscar atletas." });
    };

    const statusColor = (status: string | null) => {
        if (!status) return "bg-muted text-muted-foreground";
        if (status.includes("Disponível")) return "bg-green-500/20 text-green-400";
        if (status.includes("negociação")) return "bg-yellow-500/20 text-yellow-400";
        return "bg-blue-500/20 text-blue-400";
    };

    return (
        <div className="glass-card rounded-2xl p-6 border border-primary/20 mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">Procurando um Jogador?</h2>
                        <p className="text-xs text-muted-foreground">
                            Descreva o atleta ideal e nossa IA encontra as melhores opções
                        </p>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="space-y-3 mb-4">
                <Textarea
                    placeholder="Ex: Preciso de um armador central brasileiro, alto (acima de 190cm), disponível, com experiência profissional..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-secondary/50 border-border resize-none focus:border-primary transition-colors"
                />

                {/* Parsed criteria tags */}
                {Object.keys(parsedCriteria).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(parsedCriteria).map(([k, v]) => v && (
                            <span key={k} className="px-2 py-1 rounded-full bg-primary/15 text-primary text-xs font-medium">
                                {k === "position" && `📍 ${v}`}
                                {k === "nationality" && `🌍 ${v}`}
                                {k === "height_min" && `📏 ≥${v}cm`}
                                {k === "height_max" && `📏 ≤${v}cm`}
                                {k === "status" && `✅ ${v}`}
                                {k === "experience_min" && `⭐ ≥${v} anos`}
                            </span>
                        ))}
                    </div>
                )}

                <div className="flex gap-3">
                    <Button
                        onClick={handleSearch}
                        disabled={isSearching || !description.trim()}
                        className="flex-1 gap-2"
                        variant="hero"
                    >
                        {isSearching ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Buscando atletas...</>
                        ) : (
                            <><Search className="w-4 h-4" /> Buscar com IA</>
                        )}
                    </Button>

                    {savedSearchId && (
                        <Button
                            variant="glass"
                            onClick={toggleNotifications}
                            className="gap-2"
                            title={notificationsOn ? "Desativar alertas" : "Ativar alertas"}
                        >
                            {notificationsOn ? (
                                <><Bell className="w-4 h-4 text-primary" /> Alertas ON</>
                            ) : (
                                <><BellOff className="w-4 h-4" /> Alertas OFF</>
                            )}
                        </Button>
                    )}
                </div>
            </div>

            {/* Results */}
            {searched && (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium text-muted-foreground">
                            {results.length > 0
                                ? `${results.length} atleta${results.length > 1 ? "s" : ""} encontrado${results.length > 1 ? "s" : ""}`
                                : "Nenhum atleta encontrado — mostrando perfis semelhantes"}
                        </p>
                        <button
                            onClick={handleSearch}
                            className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                            <RefreshCw className="w-3 h-3" /> Atualizar
                        </button>
                    </div>

                    {results.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <User className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Nenhum atleta encontrado com esses critérios.</p>
                            <p className="text-xs mt-1">
                                Você será notificado quando um atleta compatível se cadastrar. 🔔
                            </p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {results.map((player) => (
                                <Link
                                    key={player.id}
                                    to={`/jogador/${player.user_id}`}
                                    className="group block"
                                >
                                    <div className="p-4 rounded-xl bg-secondary/40 border border-border hover:border-primary/50 hover:bg-secondary/60 transition-all">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/30 to-orange-400/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {player.avatar_url ? (
                                                    <img src={player.avatar_url} alt={player.full_name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-primary font-bold text-sm">
                                                        {player.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-foreground truncate">{player.full_name}</p>
                                                <p className="text-xs text-primary">{player.position || "Posição não definida"}</p>
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {player.nationality && (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                                            <MapPin className="w-3 h-3" />{player.nationality}
                                                        </span>
                                                    )}
                                                    {player.height && (
                                                        <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                                                            <Ruler className="w-3 h-3" />{player.height}cm
                                                        </span>
                                                    )}
                                                </div>
                                                {player.availability_status && (
                                                    <span className={`inline-block mt-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(player.availability_status)}`}>
                                                        {player.availability_status}
                                                    </span>
                                                )}
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {notificationsOn && (
                        <p className="text-xs text-center text-muted-foreground mt-4 flex items-center justify-center gap-1">
                            <Bell className="w-3 h-3 text-primary" />
                            Você receberá alertas por email e na plataforma quando novos atletas compatíveis se cadastrarem
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}