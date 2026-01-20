// Mock Data Store for HandZone Platform

export interface Player {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate: string;
  nationality: string;
  state: string;
  city: string;
  height: number;
  weight: number;
  position: string;
  dominantHand: 'Destro' | 'Canhoto';
  level: 'Amador' | 'Semiprofissional' | 'Profissional';
  status: 'Disponível' | 'Contrato atual' | 'Buscando clube' | 'Em negociação';
  clubHistory: { club: string; period: string }[];
  description: string;
  photoUrl?: string;
  videoLinks: string[];
  createdAt: string;
  userId?: string;
  isPremiumProfile?: boolean;
}

export interface Club {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country: string;
  state: string;
  city: string;
  league: string;
  history: string;
  gymnasium: string;
  description: string;
  logoUrl?: string;
  photos: string[];
  founded?: number;
  playersCount?: number;
  createdAt: string;
  userId?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone?: string;
  agency?: string;
  country: string;
  state: string;
  city: string;
  description: string;
  photoUrl?: string;
  agencyLogoUrl?: string;
  clientIds: string[];
  successfulPlacements?: number;
  createdAt: string;
  userId?: string;
}

export interface Coach {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate: string;
  nationality: string;
  state: string;
  city: string;
  experience: string;
  specialization: string;
  level: 'Amador' | 'Semiprofissional' | 'Profissional';
  status: 'Disponível' | 'Contrato atual' | 'Buscando clube' | 'Em negociação';
  clubHistory: { club: string; period: string; role: string }[];
  certifications: string[];
  description: string;
  photoUrl?: string;
  videoLinks: string[];
  createdAt: string;
  userId?: string;
  isPremiumProfile?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  position: string;
  requirements: string;
  location: string;
  contractType: string;
  expirationDate: string;
  clubId?: string;
  agentId?: string;
  clubName: string;
  featured: boolean;
  createdAt: string;
  applicantIds: string[];
  salary?: string;
  type: 'player' | 'coach';
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  authorId?: string; // Added to identify the author
  imageUrl?: string;
  publishedAt: string;
  readTime: string;
  featured: boolean;
  status: 'pending' | 'approved';
  authorRole: 'admin' | 'user';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

// Premium Pricing
export const PREMIUM_PRICING = {
  player: { price: 10, label: 'R$ 10,00/mês' },
  coach: { price: 10, label: 'R$ 10,00/mês' },
  club: { price: 50, label: 'R$ 50,00/mês' },
  agent: { price: 50, label: 'R$ 50,00/mês' },
};

// Initial Mock Data
export const initialPlayers: Player[] = [
  {
    id: 'player-1',
    name: 'Lucas Santos',
    email: 'lucas@email.com',
    birthDate: '2000-03-15',
    nationality: 'Brasil',
    state: 'São Paulo',
    city: 'São Paulo',
    height: 192,
    weight: 88,
    position: 'Armador Central',
    dominantHand: 'Destro',
    level: 'Profissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'EC Pinheiros', period: '2020-2023' },
      { club: 'Handebol Taubaté', period: '2018-2020' },
    ],
    description: 'Armador central com experiência em competições nacionais e internacionais. Especialista em jogadas de pivô e excelente visão de jogo.',
    videoLinks: ['https://www.youtube.com/watch?v=example1'],
    createdAt: '2024-01-01',
    isPremiumProfile: true,
  },
  {
    id: 'player-2',
    name: 'María González',
    email: 'maria@email.com',
    birthDate: '2002-07-22',
    nationality: 'Argentina',
    state: 'Buenos Aires',
    city: 'Buenos Aires',
    height: 178,
    weight: 72,
    position: 'Ponta Esquerda',
    dominantHand: 'Destro',
    level: 'Profissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'SAG Villa Ballester', period: '2021-2024' },
    ],
    description: 'Ponta esquerda veloz com excelente finalização. Representante da seleção argentina sub-21.',
    videoLinks: [],
    createdAt: '2024-01-02',
    isPremiumProfile: true,
  },
  {
    id: 'player-3',
    name: 'Pedro Almeida',
    email: 'pedro@email.com',
    birthDate: '1996-11-08',
    nationality: 'Portugal',
    state: 'Lisboa',
    city: 'Lisboa',
    height: 195,
    weight: 92,
    position: 'Goleiro',
    dominantHand: 'Destro',
    level: 'Profissional',
    status: 'Em negociação',
    clubHistory: [
      { club: 'SL Benfica', period: '2019-2024' },
      { club: 'FC Porto', period: '2016-2019' },
    ],
    description: 'Goleiro experiente com passagens por clubes de elite. Especialista em defesas de 7 metros.',
    videoLinks: ['https://www.youtube.com/watch?v=example2'],
    createdAt: '2024-01-03',
    isPremiumProfile: false,
  },
  {
    id: 'player-4',
    name: 'Sofia Martins',
    email: 'sofia@email.com',
    birthDate: '1998-05-20',
    nationality: 'Brasil',
    state: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    height: 185,
    weight: 78,
    position: 'Pivô',
    dominantHand: 'Canhoto',
    level: 'Semiprofissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'Flamengo', period: '2020-2024' },
    ],
    description: 'Pivô versátil com boa movimentação e finalização. Buscando oportunidade em liga profissional.',
    videoLinks: [],
    createdAt: '2024-01-04',
    isPremiumProfile: false,
  },
  {
    id: 'player-5',
    name: 'Carlos Fernández',
    email: 'carlos@email.com',
    birthDate: '1999-09-12',
    nationality: 'Espanha',
    state: 'Catalunha',
    city: 'Barcelona',
    height: 188,
    weight: 85,
    position: 'Armador Direito',
    dominantHand: 'Canhoto',
    level: 'Profissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'FC Barcelona B', period: '2021-2024' },
    ],
    description: 'Armador direito com forte arremesso de longa distância. Formado nas categorias de base do Barcelona.',
    videoLinks: ['https://www.youtube.com/watch?v=example3'],
    createdAt: '2024-01-05',
    isPremiumProfile: true,
  },
  {
    id: 'player-6',
    name: 'Ana Paula Silva',
    email: 'ana@email.com',
    birthDate: '2001-02-28',
    nationality: 'Brasil',
    state: 'Minas Gerais',
    city: 'Belo Horizonte',
    height: 175,
    weight: 68,
    position: 'Ponta Direita',
    dominantHand: 'Canhoto',
    level: 'Profissional',
    status: 'Contrato atual',
    clubHistory: [
      { club: 'Minas Tênis Clube', period: '2022-2025' },
    ],
    description: 'Ponta direita rápida com excelente contra-ataque. Atualmente sob contrato mas aberta a propostas.',
    videoLinks: [],
    createdAt: '2024-01-06',
    isPremiumProfile: false,
  },
  {
    id: 'player-7',
    name: 'Miguel Rodríguez',
    email: 'miguel@email.com',
    birthDate: '1997-06-14',
    nationality: 'Chile',
    state: 'Santiago',
    city: 'Santiago',
    height: 186,
    weight: 82,
    position: 'Armador Esquerdo',
    dominantHand: 'Destro',
    level: 'Profissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'CD Bidasoa', period: '2022-2024' },
      { club: 'Deportivo Alemán', period: '2019-2022' },
    ],
    description: 'Armador esquerdo com experiência internacional. Capitão da seleção chilena.',
    videoLinks: ['https://www.youtube.com/watch?v=example4'],
    createdAt: '2024-01-07',
    isPremiumProfile: true,
  },
  {
    id: 'player-8',
    name: 'Juliana Costa',
    email: 'juliana@email.com',
    birthDate: '1999-12-05',
    nationality: 'Brasil',
    state: 'Paraná',
    city: 'Curitiba',
    height: 180,
    weight: 74,
    position: 'Goleiro',
    dominantHand: 'Destro',
    level: 'Semiprofissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'Maringá Handebol', period: '2021-2024' },
    ],
    description: 'Goleira com ótimos reflexos e liderança. Buscando oportunidade em clube profissional.',
    videoLinks: [],
    createdAt: '2024-01-08',
    isPremiumProfile: false,
  },
];

