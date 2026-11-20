export type Experience = {
  title: string
  company: string
  location: string
  period: string
  description: string
  bullets: string[]
}

export type Education = {
  title: string
  institution: string
  location: string
  period: string
  area?: string
}

export type Certification = {
  title: string
  institution: string
  date: string
  description: string
  bullets: string[]
}

export type Community = {
  title: string
  period: string
  location?: string
  description: string
  bullets: string[]
}

export const profile = {
  about: `Sou Rafael Quiosa, Desenvolvedor Backend e Especialista em Segurança Web, com experiência em engenharia de software, desenvolvimento de aplicações e suporte de infraestruturas de TI.

Entrego arquiteturas escaláveis, desenvolvimento de APIs RESTful com Node.js, TypeScript e Python, integração de bases de dados e auditoria de código com foco em Secure Coding e OWASP Top 10.

Tenho experiência em administração de sistemas Linux via CLI, automação de tarefas com Shell Scripting e Python, manutenção preventiva de infraestruturas e articulação com equipas de redes, desenvolvimento e partes interessadas do negócio.

Também atuo no desenvolvimento frontend com React, TypeScript, Vite e Tailwind CSS, com foco em interfaces de alta performance, estruturação modular, Git/GitHub e produtos digitais.

Sou fluente em Português e tenho proficiência em Inglês.`,
  location: 'Luanda, Angola',
  languages: ['Português — Fluente', 'Inglês — Proficiência'],
  skills: {
    'Linguagens & Runtimes': ['JavaScript (ES6+)', 'TypeScript', 'Node.js', 'Python', 'C++', 'Java', 'SQL', 'Shell Scripting'],
    'Web & Frontend': ['HTML5', 'CSS3', 'Tailwind CSS', 'React', 'Next.js', 'Vite'],
    'Frameworks & Backend': ['Express', 'Flask', 'APIs RESTful', 'JSON Web Tokens (JWT)'],
    'Bases de Dados': ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server'],
    'Segurança & Redes': ['OWASP Top 10', 'Web Hacking', 'Pentesting', 'Hardening de Sistemas', 'Burp Suite', 'Nmap', 'Wireshark'],
    'Sistemas & Ferramentas': ['Linux', 'Kali Linux', 'Ubuntu CLI', 'Windows Server', 'Git', 'GitHub', 'VS Code'],
  },
}

export const experiences: Experience[] = [
  {
    title: 'Programador Web',
    company: 'International Business Consulting, Lda (IBC)',
    location: 'Luanda, Angola',
    period: '13/07/2026 — Atual',
    description: 'Concepção, arquitetura e desenvolvimento do website institucional da empresa.',
    bullets: [
      'Planeamento de conteúdos, estratégia de comunicação digital e fortalecimento da presença online da marca.',
      'Integração de tecnologia e comunicação para alinhamento com os objetivos estratégicos de investimento da IBC.',
      'Arquitetura web moderna alinhada a padrões de UI/UX, SEO e segurança da informação.',
      'Hardening do ambiente web e otimização de performance para carregamento rápido e acesso seguro.',
    ],
  },
  {
    title: 'Desenvolvedor Backend & Segurança Web (Freelancer)',
    company: 'Atuação Autónoma',
    location: 'Luanda, Angola — Remoto',
    period: '01/01/2026 — 13/07/2026',
    description: 'Desenvolvimento de APIs RESTful e pesquisa aplicada em segurança de aplicações.',
    bullets: [
      'Desenvolvimento de APIs RESTful utilizando Node.js, TypeScript e Python, focando em performance e modularidade.',
      'Análise de segurança web, auditoria de código (Secure Coding), autenticação via JWT e mitigação de falhas do OWASP Top 10.',
      'Administração de servidores Linux, automação de tarefas com Shell Scripting e gestão de bases de dados PostgreSQL/MySQL.',
      'Concepção, testes e auditoria de microsserviços e APIs RESTful resilientes, integrando boas práticas de Secure Coding e defesa em profundidade.',
    ],
  },
  {
    title: 'Analista de Suporte de TI / Técnico de TI',
    company: 'Fenix Mobile / Fenix Tek Srl',
    location: 'Camama, Luanda, Angola',
    period: '05/01/2023 — 13/11/2025',
    description: 'Manutenção preventiva/corretiva de infraestruturas computacionais e suporte técnico N1/N2.',
    bullets: [
      'Instalação, configuração, diagnóstico e hardening de ambientes Linux e Windows Server.',
      'Gestão de redes locais (LAN), cabeamento estruturado e configuração de roteadores/switches.',
      'Automação de processos de suporte através de scripts, gestão de rotinas de backup e mitigação de incidentes corporativos.',
      'Manutenção preventiva e corretiva de infraestruturas computacionais e suporte técnico N1/N2.',
    ],
  },
]

