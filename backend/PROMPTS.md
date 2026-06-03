# Documentação de Uso de GenAI e Prompt Engineering

Neste projeto, utilizamos ferramentas de IA como assistentes de desenvolvimento (Pair Programming). Abaixo estão registrados os blocos de prompts, as estratégias de engenharia de prompt utilizadas e as justificativas das decisões tomadas pela equipe de desenvolvimento.

---

## Registro 1: Modelagem do Banco de Dados e Escolha do SGBD

### 1. Estratégia de Prompting
* **Técnica Utilizada:** Role-play (Definição de Papel) + Restrição de Contexto.
* **Prompt Enviado:** > *"Como desenvolvedor Back-End sênior em Node.js, me ajude a estruturar um modelo para o Prisma ORM que salve membros da empresa júnior. O cadastro precisa de nome, e-mail, função e RGA de 12 dígitos usando MongoDB."*

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA sugeriu um modelo inicial utilizando o banco NoSQL MongoDB com os campos `firstName` e `lastName`.
* **Análise Individual (Aceite/Recusa):**
  * **Modificação/Recusa Parcial:** Ao analisar as interfaces do Figma entregues pelo Designer da equipe, notei que o campo de nome era único e que o edital da Mega Jr. exigia estritamente a trilha de PostgreSQL (pág. 3 e 6 do edital). 
  * **Justificativa da Decisão:** Decidi rejeitar o MongoDB e mudar a modelagem para PostgreSQL. Além disso, ajustei a propriedade de nome para um único campo (`name`) e adicionei uma tabela intermediária de `Alocacao` para garantir a regra de negócio de que um membro só pode exercer uma única função por projeto, blindando a arquitetura do MVP contra o edital.

---

## Registro 2: Segurança no Módulo de Diretor (Login)

### 1. Estratégia de Prompting
* **Técnica Utilizada:** Contextualização de Requisitos de Segurança.
* **Prompt Enviado:**
  > *"Tenho uma tela de login onde apenas o Diretor pode acessar o site. Como devo estruturar o modelo do Diretor em Node.js e Prisma garantindo a segurança de autenticação?"*

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA sugeriu a criação do modelo com criptografia `bcrypt` e uma função de verificação de hash.
* **Análise Individual (Aceite/Recusa):**
  * **Aceite Integral:** Aceitei a sugestão. Salvar senhas em texto limpo violaria os critérios de segurança e qualidade de código exigidos no item 5 do edital. A implementação do `bcrypt` eleva o MVP para um padrão profissional de mercado.
## Registro 2: Segurança no Módulo de Diretor (Login)

### 1. Estratégia de Prompting
Prompt Enviado:
  > "Tenho uma tela de login onde apenas o Diretor pode acessar o site. Como devo estruturar o modelo do Diretor em Node.js e Prisma garantindo a segurança de autenticação?"

### 2. Resposta da IA e Tomada de Decisão
Sugestão da IA: A IA sugeriu a criação do modelo com criptografia `bcrypt` e uma função de verificação de hash.
Análise Individual (Aceite/Recusa):Aceite Integral: Aceitei a sugestão. Salvar senhas em texto limpo violaria os critérios de segurança e qualidade de código exigidos no item 5 do edital. A implementação do `bcrypt` eleva o MVP para um padrão profissional de mercado.



## Registro 3: Inteligência de Agregação no Dashboard

### 1. Estratégia de Prompting
* **Estratégia Utilizada:** Contextualização Visual e Mapeamento de Requisitos Ocultos.
* **Prompt Enviado:** > *"Vou te mandar a imagem do Dashboard do Figma primeiro, talvez seja o mais difícil de implementar por ter que ter tudo prévio antes, o que me diz? Precisa ver as listagens antes de tirar alguma conclusão?"*

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA analisou o layout e sugeriu criar uma rota de agregação com filtros baseados em um campo de status para projetos, além de realizar contagens dinâmicas na tabela de alocações para descobrir quais desenvolvedores estavam trabalhando ou esperando.
* **Análise Individual (Aceite/Recusa):**
  * **Aceite com Adaptação Cadastral:** Aceitei a lógica de agregação do modelo. No entanto, percebi que meu arquivo `schema.prisma` original não possuía suporte nativo para monitorar o andamento dos projetos.
  * **Justificativa da Decisão:** Modifiquei o modelo de dados de `Projeto`, adicionando o campo `status` com o valor padrão "Criado" (podendo evoluir para "Em Progresso" e "Concluído"). Isso me permitiu criar uma query limpa usando JavaScript puro para alimentar os contadores exatamente como o Designer desenhou no layout, sem inflar o banco de dados.