export const initialClubs: Club[] = [
  {
    id: 'club-1',
    name: 'EC Pinheiros',
    email: 'contato@pinheiros.com.br',
    country: 'Brasil',
    state: 'São Paulo',
    city: 'São Paulo',
    league: 'Liga Nacional',
    history: 'Fundado em 1899, o EC Pinheiros é um dos clubes mais tradicionais do Brasil. Múltiplos títulos nacionais e participações em competições sul-americanas.',
    gymnasium: 'Ginásio Poliesportivo Henrique Villaboim',
    description: 'Clube tradicional do handebol brasileiro, formador de grandes atletas e campeão de diversas competições nacionais.',
    founded: 1899,
    playersCount: 28,
    photos: [],
    createdAt: '2024-01-01',
  },
  {
    id: 'club-2',
    name: 'Handebol Taubaté',
    email: 'contato@taubate.com.br',
    country: 'Brasil',
    state: 'São Paulo',
    city: 'Taubaté',
    league: 'Liga Nacional',
    history: 'O Handebol Taubaté surgiu como potência nacional nas últimas décadas, conquistando títulos importantes e revelando atletas de destaque.',
    gymnasium: 'Ginásio Municipal de Taubaté',
    description: 'Potência do handebol nacional com estrutura profissional e base forte de formação de atletas.',
    founded: 2011,
    playersCount: 24,
    photos: [],
    createdAt: '2024-01-02',
  },
  {
    id: 'club-3',
    name: 'Barcelona Handbol',
    email: 'info@barcelona.es',
    country: 'Espanha',
    state: 'Catalunha',
    city: 'Barcelona',
    league: 'Liga Asobal',
    history: 'Um dos clubes mais vitoriosos da história do handebol mundial, com inúmeros títulos da Champions League e campeonatos nacionais.',
    gymnasium: 'Palau Blaugrana',
    description: 'Gigante europeu do handebol, referência mundial em performance e formação de atletas de elite.',
    founded: 1942,
    playersCount: 32,
    photos: [],
    createdAt: '2024-01-03',
  },
  {
    id: 'club-4',
    name: 'THW Kiel',
    email: 'info@thw-kiel.de',
    country: 'Alemanha',
    state: 'Schleswig-Holstein',
    city: 'Kiel',
    league: 'Bundesliga',
    history: 'Clube alemão tradicional com múltiplos títulos da Bundesliga e Champions League.',
    gymnasium: 'Sparkassen-Arena',
    description: 'Potência alemã do handebol com história rica e tradição de conquistas europeias.',
    founded: 1904,
    playersCount: 30,
    photos: [],
    createdAt: '2024-01-04',
  },
  {
    id: 'club-5',
    name: 'Paris Saint-Germain Handball',
    email: 'contact@psg.fr',
    country: 'França',
    state: 'Île-de-France',
    city: 'Paris',
    league: 'Lidl Starligue',
    history: 'O PSG Handball é o braço de handebol do famoso clube parisiense, investindo forte em atletas de ponta.',
    gymnasium: 'Stade Pierre de Coubertin',
    description: 'Clube francês com grande investimento e elenco estelar, buscando domínio europeu.',
    founded: 1941,
    playersCount: 28,
    photos: [],
    createdAt: '2024-01-05',
  },
  {
    id: 'club-6',
    name: 'Metodista HC',
    email: 'contato@metodista.com.br',
    country: 'Brasil',
    state: 'São Paulo',
    city: 'São Bernardo do Campo',
    league: 'Liga Nacional',
    history: 'Clube universitário com forte tradição na formação de atletas desde 1955.',
    gymnasium: 'Ginásio Metodista',
    description: 'Clube tradicional com foco em formação de atletas e desenvolvimento do handebol de base.',
    founded: 1955,
    playersCount: 22,
    photos: [],
    createdAt: '2024-01-06',
  },
];

