# Sistema de Eventos - Painel do Organizador

🔗 **Deploy da Aplicação:** [Acessar o Sistema no Netlify](https://sistemaeventos.netlify.app/)

## 📖 Sobre o Projeto
O **Sistema de Eventos** é uma aplicação web em React que simula um painel para organizadores de eventos, responsável por autenticar o usuário e permitir o gerenciamento de participantes, eventos e regras de check-in.

O foco principal do projeto é demonstrar:
- Arquitetura de software organizada e escalável.
- Autenticação JWT e proteção de rotas.
- Gerenciamento de estado complexo (regras de check-in).
- Boas práticas de usabilidade, HTML semântico e responsividade.
- Componentização e uso de Hooks customizados em React.

---

## 🚀 Funcionalidades Implementadas

### 1. Autenticação e Segurança
- Login via API REST (mockada) com validação de tipagem de formulário via Zod.
- Armazenamento de token JWT e utilização nas requisições autenticadas.
- Rotas protegidas (Dashboard, Eventos, Participantes, Check-in) exigindo autenticação.
- Fluxo de logout que invalida o estado local e redireciona ao login.

### 2. Dashboard
- Resumo quantitativo com total de eventos, participantes totais e status das atividades da plataforma.

### 3. Gestão de Eventos
- Listagem em tabela exibindo nome, data, local e status (Ativo/Encerrado).
- Funcionalidades de busca e filtragem.
- Formulários para criar, editar e remover eventos.
- Feedbacks de estado na interface (loading, toasts de sucesso/erro e listas vazias).

### 4. Gestão de Participantes
- Listagem contendo nome, e-mail, evento vinculado e status do check-in (Feito/Não feito).
- Funcionalidades de busca e filtragem.
- Formulários de cadastro e edição.
- Funcionalidade para transferir participantes entre diferentes eventos da plataforma.

### 5. Configuração de Regras de Check-in
A tela de Configuração de Regras de Check-in foi idealizada para demonstrar o controle de estado complexo e gerenciamento de múltiplas validações simultâneas.
- **Validação de Interseção de Intervalos:** O sistema verifica limites temporais, deduzidos a partir do horário base do evento, para impedir que regras entrem em conflito lógico durante as janelas de validação.
- **Regras Obrigatórias:** A aplicação garante que não existam duas ou mais regras marcadas como "Obrigatórias" cujas janelas de validação sejam totalmente incompatíveis entre si (interseção de intervalos).
- **Estado Derivado e Imutabilidade:** O estado principal das regras é manipulado preservando a imutabilidade da estrutura. Alertas visuais e feedbacks que orientam o usuário na configuração são processados como um estado decorrente (derivado) da lista de regras, assegurando consistência UI/Model.
- O sistema valida no submit a exigência de existir, no mínimo, 1 regra ativa por evento.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes bibliotecas e ferramentas:

- **React (v19)** e **Vite (v7)**
- **TypeScript**
- **Tailwind CSS (v4)**
- **React Router DOM**
- **React Hook Form** + **Zod** para gerenciamento e validação estrita de submissões.
- **React Toastify** para visualização e pop-up de notificações.
- **Context API** para estado global (`AuthContext`).

### Testes e Qualidade de Código
- **Vitest** + **React Testing Library** para os testes unitários e testes de integração de fluxo.
- **ESLint** + **Prettier** para linting e formatação de padronização.
- **Husky** + **Commitlint** (padrão Conventional Commits) + **lint-staged** para checagens em ganchos pré-commit.

---

## 🏗️ Estrutura do Projeto

A estruturação do projeto separa logicamente as responsabilidades:

```text
src/
├── app/               # Providers globais utilizados para envolver o app
├── components/        # Componentes UI reusáveis
│   └── ui/            # Elementos menores genéricos (Input, Select, Button)
├── context/           # Gerenciamento de estado via Context API
├── hooks/             # Hooks customizados para abstração lógica
├── pages/             # Telas / views conectadas às rotas
├── routes/            # Roteador central e validadores (ProtectedRoute)
├── services/          # Conexão fake backend (chamadas mockadas via Promises)
├── types/             # Definições de entidades para o TypeScript
└── utils/             # Funções utilitárias avulsas
```

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
Certifique-se de possuir o [Node.js](https://nodejs.org/) (versão `18.x` ou superior) e um instalador de pacotes (`npm`, `yarn` ou `pnpm`).

### Passos Locais

1. Clone o repositório da aplicação:
   ```bash
   git clone <url-do-repositorio>
   cd sistema-eventos
   ```

2. Instale as bibliotecas necessárias:
   ```bash
   npm install
   ```

3. Disponibilize para desenvolvimento rodando o comando do Vite:
   ```bash
   npm run dev
   ```

4. Acesse por `http://localhost:5173` no navegador.

> 💡 **Autenticação:** A API local atua mockada. Sendo assim, o fluxo do `/login` permite aprovação automática utilizando qualquer entrada formatada compatível que passe pela validação de client-side com e-mail e senha. As integrações rodam os seeds simulados em memória dos arquivos em `src/services/`.

---

## 🧪 Como Executar os Testes

Para validar a integridade da suíte implementada para os testes do componente e do roteiro em simulação pura de DOM (`jsdom`), execute:

```bash
npm run test
```