---

## Registro 4: Mapeamento da Interface "inf. projeto" e Resposta Estruturada

### 1. Estratégia de Prompting
* **Estratégia Utilizada:** Engenharia de Prompt baseada em Fluxo de Navegação (Inputs/Outputs).
* **Prompt Enviado:** > *"Entendi o que você quis dizer, antes de implementar isso vou te enviar o inf. projeto que é o que acontece quando eu clico no nome de um projeto específico."*

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA sugeriu um método de busca por ID clássico trazendo um array plano com todos os membros alocados naquele projeto.
* **Análise Individual (Aceite/Recusa):**
  * **Recusa Parcial e Refatoração de Arquitetura:** Rejeitei a entrega de dados em formato plano. Ao analisar minuciosamente a tela de `inf. projeto` do Figma, notei que o layout exigia os membros estritamente agrupados em "caixas" por suas respectivas equipes operacionais (`Equipe Back`, `Equipe Front`, `Equipe Designer`, etc.).
  * **Justificativa da Decisão:** Forcei o modelo no Backend a processar e reestruturar o objeto de retorno através de um mapeamento de chaves (`Map`). Dessa forma, o Backend entrega o JSON totalmente mastigado e separado por equipes para o Frontend. Isso poupa o processamento do lado do cliente (navegador) e simplifica drasticamente a construção dos loops no código do meu parceiro de equipe.

---

## Registro 5: Refatoração Relacional do Diretor e Resolução de Conflitos na Migration

### 1. Estratégia de Prompting
* **Estratégia Utilizada:** Resolução de Erros de Ambiente e Validação de Tipagem Estrita.
* **Prompt Enviado:** > *"Como que atualiza no terminal o que altera no banco de dados mesmo? [Envio do código do schema.prisma com erros e logs de erro do terminal sobre DIRECT_URL]"*

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA identificou erros de sintaxe no meu modelo de Diretor, problemas de acoplamento rígido na tabela intermediária (exigindo membro e diretor na mesma linha) e uma falha de carregamento de variáveis de ambiente gerada pela extensão `prisma.config.ts`.
* **Análise Individual (Aceite/Recusa):**
  * **Aceite Crítico e Correção de Ambiente:** Aceitei as correções estruturais tornando os relacionamentos da tabela `Alocacao` opcionais (`membroId?` e `diretorId?`), permitindo que a mesma tabela sirva para alocar membros comuns ou diretores de forma independente. 
  * **Justificativa da Decisão:** Adicionei restrições de unicidade compostas (`@@unique`) para blindar o banco contra alocações duplicadas. Além disso, contornei o travamento do terminal utilizando comandos avançados do Git Bash (`grep` e `xargs`) para ignorar comentários do arquivo `.env` e forçar a injeção manual das chaves de acesso. Com isso, sincronizei com sucesso o schema físico no Supabase, garantindo um CRUD robusto e sem risco de dados órfãos através da regra `Cascade`.

  ---

## Registro 6: Arquitetura Modular de Rotas com Express Router

### 1. Estratégia de Prompting
* **Técnica Utilizada:** Integração de Componentes e Organização de Arquivos (Modularização).
* **Prompt Enviado:** Envio da árvore de arquivos estruturada do VS Code contendo a pasta `routes` criada com sucesso e solicitação de início de implementação dos arquivos de rotas individuais.

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA sugeriu a criação de um arquivo isolado para as rotas de Diretores utilizando o `express.Router()`, implementando o tratamento de erros HTTP (`try/catch`) e retornos com códigos de status semânticos (200, 201, 400, 401, 500).
* **Análise Individual (Aceite/Recusa):**
  * **Aceite Integral:** Aceitei o design de rotas proposto. Separar os arquivos de endpoints por recurso (Diretores, Membros, Projetos) evita que o arquivo principal `express.js` vire um monolito confuso de milhares de linhas, facilitando a manutenção e futuras auditorias de código pela equipe avaliadora.

  ---

## Registro 7: Ajuste de Regra de Negócio na Tela "inf. projeto"