export const initialAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Roberto Mendes',
    email: 'roberto@sportspro.com.br',
    phone: '+55 11 99999-8888',
    agency: 'Sports Pro Agency',
    country: 'Brasil',
    state: 'São Paulo',
    city: 'São Paulo',
    description: 'Agente com mais de 15 anos de experiência no mercado do handebol brasileiro e sul-americano. Especializado em transferências internacionais.',
    clientIds: ['player-1', 'player-4'],
    successfulPlacements: 28,
    createdAt: '2024-01-01',
  },
  {
    id: 'agent-2',
    name: 'Carlos Vega',
    email: 'carlos@handballelite.es',
    phone: '+34 600 000 000',
    agency: 'Handball Elite',
    country: 'Espanha',
    state: 'Madrid',
    city: 'Madrid',
    description: 'Representante de jogadores de elite with conexões em toda Europa. Especialista em negociações com grandes clubes.',
    clientIds: ['player-5'],
    successfulPlacements: 45,
    createdAt: '2024-01-02',
  },
  {
    id: 'agent-3',
    name: 'Maria Schmidt',
    email: 'maria@schmidt-sports.de',
    country: 'Alemanha',
    state: 'Berlim',
    city: 'Berlim',
    description: 'Agente independente com foco no mercado alemão e escandinavo. Especializada em goleiros e defensores.',
    clientIds: ['player-3'],
    successfulPlacements: 15,
    createdAt: '2024-01-03',
  },
  {
    id: 'agent-4',
    name: 'André Costa',
    email: 'andre@talenthub.com.br',
    agency: 'Talent Hub Brasil',
    country: 'Brasil',
    state: 'Paraná',
    city: 'Curitiba',
    description: 'Descobridor de talentos jovens com ampla rede de contatos nas categorias de base do Brasil.',
    clientIds: ['player-6', 'player-8'],
    successfulPlacements: 22,
    createdAt: '2024-01-04',
  },
  {
    id: 'agent-5',
    name: 'Jean Dupont',
    email: 'jean@eurosports.fr',
    agency: 'Euro Sports Management',
    country: 'França',
    state: 'Île-de-France',
    city: 'Paris',
    description: 'Agente veterano com 20 anos de experiência. Representou diversos jogadores que atuaram em Olimpíadas e Mundiais.',
    clientIds: ['player-2'],
    successfulPlacements: 52,
    createdAt: '2024-01-05',
  },
  {
    id: 'agent-6',
    name: 'Ana Torres',
    email: 'ana@latinosports.ar',
    agency: 'Latino Sports',
    country: 'Argentina',
    state: 'Buenos Aires',
    city: 'Buenos Aires',
    description: 'Especialista no mercado latino-americano com foco em jogadores da Argentina, Chile e Uruguai.',
    clientIds: ['player-7'],
    successfulPlacements: 18,
    createdAt: '2024-01-06',
  },
];