export const education: Education[] = [
  {
    title: 'Bacharel',
    institution: 'Instituto Superior Politécnico de Tecnologias e Ciências (ISPTEC)',
    location: 'Luanda, Angola',
    period: '17/02/2019 — 22/07/2022',
    area: 'Desenvolvimento e análise de software e aplicações informáticas',
  },
  {
    title: 'Técnico em Comunicação Social',
    institution: 'IMAG — Instituto Médio de Administração & Gestão',
    location: 'Angola',
    period: 'Formação técnica',
    area: 'Ciências sociais, jornalismo e informação sem definição precisa',
  },
]

export const certifications: Certification[] = [
  {
    title: 'Formação em Cibersegurança & Defesa de Infraestruturas',
    institution: 'Hacker do Bem',
    date: '25/03/2025',
    description: 'Capacitação prática em fundamentos de cibersegurança, defesa em profundidade, segurança de redes e ethical hacking.',
    bullets: [
      'Estudo de vulnerabilidades do OWASP Top 10, proteção de dados e resposta a incidentes.',
      'Aplicação de conceitos de segurança defensiva e mitigação de riscos em ecossistemas corporativos.',
    ],
  },
  {
    title: 'Linux Unhatched',
    institution: 'Cisco Networking Academy',
    date: '07/04/2026',
    description: 'Certificação sobre fundamentos e administração do sistema operativo Linux.',
    bullets: [
      'Navegação e comandos avançados de linha de comando (Linux CLI).',
      'Gestão de ficheiros, permissões de sistema, utilizadores e automação básica de tarefas de infraestrutura.',
    ],
  },
  {
    title: 'Introduction to Cybersecurity',
    institution: 'Cisco Networking Academy',
    date: '11/06/2026',
    description: 'Certificação introdutória cobrindo os pilares essenciais da cibersegurança e proteção da informação.',
    bullets: [
      'Confidencialidade, integridade e disponibilidade (Tríade CIA).',
      'Análise de ameaças de rede, malware, engenharia social e estratégias de defesa cibernética.',
    ],
  },
  {
    title: 'Programa Intensivo de Engenharia de Software, Inglês & Mandarim',
    institution: 'UNIJOB',
    date: '01/02/2026',
    description: 'Programa de formação técnica e linguística intensiva focado na preparação para o mercado de tecnologia global.',
    bullets: [
      'Aprofundamento em arquitetura e desenvolvimento de software, estruturas de dados e boas práticas de programação.',
      'Capacitação avançada em Língua Inglesa e princípios fundamentais de Língua Mandarim.',
    ],
  },
]

export const volunteering: Community[] = [
  {
    title: 'Planeta Consciente',
    period: '14/07/2024 — Atual',
    location: 'Angola',
    description: 'Coordenação logística e operacional de ações ambientais e eventos comunitários.',
    bullets: [
      'Planeamento e execução de ações ambientais, assegurando aprovisionamento, transporte e alocação eficiente de recursos.',
      'Liderança de operações e fluxos operacionais para iniciativas sustentáveis.',
      'Direção de voluntários e equipas de apoio nas operações de campo.',
      'Gestão de inventário de equipamentos e materiais da organização.',
    ],
  },
  {
    title: 'Comunidade Académica e Técnica de Cibersegurança & Open Source',
    period: '01/01/2026 — Atual',
    location: 'Luanda, Angola',
    description: 'Apoio voluntário a estudantes e iniciantes na área de tecnologia, com foco em programação e segurança digital.',
    bullets: [
      'Auxílio no estudo prático de lógica de programação, estruturas de dados em C/C++, Python e comandos fundamentais de Linux.',
      'Disseminação de boas práticas de segurança na internet, consciencialização sobre engenharia social e proteção de dados pessoais.',
    ],
  },
  {
    title: 'Maratona de Inovação & Hackathons de Tecnologia Aberta',
    period: 'Participação',
    description: 'Concepção, arquitetura e prototipagem rápida de soluções tecnológicas orientadas a desafios urbanos, ecologia e impacto social.',
    bullets: [
      'Criação de interfaces dinâmicas em React, TypeScript e Tailwind CSS conectadas a APIs RESTful.',
      'Definição de MVP, arquitetura de bases de dados e integração de funcionalidades serverless em prazos de 24h a 48h.',
      'Defesa da arquitetura de software e viabilidade técnica dos projetos perante júris e mentores.',
    ],
  },
  {
    title: 'Piscine 42 Luanda — Imersão Intensiva em Engenharia de Software',
    period: 'Participação',
    description: 'Boot camp e processo de imersão intensivo focado em fundamentos de programação e resolução de problemas.',
    bullets: [
      'Desenvolvimento de algoritmos e gestão de memória em C em ambiente de terminal Linux.',
      'Resolução de desafios de lógica e engenharia de software sob pressão e prazos rigorosos.',
      'Trabalho colaborativo através da metodologia Peer-to-Peer e controlo de versões com Git e GitHub.',
    ],
  },
]