### 1. Estratégia de Prompting
* **Técnica Utilizada:** Refinamento de Requisitos Baseado em Alinhamento de Equipe.
* **Prompt Enviado:** Modificação crítica do desenvolvedor alertando que a ação de exclusão na tela de `inf. projeto` corresponde à desalocação de um membro da equipe, e não à deleção do projeto completo.

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA compreendeu o mapeamento visual correto e sugeriu a criação de um endpoint do tipo `DELETE` apontando diretamente para o ID da tabela intermediária `Alocacao`.
* **Análise Individual (Aceite/Recusa):**
  * **Aceite Integral com Ajuste Arquitetural:** Aceitei a estratégia e implementei a rota `/projetos/desalocar/:alocacaoId`. 
  * **Justificativa da Decisão:** Essa abordagem protege a integridade dos dados, impedindo a destruição acidental de um projeto inteiro e garantindo que o botão de lixeira cumpra exatamente o papel visual desenhado pelo Designer: limpar o slot do membro dentro da sua respectiva equipe (Back, Front, etc.).

  ---

## Registro 8: Centralização Direta de Endpoints no Módulo Express

### 1. Estratégia de Prompting
* **Técnica Utilizada:** Refatoração de Arquitetura Baseada em Simplicidade (KISS - Keep It Simple, Stupid).
* **Prompt Enviado:** Apresentação do arquivo estruturado `modules/express.js` aplicando o acoplamento direto das rotas modulares com os prefixos HTTP (`/membros`, `/projetos`, etc.).

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA avaliou as duas abordagens (Roteador Centralizador vs. Vinculação Direta no Express) e validou que a vinculação direta traz mais transparência para o fluxo de middlewares do MVP.
* **Análise Individual (Aceite/Recusa):**
  * **Aceite Convictor:** Decidi seguir com a aplicação direta das rotas no arquivo central do Express.
  * **Justificativa da Decisão:** Embora a criação de um roteador intermediário seja elegante, para o escopo atual do nosso MVP, injetar as rotas diretamente no `express.js` deixa o código mais explícito, facilita o debug visual de quais caminhos estão ativos e reduz o número de arquivos soltos no projeto, tornando a integração mais ágil para mim e para o meu parceiro do Front-end.

---

## Registro 9: Debug de Inconsistências via Análise Estática de Código (Copilot)

### 1. Estratégia de Prompting
* **Técnica Utilizada:** Auditoria Completa de Fluxo (Code Review Assistido).
* **Prompt Enviado:** Solicitação de varredura geral na árvore de arquivos para validação de compatibilidade entre assinaturas de métodos nos Models e chamadas nas Rotas.

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** O assistente detectou três falhas de runtime (tempo de execução): incompatibilidade de nomes de métodos nos módulos de membros (`buscarPorId` vs `buscarDetalhado`) e dashboard (`obterDadosGerais` vs `obterMetricas`), além de um erro de referência de variável (`m` em vez de `membro`) no model de membros.
* **Análise Individual (Aceite/Recusa):**
  * **Aceite Integral e Correção Imediata:** Aceitei o diagnóstico do review e apliquei as correções nos arquivos apontados.
  * **Justificativa da Decisão:** Sem essa validação cruzada, o servidor apresentaria telas de sucesso falsas (como o array vazio `[]` no navegador) mas sofreria crashes fatais assim que requisições reais do tipo POST ou GET por ID fossem efetuadas. Alinhar as assinaturas de métodos blinda a esteira de integração do MVP.


---

## Registro 10: Fechamento de Escopo CRUD e Homologação de Rotas Restantes

### 1. Estratégia de Prompting
* **Técnica Utilizada:** Verificação de Cobertura de API (CRUD Compliance).
* **Prompt Enviado:** Submissão do relatório final gerado pelo Copilot apontando a ausência física das rotas de deleção (`DELETE`) para as entidades de Membros e Projetos, apesar de seus respectivos modelos estarem prontos.

### 2. Resposta da IA e Tomada de Decisão
* **Sugestão da IA:** A IA recomendou a reinserção imediata das rotas de exclusão por ID em ambos os arquivos, garantindo conformidade estrita com o edital da Mega Jr.
* **Análise Individual (Aceite/Recusa):**
  * **Aceite Integral:** Implementei as rotas `DELETE /membros/:id` e `DELETE /projetos/:id`.
  * **Justificativa da Decisão:** Embora a interface visual do MVP foque na desalocação de membros, deixar a API sem os endpoints de exclusão raiz violaria as especificações de um CRUD completo exigidas na folha de avaliação. Com essa adição, o backend atinge 100% de cobertura operacional, pronto para consumo estável pelo Frontend.