export const initialCoaches: Coach[] = [
  {
    id: 'coach-1',
    name: 'Fernando Oliveira',
    email: 'fernando@email.com',
    phone: '+55 11 98888-7777',
    birthDate: '1975-04-12',
    nationality: 'Brasil',
    state: 'São Paulo',
    city: 'São Paulo',
    experience: '20 anos',
    specialization: 'Técnico Principal',
    level: 'Profissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'EC Pinheiros', period: '2018-2023', role: 'Técnico Principal' },
      { club: 'Seleção Brasileira Sub-21', period: '2015-2018', role: 'Assistente' },
    ],
    certifications: ['Licença Pro CBHb', 'Curso EHF Master Coach'],
    description: 'Técnico experiente com histórico de formação de atletas e conquistas nacionais. Especialista em desenvolvimento de jovens talentos.',
    videoLinks: [],
    createdAt: '2024-01-01',
    isPremiumProfile: true,
  },
  {
    id: 'coach-2',
    name: 'Carmen López',
    email: 'carmen@email.com',
    phone: '+34 912 345 678',
    birthDate: '1980-08-25',
    nationality: 'Espanha',
    state: 'Madrid',
    city: 'Madrid',
    experience: '15 anos',
    specialization: 'Técnica de Goleiros',
    level: 'Profissional',
    status: 'Em negociação',
    clubHistory: [
      { club: 'Atlético Madrid', period: '2020-2024', role: 'Técnica de Goleiros' },
      { club: 'Seleção Espanhola Feminina', period: '2016-2020', role: 'Assistente' },
    ],
    certifications: ['Licença Pro RFEBM', 'Especialização em Goleiros'],
    description: 'Especialista em treinamento de goleiros com passagem pela seleção espanhola. Metodologia moderna e foco em análise de desempenho.',
    videoLinks: [],
    createdAt: '2024-01-02',
    isPremiumProfile: true,
  },
  {
    id: 'coach-3',
    name: 'Ricardo Santos',
    email: 'ricardo@email.com',
    phone: '+55 21 97777-6666',
    birthDate: '1985-01-30',
    nationality: 'Brasil',
    state: 'Rio de Janeiro',
    city: 'Rio de Janeiro',
    experience: '10 anos',
    specialization: 'Preparador Físico',
    level: 'Semiprofissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'Flamengo', period: '2019-2024', role: 'Preparador Físico' },
    ],
    certifications: ['CREF', 'Especialização em Força e Condicionamento'],
    description: 'Preparador físico com foco em prevenção de lesões e otimização de performance. Experiência com equipes de alto rendimento.',
    videoLinks: [],
    createdAt: '2024-01-03',
    isPremiumProfile: false,
  },
  {
    id: 'coach-4',
    name: 'Hans Mueller',
    email: 'hans@email.com',
    phone: '+49 711 1234567',
    birthDate: '1970-11-15',
    nationality: 'Alemanha',
    state: 'Baden-Württemberg',
    city: 'Stuttgart',
    experience: '25 anos',
    specialization: 'Técnico Principal',
    level: 'Profissional',
    status: 'Disponível',
    clubHistory: [
      { club: 'Frisch Auf Göppingen', period: '2015-2023', role: 'Técnico Principal' },
      { club: 'TVB Stuttgart', period: '2008-2015', role: 'Técnico Principal' },
    ],
    certifications: ['DHB A-Lizenz', 'EHF Master Coach'],
    description: 'Técnico alemão com vasta experiência na Bundesliga. Metodologia tática avançada e histórico de desenvolvimento de jovens atletas.',
    videoLinks: [],
    createdAt: '2024-01-04',
    isPremiumProfile: true,
  },
];

