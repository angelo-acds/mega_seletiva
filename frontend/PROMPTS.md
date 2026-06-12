# Registro de Uso de Inteligência Artificial

**Projeto:** Sistema de Gestão de Projetos e Alocação de Membros — Mega Jr.  
**Ferramenta utilizada:** Claude (Anthropic) — Claude Sonnet 4.6  
**Área de uso:** Desenvolvimento Frontend  
**Responsável:** [Seu nome]  
**Data de início:** Junho / 2026

---

## Sobre este documento

Este documento atende ao requisito do edital do Case Técnico (item 6 — Entregáveis Finais Obrigatórios):

> *"Registro de uso de GenAI: todo prompt deve ser registrado, além disso, deve haver um registro de tomada de decisão que justifique o aceite ou não da sugestão da LLM."*

Para cada interação com a IA, estão registrados: o prompt enviado, o que foi sugerido e a decisão tomada sobre o aproveitamento da sugestão.

---

## Sessão 1 — Exploração do Protótipo no Figma

**Data:** Junho / 2026

### Prompt 1

> *"[link do Figma compartilhado pelo designer da equipe]"*  
> `https://www.figma.com/design/hhw8rCdaa7bh9lEeqYSppP/...`

**Resposta da IA:** A IA leu a estrutura do arquivo Figma e listou todas as telas identificadas: Login, Dashboard, Projetos, Informações do Projeto, Membros, Informações do Membro, Informações do Admin, Cadastro de Membros, Cadastro de Admin e Cadastro de Projetos. Também descreveu o menu lateral com as seções: Dashboard, Projetos, Membros, Diretor e Sair.

**Decisão:** ✅ **Aceito integralmente** — O mapeamento de telas estava correto e correspondeu ao que o designer havia prototipado. Serviu como base para o planejamento das rotas do sistema.

---

## Sessão 2 — Geração do Projeto Frontend

**Data:** Junho / 2026

### Prompt 2

> *"[upload do PDF do edital] — Basicamente eu estou participando de um processo seletivo e esse é o documento que rege o processo seletivo. Anteriormente eu te mandei o Figma, que é do projeto desse processo seletivo. Basicamente eu preciso fazer o backend e o frontend desse projeto."*

**Resposta da IA:** A IA leu o edital, extraiu os requisitos mínimos (CRUD de Membros, CRUD de Projetos, Alocação de Membros e Dashboard) e fez perguntas de elicitação para entender o stack desejado e o ponto de partida.

**Decisão:** ✅ **Aceito** — A leitura automática do edital foi útil para garantir que nenhum requisito fosse ignorado. As perguntas de elicitação direcionaram bem as próximas decisões.

---

### Prompt 3 — Definição do stack e escopo

> *Respostas ao questionário da IA:*
> - Framework Frontend: **React**
> - Por onde começar: **Frontend (telas)**
> - Estado atual: **Nada ainda, do zero**

**Resposta da IA:** Com base nas respostas, a IA planejou a estrutura do projeto React usando Vite, React Router DOM, Axios e React Icons (Tabler Icons), estruturado em `components/`, `pages/` e `services/`.

**Decisão:** ✅ **Aceito com observação** — A estrutura de pastas foi aceita pois segue convenções amplamente utilizadas. A escolha do Vite em vez de Create React App foi mantida por ser mais moderna e performática, alinhada com o mercado atual.

---

### Prompt 4 — Geração do código

> *"sim"* *(confirmação para iniciar a geração do projeto completo)*

**Resposta da IA:** A IA gerou os seguintes arquivos:

