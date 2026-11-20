export type Project = {
  slug: string
  title: string
  category: string
  subtitle: string
  description: string
  tags: string[]
  details: string[]
  github?: string
  live?: string
  link?: string | null
  cover?: { mediaUrl: string; variants?: Record<string,string>; alt: string } | null
}

export const projects: Project[] = [
  {
    slug: 'angola-ecomapeamento',
    title: 'Angola EcoMapeamento',
    category: 'Frontend & Dados',
    subtitle: 'Mapeamento urbano e gestão ambiental',
    description: 'Plataforma ecossistémica de mapeamento urbano e gestão ambiental de Angola, focada na centralização e análise de dados geospaciais ecológicos.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Git', 'GitHub'],
    details: [
      'Liderança do desenvolvimento frontend da plataforma.',
      'Arquitetura e construção de interfaces de alta performance com suporte a dados dinâmicos.',
      'Implementação de pipelines organizadas de controlo de versão via Git/GitHub aplicando Gitflow.',
      'Otimização do tempo de carregamento de componentes e estruturação modular de código para escalabilidade contínua.',
    ],
  },
  {
    slug: 'website-institucional-ibc',
    title: 'Website Institucional IBC',
    category: 'Web & Arquitetura',
    subtitle: 'Portal corporativo para presença digital internacional',
    description: 'Engenharia e implementação ponta a ponta do portal corporativo oficial da International Business Consulting.',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'UI/UX', 'SEO', 'Security'],
    details: [
      'Concepção, arquitetura e desenvolvimento do website institucional.',
      'Arquitetura web moderna alinhada a padrões rigorosos de UI/UX, SEO e segurança da informação.',
      'Integração entre infraestrutura de tecnologia e comunicação corporativa.',
      'Hardening do ambiente web e otimização de performance para carregamento rápido e acesso seguro.',
    ],
  },
  {
    slug: 'backend-seguro',
    title: 'Desenvolvimento & Arquitetura Backend Segura',
    category: 'Backend & DevSecOps',
    subtitle: 'APIs RESTful resilientes e autenticação segura',
    description: 'Concepção, testes e auditoria de microsserviços e APIs RESTful com foco em Secure Coding e defesa em profundidade.',
    tags: ['Node.js', 'TypeScript', 'Python', 'PostgreSQL', 'MySQL', 'MariaDB', 'JWT', 'OWASP'],
    details: [
      'Desenvolvimento de APIs escaláveis com Node.js, TypeScript e Python.',
      'Persistência de dados em PostgreSQL, MySQL e MariaDB.',
      'Implementação de autenticação baseada em JSON Web Tokens (JWT).',
      'Mitigação ativa de vulnerabilidades críticas do OWASP Top 10.',
      'Configuração e administração CLI de servidores Linux e automação com Shell/Python.',
    ],
  },
  {
    slug: 'auditoria-web-owasp',
    title: 'Laboratório Prático de Auditoria Web & OWASP Top 10',
    category: 'Cibersegurança',
    subtitle: 'Web Hacking em ambientes controlados',
    description: 'Concepção e execução de auditorias práticas de segurança em aplicações web em ambientes controlados.',
    tags: ['OWASP Top 10', 'Burp Suite', 'FoxyProxy', 'Gobuster', 'Kali Linux', 'Pentesting'],
    details: [
      'Prática em PortSwigger Web Security Academy e laboratórios locais.',
      'Identificação e exploração ética de SQL Injection, XSS, Broken Authentication e manipulação de JWT.',
      'Análise e interceptação de tráfego com Burp Suite e FoxyProxy.',
      'Reconhecimento e enumeração com Gobuster e ferramentas de terminal.',
      'Elaboração de rotinas de mitigação e aplicação de princípios de Secure Coding.',
    ],
  },
  {
    slug: 'hardening-linux-redes',
    title: 'Hardening de Infraestruturas Linux & Análise de Redes',
    category: 'Infraestrutura & Segurança',
    subtitle: 'Defesa de servidores e redes',
    description: 'Projeto de prática aplicada em hardening de servidores Linux e análise de redes corporativas e locais.',
    tags: ['Linux', 'SSH', 'Firewall', 'Nmap', 'Wireshark', 'Shell', 'Python'],
    details: [
      'Configuração de permissões avançadas e gestão de acessos SSH.',
      'Implementação de regras de firewall e monitorização de logs via CLI.',
      'Varreduras de rede e análise de pacotes com Nmap e Wireshark.',
      'Deteção de portas abertas, serviços vulneráveis e anomalias de tráfego.',
      'Automação de tarefas de suporte, auditoria e backups de segurança com Shell Script e Python.',
    ],
  },
  {
    slug: 'bug-bounty-pentesting',
    title: 'Pesquisa & Prática em Bug Bounty e Pentesting Web',
    category: 'AppSec',
    subtitle: 'Reconhecimento, APIs e vulnerabilidades',
    description: 'Atuação e pesquisa independente em metodologias de teste de penetração e reconhecimento em plataformas de Bug Bounty.',
    tags: ['Kali Linux', 'Bug Bounty', 'HackerOne', 'BOLA/IDOR', 'APIs RESTful', 'PoC'],
    details: [
      'Reconhecimento e enumeração de ativos web utilizando Kali Linux e ferramentas de terminal.',
      'Análise de arquiteturas RESTful para identificação de falhas de autorização ao nível do objeto (BOLA/IDOR).',
      'Investigação de potenciais vazamentos de dados sensíveis.',
      'Documentação técnica de falhas com relatórios de Proof of Concept e recomendações de remediação.',
    ],
  },
]