export const initialOpportunities: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Armador Esquerdo',
    description: 'Buscamos um armador esquerdo experiente para reforçar nosso elenco para a próxima temporada. O candidato ideal deve ter experiência em competições de alto nível e bom entrosamento com pivôs.',
    position: 'Armador Esquerdo',
    requirements: 'Mínimo 3 anos de experiência profissional. Altura mínima 185cm. Experiência em competições internacionais é um diferencial.',
    location: 'Barcelona, Espanha',
    contractType: 'Temporada Completa',
    expirationDate: '2024-03-01',
    clubId: 'club-3',
    clubName: 'Barcelona Handbol',
    featured: true,
    createdAt: '2024-01-10',
    applicantIds: [],
    salary: 'A combinar',
    type: 'player',
  },
  {
    id: 'opp-2',
    title: 'Goleiro Experiente',
    description: 'THW Kiel busca goleiro experiente para compor o elenco. Oferecemos estrutura de primeiro mundo e competições europeias.',
    position: 'Goleiro',
    requirements: 'Experiência mínima de 5 anos em ligas de elite. Capacidade de liderança. Inglês ou alemão fluente.',
    location: 'Kiel, Alemanha',
    contractType: '2 Temporadas',
    expirationDate: '2024-02-15',
    clubId: 'club-4',
    clubName: 'THW Kiel',
    featured: true,
    createdAt: '2024-01-09',
    applicantIds: [],
    salary: '€80.000 - €120.000/ano',
    type: 'player',
  },
  {
    id: 'opp-3',
    title: 'Pivô para Temporada 2024',
    description: 'Paris Saint-Germain Handball busca pivô versátil para reforçar o elenco na busca pelo título europeu.',
    position: 'Pivô',
    requirements: 'Experiência em ligas top 5 europeias. Excelente condição física. Versatilidade defensiva.',
    location: 'Paris, França',
    contractType: 'Temporada Completa',
    expirationDate: '2024-02-28',
    clubId: 'club-5',
    clubName: 'Paris Saint-Germain Handball',
    featured: false,
    createdAt: '2024-01-08',
    applicantIds: [],
    salary: 'A combinar',
    type: 'player',
  },
  {
    id: 'opp-4',
    title: 'Ponta Direita',
    description: 'EC Pinheiros abre vaga para ponta direita para disputar a Liga Nacional e Sul-Americano de Clubes.',
    position: 'Ponta Direita',
    requirements: 'Jogador brasileiro ou com passaporte. Experiência em Liga Nacional. Disponibilidade imediata.',
    location: 'São Paulo, Brasil',
    contractType: '6 meses',
    expirationDate: '2024-02-01',
    clubId: 'club-1',
    clubName: 'EC Pinheiros',
    featured: false,
    createdAt: '2024-01-11',
    applicantIds: [],
    salary: 'R$ 5.000 - R$ 8.000/mês',
    type: 'player',
  },
  {
    id: 'opp-5',
    title: 'Armador Central',
    description: 'Metodista HC busca armador central para liderar a equipe na Liga Nacional.',
    position: 'Armador Central',
    requirements: 'Jogador com experiência em handebol brasileiro. Capacidade de liderança. Bom relacionamento com equipe jovem.',
    location: 'São Bernardo do Campo, Brasil',
    contractType: 'Temporada',
    expirationDate: '2024-02-20',
    clubId: 'club-6',
    clubName: 'Metodista HC',
    featured: false,
    createdAt: '2024-01-07',
    applicantIds: [],
    salary: 'R$ 3.000 - R$ 5.000/mês',
    type: 'player',
  },
  {
    id: 'opp-6',
    title: 'Defensor Versátil',
    description: 'Handebol Taubaté busca defensor versátil que possa atuar em múltiplas posições defensivas.',
    position: 'Defensor',
    requirements: 'Versatilidade para jogar em 6-0 e 5-1. Experiência defensiva. Boa comunicação em quadra.',
    location: 'Taubaté, Brasil',
    contractType: '1 Temporada',
    expirationDate: '2024-02-10',
    clubId: 'club-2',
    clubName: 'Handebol Taubaté',
    featured: true,
    createdAt: '2024-01-06',
    applicantIds: [],
    salary: 'R$ 6.000 - R$ 10.000/mês',
    type: 'player',
  },
  {
    id: 'opp-7',
    title: 'Técnico Principal',
    description: 'EC Pinheiros busca técnico principal para comandar a equipe masculina na próxima temporada.',
    position: 'Técnico Principal',
    requirements: 'Experiência mínima de 5 anos como técnico principal. Licença CBHb. Histórico de conquistas.',
    location: 'São Paulo, Brasil',
    contractType: '2 Temporadas',
    expirationDate: '2024-03-15',
    clubId: 'club-1',
    clubName: 'EC Pinheiros',
    featured: true,
    createdAt: '2024-01-12',
    applicantIds: [],
    salary: 'R$ 15.000 - R$ 25.000/mês',
    type: 'coach',
  },
  {
    id: 'opp-8',
    title: 'Preparador Físico',
    description: 'Handebol Taubaté busca preparador físico para integrar a comissão técnica.',
    position: 'Preparador Físico',
    requirements: 'Formação em Educação Física. CREF ativo. Experiência com handebol é diferencial.',
    location: 'Taubaté, Brasil',
    contractType: '1 Temporada',
    expirationDate: '2024-02-28',
    clubId: 'club-2',
    clubName: 'Handebol Taubaté',
    featured: false,
    createdAt: '2024-01-11',
    applicantIds: [],
    salary: 'R$ 4.000 - R$ 6.000/mês',
    type: 'coach',
  },
];