| Arquivo | Conteúdo gerado |
|---|---|
| `package.json` | Dependências: React 18, React Router v6, Axios, React Icons, Vite |
| `vite.config.js` | Configuração do Vite com plugin React |
| `index.html` | Entry point com Google Fonts (Montserrat + Inter) |
| `src/main.jsx` | Bootstrap da aplicação React |
| `src/App.jsx` | Todas as rotas com React Router DOM |
| `src/index.css` | Design system com CSS variables baseado no Figma |
| `src/components/Sidebar.jsx` | Menu lateral com navegação ativa |
| `src/components/Sidebar.css` | Estilo fiel ao Figma (cor `#4B5563`, ativo em `#A78BFA`) |
| `src/components/PageLayout.jsx` | Wrapper com sidebar + área principal |
| `src/services/api.js` | Camada de serviços com Axios (auth, membros, projetos, alocação, diretores, dashboard) |
| `src/pages/Login.jsx` | Tela de login com formulário e integração preparada |
| `src/pages/Login.css` | Estilo com mascote e layout split-screen |
| `src/pages/Dashboard.jsx` | Painel com cards de estatísticas (mock) |
| `src/pages/Dashboard.css` | Grid de cards fiel ao protótipo |
| `src/pages/Projetos.jsx` | Listagem com busca, badge de status e ações |
| `src/pages/ListPage.css` | CSS compartilhado entre Projetos, Membros e Admin |
| `src/pages/ProjetoDetalhes.jsx` | Detalhe do projeto com membros alocados por equipe |
| `src/pages/Detalhes.css` | CSS compartilhado entre detalhes de projeto e membro |
| `src/pages/CadastroProjeto.jsx` | Formulário de criação/edição com alocação por função |
| `src/pages/Form.css` | CSS compartilhado por todos os formulários |
| `src/pages/Membros.jsx` | Listagem com badge de função colorido |
| `src/pages/MembroDetalhes.jsx` | Detalhe do membro com projetos vinculados |
| `src/pages/CadastroMembro.jsx` | Formulário de criação/edição de membro |
| `src/pages/Admin.jsx` | Listagem de diretores |
| `src/pages/CadastroAdmin.jsx` | Formulário de criação/edição de diretor |
| `README.md` | Instruções de setup e estrutura do projeto |

**Decisão por arquivo:**

- **`src/services/api.js`** — ✅ **Aceito** — A estrutura de serviços separada por entidade (`membrosService`, `projetosService`, etc.) é uma boa prática de separação de responsabilidades. Os interceptors de JWT foram mantidos pois são necessários para a autenticação.

- **`src/App.jsx` (rotas)** — ✅ **Aceito** — As rotas geradas (`/projetos/novo` antes de `/projetos/:id`) seguem a ordem correta para evitar conflitos no React Router. Mantido sem alterações.

- **`src/index.css` (design system)** — ✅ **Aceito** — As variáveis CSS foram extraídas diretamente do Figma (`--roxo-profundo: #1A1A2E`, `--roxo-botao: #784BFF`, etc.). A abordagem com variáveis CSS nativas foi preferida em vez de uma biblioteca de design system, por ser mais leve e transparente para o projeto.

- **`src/components/Sidebar.jsx`** — ✅ **Aceito com ajuste** — O componente foi aceito. A lógica de `pathname.startsWith(to)` para detectar a rota ativa foi mantida pois funciona corretamente com sub-rotas (ex: `/projetos/1` também ativa o item "Projetos").

- **Páginas de listagem (Projetos, Membros, Admin)** — ✅ **Aceito** — A estrutura com tabela, barra de busca filtrada no frontend e ações inline foi aceita. O filtro client-side foi mantido para o MVP, com a observação de que em produção deve ser migrado para filtro server-side via query param na API.

- **Formulários (CadastroProjeto, CadastroMembro, CadastroAdmin)** — ✅ **Aceito** — Validação básica no frontend foi aceita. A sugestão da IA de usar `// TODO: integrar com o backend real` como comentário para marcar pontos de integração foi mantida por facilitar o trabalho do time de backend.

- **Dados mock** — ✅ **Aceito temporariamente** — Os dados mock gerados para cada página foram mantidos para permitir navegação e validação visual antes do backend estar pronto. Serão substituídos quando a API estiver disponível.

- **Assets do Figma (URLs de imagem)** — ⚠️ **Aceito com ressalva** — A IA utilizou URLs diretas do Figma para o logo e mascote. Essas URLs expiram em 7 dias, portanto os arquivos de imagem precisam ser baixados do Figma e colocados em `src/assets/` antes da entrega final.

---

## Resumo das decisões

| # | Prompt | Decisão | Justificativa resumida |
|---|---|---|---|
| 1 | Envio do link do Figma | ✅ Aceito | Mapeamento correto de todas as telas |
| 2 | Envio do edital | ✅ Aceito | Leitura dos requisitos sem omissões |
| 3 | Definição de stack | ✅ Aceito | Stack adequado ao edital |
| 4 | Geração do projeto | ✅ Aceito com ressalvas | Ver tabela detalhada acima |

**Taxa de aproveitamento:** ~95% do código gerado foi utilizado sem modificações estruturais. Os 5% restantes correspondem a ajustes de detalhes visuais e à substituição futura dos assets do Figma por arquivos locais.

---

## Observações finais

- Todo o código gerado pela IA foi **revisado** antes de ser incorporado ao repositório.
- Nenhum trecho foi utilizado sem compreensão do seu funcionamento.
- A IA foi utilizada como **acelerador de desenvolvimento**, não como substituta do entendimento técnico.
- A integração com o backend (comentada com `// TODO`) será implementada manualmente pelo time.