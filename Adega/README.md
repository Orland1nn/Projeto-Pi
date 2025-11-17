# 📦 StockFlow

O **StockFlow** é um sistema desenvolvido para auxiliar adegas a gerenciar seu estoque, registrar produtos, controlar pedidos e otimizar o fluxo operacional de forma rápida, simples e eficiente.

---

## 🚀 Visão Geral do Sistema

O projeto é composto por duas aplicações principais:

- **Backend – Nest.js**  
  Framework TypeScript robusto, modular e altamente escalável.

- **Frontend – Next.js**  
  Framework React focado em aplicações full-stack, com excelente suporte ao TypeScript.

O objetivo do StockFlow é oferecer uma solução completa para:

- controle de produtos,  
- organização de seções,
- gerenciamento de pedidos,  
- e operação diária de adegas.

---

## 🛠️ Tecnologias Utilizadas

- Nest.js  
- Next.js  
- TypeORM  
- PostgreSQL  
- Docker & Docker Compose  
- JWT Authentication  
- TypeScript  

---

## 📥 Como Clonar o Repositório

```bash
git clone https://github.com/Orland1nn/Projeto-Pi.git
```
e para acessar o diretório
```bash
cd Projeto-Pi 
```

## 📦 Como instalar as dependências

Backend:

```bash
  cd Back
  npm install
```


Frontend:

```bash
  cd Front
  npm install
```



## ⚙️ Como configurar variáveis de ambiente no caso o banco de dados.

.env.example → é o arquivo onde ficam as informações do banco de dados que sera utilizado.

Exemplo:
```ini
DB_TYPE=postgres 
DB_HOST=postgres  
DB_PORT=postgres  
DB_USERNAME=postgres  
DB_PASSWORD=postgres  
DB_NAME=postgres  
DB_SYNCHRONIZE=true # apenas durante o desenvolvimento

APP_PORT=3000 
NODE_ENV=development 
```

Para uso é necessario mudar as informações previas acima. 


## 🐳 Executando com Docker

Para subir toda a stack (Banco + Backend + Frontend), execute:
```bash
docker compose up --build
```


## 🖥️ API



### 📝 Cadastro de Usuário

Criar novos usuários para acesso ao sistema.
<img width="1347" height="619" alt="cadastro" src="https://github.com/user-attachments/assets/f7a5c11c-44d2-4554-9337-1f878575594e" />


### 🔐 Login

Acesso seguro com bcrypt.
<img width="1365" height="631" alt="login" src="https://github.com/user-attachments/assets/5155a650-0679-46a4-9e9f-85bb9182327e" />


### 🏠 Página Inicial

Visão geral e atalhos para as principais operações.
<img width="1348" height="623" alt="paginal inicio" src="https://github.com/user-attachments/assets/9009c8bc-1b3d-4ca5-95a7-ffaf2658e33f" />


### 🍾 Gerenciamento de Produtos

Cadastrar, editar, excluir e visualizar produtos do estoque.
<img width="1364" height="622" alt="gerencia produto" src="https://github.com/user-attachments/assets/f0045ef5-30c3-4229-a7dd-2324e246fb06" />


### 🛒 Gerenciamento de Pedidos

Criar pedidos, listar pedidos existentes e acompanhar movimentações
<img width="1357" height="622" alt="lidar pedido" src="https://github.com/user-attachments/assets/23093f8f-ac04-4c9b-a74f-a7bea5c961c8" />


## 📚 Conclusão

O StockFlow foi desenvolvido com foco em eficiência, simplicidade e organização.
Com um backend sólido e uma interface moderna, oferece uma plataforma completa para o controle de estoque de adegas de todos os tamanhos.