export const initialArticles: Article[] = [
  {
    id: 'article-1',
    title: 'Brasil conquista vaga olímpica no handebol masculino',
    content: `A seleção brasileira masculina de handebol garantiu sua vaga para os Jogos Olímpicos após campanha histórica no torneio qualificatório realizado na Hungria.

Em uma final emocionante, o Brasil derrotou a Hungria por 28-26, conquistando a última vaga disponível para os Jogos. A partida foi marcada pela atuação espetacular do goleiro, que defendeu dois 7 metros decisivos nos minutos finais.

O técnico da seleção destacou a evolução do handebol brasileiro nos últimos anos e a dedicação dos atletas durante todo o ciclo olímpico. "Este grupo trabalhou muito duro para chegar aqui. Enfrentamos adversidades, lesões, mas nunca perdemos o foco no nosso objetivo", declarou após a vitória.

A campanha brasileira no qualificatório foi impecável, com vitórias sobre Croácia e Japão na fase de grupos antes da grande final contra os donos da casa. A torcida húngara fez sua parte, lotando o ginásio, mas não foi suficiente para intimidar os brasileiros.

Agora, a seleção volta ao Brasil para um período de descanso antes de retomar os treinamentos visando os Jogos Olímpicos, onde enfrentará potências como França, Dinamarca e Alemanha.`,
    excerpt: 'A seleção brasileira masculina de handebol garantiu sua vaga para os Jogos Olímpicos após campanha histórica no torneio qualificatório realizado na Hungria.',
    category: 'Seleções',
    author: 'Redação HandZone',
    authorId: 'admin',
    publishedAt: '2024-01-15',
    readTime: '5 min',
    featured: true,
    status: 'approved',
    authorRole: 'admin',
  },
  {
    id: 'article-2',
    title: 'Novo formato da Liga Europeia é anunciado',
    content: `A EHF divulgou as mudanças no formato da competição que entrarão em vigor na próxima temporada, com mais equipes participantes e um novo sistema de pontos.

O novo formato prevê a expansão de 24 para 32 equipes na fase de grupos, além da introdução de playoffs antes das quartas de final. A mudança visa aumentar o número de jogos de alto nível e dar mais oportunidades para clubes de ligas menores.

Dirigentes de clubes tradicionais elogiaram a iniciativa, enquanto críticos apontam para o possível desgaste físico dos atletas com o aumento no número de partidas.`,
    excerpt: 'A EHF divulgou as mudanças no formato da competição que entrarão em vigor na próxima temporada, com mais equipes participantes.',
    category: 'Ligas',
    author: 'Redação HandZone',
    authorId: 'admin',
    publishedAt: '2024-01-14',
    readTime: '3 min',
    featured: false,
    status: 'approved',
    authorRole: 'admin',
  },
  {
    id: 'article-3',
    title: 'Transferências: Os principais movimentos do mercado',
    content: `Confira as principais contratações e transferências dos clubes brasileiros e europeus nesta janela de transferências.

O mercado de transferências do handebol está aquecido, com movimentações significativas tanto no Brasil quanto na Europa. Entre os destaques, a ida de um armador brasileiro para a Bundesliga alemã e a chegada de um pivô espanhol à Liga Nacional.

Acompanhe o resumo das principais movimentações e analise como cada clube está se preparando para a nova temporada.`,
    excerpt: 'Confira as principais contratações e transferências dos clubes brasileiros e europeus nesta janela de transferências.',
    category: 'Transferências',
    author: 'Redação HandZone',
    authorId: 'admin',
    publishedAt: '2024-01-13',
    readTime: '8 min',
    featured: false,
    status: 'approved',
    authorRole: 'admin',
  },
  {
    id: 'article-4',
    title: 'Entrevista exclusiva com o técnico da seleção',
    content: `Em conversa com o HandZone, o comandante da seleção brasileira fala sobre os próximos desafios e a preparação para as Olimpíadas.

O técnico abriu as portas do centro de treinamento para uma entrevista exclusiva, onde falou sobre metodologia de trabalho, convocações polêmicas e expectativas para os Jogos Olímpicos.

"Nosso grupo está maduro e pronto para grandes desafios. Temos uma mistura perfeita de experiência e juventude", afirmou o treinador.`,
    excerpt: 'Em conversa com o HandZone, o comandante da seleção brasileira fala sobre os próximos desafios e a preparação para as Olimpíadas.',
    category: 'Entrevistas',
    author: 'Redação HandZone',
    authorId: 'admin',
    publishedAt: '2024-01-12',
    readTime: '10 min',
    featured: false,
    status: 'approved',
    authorRole: 'admin',
  },
  {
    id: 'article-5',
    title: 'Análise tática: Como o Barcelona domina a Champions',
    content: `Um olhar detalhado sobre as estratégias que fazem do Barcelona uma das maiores potências do handebol mundial.

Através de vídeos e estatísticas, analisamos os sistemas ofensivo e defensivo do Barcelona, destacando as jogadas ensaiadas e a movimentação sem bola que caracterizam o estilo catalão.

A análise inclui comentários de ex-jogadores e especialistas táticos sobre o que torna o Barcelona tão difícil de ser batido.`,
    excerpt: 'Um olhar detalhado sobre as estratégias que fazem do Barcelona uma das maiores potências do handebol mundial.',
    category: 'Análises',
    author: 'Redação HandZone',
    authorId: 'admin',
    publishedAt: '2024-01-11',
    readTime: '7 min',
    featured: false,
    status: 'approved',
    authorRole: 'admin',
  },
  {
    id: 'article-6',
    title: 'Liga Nacional: Resultados da rodada',
    content: `Veja todos os resultados e destaques da última rodada da Liga Nacional de Handebol masculino e feminino.

A rodada foi marcada por jogos emocionantes e resultados surpreendentes. No masculino, o líder tropeçou fora de casa, enquanto no feminino a disputa pelo título segue acirrada.

Confira todos os placares, artilheiros e os próximos compromissos das equipes.`,
    excerpt: 'Veja todos os resultados e destaques da última rodada da Liga Nacional de Handebol masculino e feminino.',
    category: 'Ligas',
    author: 'Redação HandZone',
    authorId: 'admin',
    publishedAt: '2024-01-10',
    readTime: '4 min',
    featured: false,
    status: 'approved',
    authorRole: 'admin',
  },
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    participantIds: ['user-1', 'agent-1'],
    lastMessage: 'Olá! Gostaria de conversar sobre oportunidades.',
    lastMessageTime: '2024-01-15T10:30:00',
    unreadCount: 2,
  },
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    senderId: 'user-1',
    receiverId: 'agent-1',
    content: 'Olá! Gostaria de conversar sobre oportunidades.',
    timestamp: '2024-01-15T10:30:00',
    read: true,
  },
  {
    id: 'msg-2',
    senderId: 'agent-1',
    receiverId: 'user-1',
    content: 'Olá! Claro, estou à disposição. Qual seu objetivo atual na carreira?',
    timestamp: '2024-01-15T10:35:00',
    read: false,
  },
];

