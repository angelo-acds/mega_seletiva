# Documento de Requisitos – Sistema de Gestão de Projetos

## Requisitos Funcionais (Histórias de Usuário)

### ID: US-01 – Cadastro e Gestão de Membros
* **História:** COMO Diretor da Mega Jr., QUERO cadastrar, editar e remover um membro no sistema, PARA QUE ele possa ser alocado em projetos futuros e mantido atualizado.
* **Regras de Negócio:** * **RN01 (Campos Obrigatórios):** O cadastro de membros exige obrigatoriamente: Nome completo, RGA e E-mail válido.
  * **RN02 (Validação de RGA):** O campo RGA deve conter estritamente 12 dígitos numéricos.
  * **RN03 (Vínculo Mínimo):** Todo membro deve possuir pelo menos uma função/área padrão atribuída no momento do cadastro (ex: Front-End, Back-End, Designer/Stacks).

### ID: US-02 – Gerenciamento de Projetos
* **História:** COMO Diretor de Projetos, QUERO cadastrar, editar, listar e remover os projetos da empresa júnior, PARA acompanhar as datas limite e o progresso das demandas.
* **Regras de Negócio:**
  * **RN01 (Estado Inicial):** Todo projeto recém-criado deve assumir obrigatoriamente o status inicial como `Criado`.
  * **RN02 (Consumo de API Real):** A listagem e os detalhes de projetos devem consumir de forma estrita as rotas da API REST do back-end através do serviço Axios, eliminando a exibição de dados fictícios (*mocks*) em ambiente de homologação.
  * **RN03 (Campos Obrigatórios):** O nome do projeto e a data limite são campos obrigatórios.

### ID: US-03 – Alocação de Cargos no Projeto
* **História:** COMO Diretor da Mega Jr, QUERO vincular membros e diretores a funções específicas de um projeto, PARA delimitar responsabilidades das equipes.
* **Regras de Negócio:**
  * **RN01 (Integridade de Funções):** O sistema deve aceitar tanto IDs de membros quanto de diretores para cargos dentro de um projeto (como Supervisor), evitando valores nulos (`null`) na chave estrangeira da tabela de alocação no banco de dados.
  * **RN02 (Prevenção de Duplicidade):** O sistema deve bloquear qualquer tentativa de alocar o mesmo membro no mesmo projeto exercendo a mesma função, evitando redundâncias na tabela intermediária.
  * **RN03 (Payload da Rota):** O payload da requisição de alocação enviado pelo front-end deve referenciar o identificador da função desempenhada no projeto singular.

### ID: US-04 – Dashboard Gerencial
* **História:** COMO Diretor Executivo, QUERO visualizar métricas de desenvolvedores trabalhando e em espera, PARA gerenciar os recursos humanos da EJ de forma consolidada.
* **Regras de Negócio:**
  * **RN01 (Limite Inferior Matemático):** O cálculo de membros em espera/disponíveis não pode resultar em valores negativos sob nenhuma hipótese (mínimo de 0).
  * **RN02 (Contabilidade Abrangente):** Diretores alocados ativamente em funções internas de projetos devem ser contabilizados na métrica de desenvolvedores em atividade na listagem visual do painel.

### ID: US-05 – Autenticação e Gestão de Diretores (Admin)
* **História:** COMO Diretor da Mega Jr., QUERO realizar login administrativo no sistema, PARA acessar as funcionalidades restritas de gerenciamento de equipes.
* **Regras de Negócio:**
  * **RN01 (Mapeamento de Nomenclatura da Interface):** Para fins de experiência do usuário (UX) no front-end, o perfil correspondente à entidade de "Diretor" no banco de dados é mapeado e exibido sob os rótulos de **"Admin"** (telas de Login, Admin e CadastroAdmin).
  * **RN02 (Criptografia de Segurança):** Toda senha de administrador deve ser armazenada de forma criptografada no banco de dados usando o algoritmo `bcrypt`.
  * **RN03 (Privacidade de Dados):** As rotas de listagem ou retorno de diretores nunca devem expor o hash da senha no JSON de resposta da API consumida pela interface.