
```markdown
# 🙌 Anjos Caridosos - Voluntários (Frontend)


## 📋 Sobre o Projeto

Este é o frontend administrativo do sistema **Anjos Caridosos**, desenvolvido para gerenciar o cadastro de voluntários de acordo com perfis específicos (como **psicólogos**, assistentes sociais, educadores, etc.).

O objetivo principal é fornecer uma interface web simples e eficiente para a equipe administrativa cadastrar, visualizar e gerenciar os voluntários, associando cada pessoa a um ou mais perfis de atuação dentro da organização.

> **Nota:** Este projeto consome uma API de backend já existente e desenvolvida separadamente. Certifique-se de que a API esteja configurada e em execução antes de usar o frontend.

## ✨ Funcionalidades

- Cadastro completo de voluntários (dados pessoais, contato, etc.)
- Atribuição de **perfis de voluntário** (ex: Psicólogo, Assistente Social, Mentor, etc.)
- Listagem e busca de voluntários cadastrados
- Edição e exclusão de registros
- Interface administrativa responsiva

## 🛠️ Tecnologias Utilizadas

- **React 18** + **Vite** (ambiente de desenvolvimento rápido)
- **JavaScript (ES6+)**
- **CSS3** (estilização customizada)
- **Axios** (para comunicação com a API - a ser implementado)

## 📦 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/)
- A **API backend** do sistema em execução (endereço e porta configuráveis)

## 🚀 Como Executar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/LordNecoReal/AnjosCaridososVoluntariosFULLSTACK.git
   ```

2. **Acesse a pasta do projeto**
   ```bash
   cd AnjosCaridososVoluntariosFULLSTACK
   ```

3. **Instale as dependências**
   ```bash
   npm install
   
   ```

4. **Configure a URL da API**  
   Crie um arquivo `.env` na raiz do projeto com a variável:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```
   *(Ajuste a porta e o caminho conforme sua API backend)*

5. **Execute o projeto em modo de desenvolvimento**
   ```bash
   npm run dev

   ```

6. **Acesse no navegador**  
   O Vite informará o endereço (geralmente `http://localhost:5173`)

## 🔗 Integração com a API Backend

Este frontend consome uma API REST externa. Os principais endpoints esperados são:

| Método | Endpoint | Descrição |
|--------|----------|-------------|
| GET    | `/voluntarios` | Lista todos os voluntários |
| POST   | `/voluntarios` | Cria um novo voluntário |
| PUT    | `/voluntarios/:id` | Atualiza um voluntário |
| DELETE | `/voluntarios/:id` | Remove um voluntário |


> 💡 **Importante:** A estrutura exata dos campos e respostas da API deve ser consultada na documentação do projeto backend.

## 📁 Estrutura de Pastas (principais)

```
src/
├── assets/          # Imagens, fonts, etc.
├── components/      # Componentes reutilizáveis (futuro)
├── pages/           # Páginas principais (Cadastro, Listagem, etc.)
├── services/        # Chamadas à API (axios)
├── styles/          # Arquivos CSS globais
├── App.jsx          # Componente raiz
└── main.jsx         # Ponto de entrada
```

## 🧪 Próximos Passos (Sugestões de Implementação)

- [ ] Implementar as chamadas reais à API usando `axios`
- [ ] Criar formulário de cadastro com validação
- [ ] Adicionar página de listagem com filtros por perfil
- [ ] Implementar edição e exclusão de voluntários
- [ ] Adicionar autenticação (login) para acesso administrativo
- [ ] Melhorar feedback visual com toasts ou modais


## ✒️ Autor

**LordNecoReal** - [GitHub](https://github.com/LordNecoReal)



---