// Storage functions
export const getPlayers = (): Player[] => {
  const stored = localStorage.getItem('handzone_players');
  return stored ? JSON.parse(stored) : initialPlayers;
};

export const savePlayers = (players: Player[]) => {
  localStorage.setItem('handzone_players', JSON.stringify(players));
};

export const getClubs = (): Club[] => {
  const stored = localStorage.getItem('handzone_clubs');
  return stored ? JSON.parse(stored) : initialClubs;
};

export const saveClubs = (clubs: Club[]) => {
  localStorage.setItem('handzone_clubs', JSON.stringify(clubs));
};

export const getAgents = (): Agent[] => {
  const stored = localStorage.getItem('handzone_agents');
  return stored ? JSON.parse(stored) : initialAgents;
};

export const saveAgents = (agents: Agent[]) => {
  localStorage.setItem('handzone_agents', JSON.stringify(agents));
};

export const getCoaches = (): Coach[] => {
  const stored = localStorage.getItem('handzone_coaches');
  return stored ? JSON.parse(stored) : initialCoaches;
};

export const saveCoaches = (coaches: Coach[]) => {
  localStorage.setItem('handzone_coaches', JSON.stringify(coaches));
};

export const getOpportunities = (): Opportunity[] => {
  const stored = localStorage.getItem('handzone_opportunities');
  return stored ? JSON.parse(stored) : initialOpportunities;
};

