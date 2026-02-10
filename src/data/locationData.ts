export interface LocationData {
    [country: string]: {
        [state: string]: string[];
    };
}

export const locationData: LocationData = {
    "Brasil": {
        "Acre": ["Rio Branco", "Cruzeiro do Sul", "Sena Madureira"],
        "Alagoas": ["Maceió", "Arapiraca", "Palmeira dos Índios"],
        "Amapá": ["Macapá", "Santana", "Laranjal do Jari"],
        "Amazonas": ["Manaus", "Parintins", "Itacoatiara"],
        "Bahia": ["Salvador", "Feira de Santana", "Vitória da Conquista"],
        "Ceará": ["Fortaleza", "Caucaia", "Juazeiro do Norte"],
        "Distrito Federal": ["Brasília"],
        "Espírito Santo": ["Vitória", "Vila Velha", "Serra"],
        "Goiás": ["Goiânia", "Aparecida de Goiânia", "Anápolis"],
        "Maranhão": ["São Luís", "Imperatriz", "Timon"],
        "Mato Grosso": ["Cuiabá", "Várzea Grande", "Rondonópolis"],
        "Mato Grosso do Sul": ["Campo Grande", "Dourados", "Três Lagoas"],
        "Minas Gerais": ["Belo Horizonte", "Uberlândia", "Contagem"],
        "Pará": ["Belém", "Ananindeua", "Santarém"],
        "Paraíba": ["João Pessoa", "Campina Grande", "Santa Rita"],
        "Paraná": ["Curitiba", "Londrina", "Maringá"],
        "Pernambuco": ["Recife", "Jaboatão dos Guararapes", "Olinda"],
        "Piauí": ["Teresina", "Parnaíba", "Picos"],
        "Rio de Janeiro": ["Rio de Janeiro", "São Gonçalo", "Duque de Caxias"],
        "Rio Grande do Norte": ["Natal", "Mossoró", "Parnamirim"],
        "Rio Grande do Sul": ["Porto Alegre", "Caxias do Sul", "Canoas"],
        "Rondônia": ["Porto Velho", "Ji-Paraná", "Ariquemes"],
        "Roraima": ["Boa Vista", "Rorainópolis", "Caracaraí"],
        "Santa Catarina": ["Florianópolis", "Joinville", "Blumenau"],
        "São Paulo": ["São Paulo", "Guarulhos", "Campinas", "São Bernardo do Campo", "Santo André", "São José dos Campos"],
        "Sergipe": ["Aracaju", "Nossa Senhora do Socorro", "Lagarto"],
        "Tocantins": ["Palmas", "Araguaína", "Gurupi"]
    },
    "Alemanha": {
        "Baviera": ["Munique", "Nuremberg", "Augsburg"],
        "Berlim": ["Berlim"],
        "Hamburgo": ["Hamburgo"],
        "Hesse": ["Frankfurt", "Wiesbaden", "Kassel"]
    },
    "Espanha": {
        "Catalunha": ["Barcelona", "Girona", "Lleida"],
        "Madrid": ["Madrid", "Alcalá de Henares", "Móstoles"],
        "Andaluzia": ["Sevilha", "Málaga", "Córdoba"]
    },
    "França": {
        "Île-de-France": ["Paris", "Boulogne-Billancourt", "Saint-Denis"],
        "Provença-Alpes-Costa Azul": ["Marselha", "Nice", "Toulon"],
        "Auvérnia-Ródano-Alpes": ["Lyon", "Grenoble", "Saint-Étienne"]
    },
    "Portugal": {
        "Lisboa": ["Lisboa", "Sintra", "Cascais"],
        "Porto": ["Porto", "Vila Nova de Gaia", "Matosinhos"],
        "Braga": ["Braga", "Guimarães", "Famalicão"]
    },
    "Argentina": {
        "Buenos Aires": ["Buenos Aires", "La Plata", "Mar del Plata"],
        "Córdoba": ["Córdoba", "Villa Carlos Paz", "Río Cuarto"],
        "Santa Fe": ["Rosário", "Santa Fe", "Venado Tuerto"]
    },
    "Estados Unidos": {
        "Califórnia": ["Los Angeles", "São Francisco", "San Diego"],
        "Nova York": ["Nova York", "Buffalo", "Rochester"],
        "Flórida": ["Miami", "Orlando", "Tampa"]
    }
};

export const countries = Object.keys(locationData);
