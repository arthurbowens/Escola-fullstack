# 🎓 Sistema de Gestão Escolar

Um sistema completo de gestão escolar desenvolvido com **Angular** e **Spring Boot**, oferecendo diferentes níveis de acesso para administradores, professores e alunos.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Fluxo de Uso](#-fluxo-de-uso)
- [API Endpoints](#-api-endpoints)
- [Autenticação e Autorização](#-autenticação-e-autorização)
- [Contribuição](#-contribuição)

## 🎯 Visão Geral

O Sistema de Gestão Escolar é uma aplicação web que permite o gerenciamento completo de uma instituição de ensino, oferecendo:

- **Administração centralizada** de alunos, professores, turmas e disciplinas
- **Lançamento de notas e frequência** pelos professores
- **Boletim online** para consulta dos alunos
- **Relatórios de desempenho** e frequência
- **Interface responsiva** e intuitiva

### 👥 Perfis de Usuário

| Perfil | Acesso | Funcionalidades |
|--------|--------|-----------------|
| **Administrador** | Total | Cadastro de usuários, turmas, disciplinas, relatórios |
| **Professor** | Limitado | Lançamento de notas/frequência, visualização de turmas |
| **Aluno** | Consulta | Visualização do boletim, notas e frequência |

## ⚙️ Funcionalidades

### 🔹 1. Cadastro e Gestão

#### **Alunos**
- Nome completo
- Matrícula única
- Data de nascimento
- E-mail e senha
- Associação com turma
- Histórico de notas e frequência

#### **Professores**
- Dados pessoais (nome, CPF, contato)
- E-mail e senha
- Associação com disciplinas
- Acesso às turmas lecionadas

#### **Disciplinas**
- Nome da disciplina
- Carga horária
- Professor responsável
- Associação com turmas

#### **Turmas**
- Série/ano letivo
- Lista de alunos matriculados
- Disciplinas associadas
- Controle de vagas

### 🔹 2. Lançamento de Notas e Frequência

#### **Para Professores:**
- Seleção de disciplina → turma → aluno
- Lançamento de notas por tipo de avaliação:
  - Prova
  - Trabalho
  - Atividade
  - Projeto
- Registro de presença/falta por aula
- Observações e comentários
- Cálculo automático de médias

### 🔹 3. Boletim Online

#### **Para Alunos:**
- **Notas por disciplina** com histórico completo
- **Média final** calculada automaticamente
- **Frequência** (% de presença)
- **Situação final** (Aprovado/Recuperação/Reprovado)
- **Visualização em tempo real** das atualizações

### 🔹 4. Relatórios e Análises

#### **Para Administradores:**
- Relatório de alunos reprovados por disciplina
- Relatório de frequência geral da turma
- Estatísticas de desempenho
- Exportação em PDF/Excel
- Dashboard com métricas principais

## 🛠️ Tecnologias

### **Backend**
- **Java 17** - Linguagem de programação
- **Spring Boot 3.x** - Framework principal
- **Spring Security** - Autenticação e autorização
- **Spring Data JPA** - Persistência de dados
- **Hibernate** - ORM
- **MySQL** - Banco de dados
- **JWT** - Tokens de autenticação
- **Maven** - Gerenciamento de dependências

### **Frontend**
- **Angular 17** - Framework SPA
- **TypeScript** - Linguagem de programação
- **Tailwind CSS** - Framework CSS
- **RxJS** - Programação reativa
- **Angular Material** - Componentes UI
- **SweetAlert2** - Alertas e modais

### **Ferramentas**
- **Git** - Controle de versão
- **Docker** - Containerização (opcional)
- **Postman** - Testes de API

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Angular)     │◄──►│   (Spring Boot) │◄──►│   (MySQL)       │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Tables        │
│ • Services      │    │ • Services      │    │ • Relations     │
│ • Models        │    │ • Repositories  │    │ • Indexes       │
│ • Guards        │    │ • Security      │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Padrões Utilizados**
- **MVC** (Model-View-Controller)
- **Repository Pattern**
- **DTO Pattern** (Data Transfer Object)
- **JWT Authentication**
- **RESTful API**

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Java 17+
- Node.js 18+
- MySQL 8.0+
- Maven 3.6+
- Angular CLI 17+

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/gestao-escolar.git
cd gestao-escolar
```

### **2. Configuração do Backend**

#### **Banco de Dados**
```sql
CREATE DATABASE gestao_escolar;
CREATE USER 'gestao_user'@'localhost' IDENTIFIED BY 'senha123';
GRANT ALL PRIVILEGES ON gestao_escolar.* TO 'gestao_user'@'localhost';
FLUSH PRIVILEGES;
```

#### **Executar o Backend**
```bash
cd gestaoEscolar-spring
mvn clean install
mvn spring-boot:run
```

### **3. Configuração do Frontend**

#### **Instalar Dependências**
```bash
cd gestao-escolar-frontend
npm install
```

#### **Executar o Frontend**
```bash
ng serve
```

### **4. Acessar a Aplicação**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080/gestaoEscolar/api

## 🔄 Fluxo de Uso

### **1. Administrador**
```
Login → Dashboard → Cadastros → Relatórios
  ↓
• Cadastra alunos, professores, turmas, disciplinas
• Visualiza relatórios de desempenho
• Gerencia associações entre entidades
```

### **2. Professor**
```
Login → Dashboard → Seleciona Disciplina → Turma → Alunos
  ↓
• Lança notas por tipo de avaliação
• Registra presença/falta
• Visualiza histórico da turma
```

### **3. Aluno**
```
Login → Dashboard → Boletim Online
  ↓
• Visualiza notas por disciplina
• Consulta frequência
• Acompanha situação acadêmica
```

## 🔌 API Endpoints

### **Autenticação**
```
POST /api/auth/login          # Login de usuário
```

### **Alunos**
```
GET    /api/alunos            # Listar todos
POST   /api/alunos            # Criar aluno
GET    /api/alunos/{id}       # Buscar por ID
PUT    /api/alunos/{id}       # Atualizar
DELETE /api/alunos/{id}       # Excluir
GET    /api/alunos/me         # Dados do aluno logado
```

### **Professores**
```
GET    /api/professores       # Listar todos
POST   /api/professores       # Criar professor
GET    /api/professores/{id}  # Buscar por ID
PUT    /api/professores/{id}  # Atualizar
DELETE /api/professores/{id}  # Excluir
GET    /api/professores/me    # Dados do professor logado
```

### **Notas e Frequência**
```
GET    /api/notas/aluno/{id}      # Notas do aluno
POST   /api/notas                 # Lançar nota
GET    /api/frequencias/aluno/{id} # Frequência do aluno
POST   /api/frequencias           # Registrar frequência
```

## 🔐 Autenticação e Autorização

### **JWT (JSON Web Tokens)**
- **Token de Acesso**: Válido por 24 horas
- **Claims**: ID do usuário, tipo de usuário, permissões

### **Roles e Permissões**
```java
@PreAuthorize("hasRole('ADMINISTRADOR')")  // Apenas administradores
@PreAuthorize("hasRole('PROFESSOR')")      // Apenas professores
@PreAuthorize("hasRole('ALUNO')")          // Apenas alunos
```

## 📊 Banco de Dados

### **Entidades Principais**
- **Usuario** (Base): id, nome, email, senha, tipoUsuario
- **Aluno**: matricula, dataNascimento, turma
- **Professor**: cpf, disciplinas
- **Turma**: nome, serie, anoLetivo, alunos, disciplinas
- **Disciplina**: nome, cargaHoraria, professor, turmas
- **Nota**: aluno, disciplina, valor, tipoAvaliacao, dataAvaliacao
- **Frequencia**: aluno, disciplina, dataAula, presente

## 🚀 Deploy

### **Produção**
- **Backend**: Deploy em servidor Java (Tomcat/Jetty)
- **Frontend**: Build estático em servidor web (Nginx/Apache)
- **Banco**: MySQL em servidor dedicado

## 📈 Melhorias Futuras

- [ ] **Notificações em tempo real** (WebSocket)
- [ ] **App mobile** (React Native/Flutter)
- [ ] **Relatórios avançados** com gráficos
- [ ] **Sistema de backup automático**
- [ ] **Auditoria de ações** (logs detalhados)

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request


## 👨‍💻 Desenvolvedor

**Arthur Bowens**
- GitHub: [@arthurbowens](https://github.com/arthurbowens)


---

**🎓 Sistema de Gestão Escolar - Transformando a educação através da tecnologia!**