export const saveOpportunities = (opportunities: Opportunity[]) => {
  localStorage.setItem('handzone_opportunities', JSON.stringify(opportunities));
};

export const getArticles = (): Article[] => {
  const stored = localStorage.getItem('handzone_articles');
  return stored ? JSON.parse(stored) : initialArticles;
};

export const saveArticles = (articles: Article[]) => {
  localStorage.setItem('handzone_articles', JSON.stringify(articles));
};

export const getConversations = (): Conversation[] => {
  const stored = localStorage.getItem('handzone_conversations');
  return stored ? JSON.parse(stored) : initialConversations;
};

export const saveConversations = (conversations: Conversation[]) => {
  localStorage.setItem('handzone_conversations', JSON.stringify(conversations));
};



export const updateArticleStatus = (id: string, status: 'approved' | 'pending') => {
  const articles = getArticles();
  const updated = articles.map(a => a.id === id ? { ...a, status } : a);
  saveArticles(updated);
};



export const getMessages = (): Message[] => {
  const stored = localStorage.getItem('handzone_messages');
  return stored ? JSON.parse(stored) : initialMessages;
};

export const saveMessages = (messages: Message[]) => {
  localStorage.setItem('handzone_messages', JSON.stringify(messages));
};

// Admin helper to get "all users" as a unified list
export const getAllUserProfiles = () => {
  return [
    ...getPlayers().map(p => ({ ...p, userCategory: 'player' })),
    ...getAgents().map(a => ({ ...a, userCategory: 'agent' })),
    ...getClubs().map(c => ({ ...c, userCategory: 'club' })),
    ...getCoaches().map(c => ({ ...c, userCategory: 'coach' })),
  ];
};

// Positions list for filters
export const POSITIONS = [
  'Goleiro',
  'Ponta Esquerda',
  'Armador Esquerdo',
  'Armador Central',
  'Armador Direito',
  'Ponta Direita',
  'Pivô',
];

export const COACH_SPECIALIZATIONS = [
  'Técnico Principal',
  'Técnico Assistente',
  'Técnico de Goleiros',
  'Preparador Físico',
  'Analista de Desempenho',
  'Fisioterapeuta',
];

export const COUNTRIES = [
  'Brasil',
  'Argentina',
  'Chile',
  'Espanha',
  'França',
  'Alemanha',
  'Portugal',
];

export const LEVELS = ['Amador', 'Semiprofissional', 'Profissional'];

export const STATUSES = ['Disponível', 'Contrato atual', 'Buscando clube', 'Em negociação'];
