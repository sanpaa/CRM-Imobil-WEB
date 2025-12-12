# 🔧 Sistema de Gestão - Refrigeração e Elétrica

<div align="center">

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)
![Node](https://img.shields.io/badge/Node.js-18+-green)
![Angular](https://img.shields.io/badge/Angular-20+-red)
![License](https://img.shields.io/badge/License-MIT-blue)

**Sistema completo e moderno para gestão de serviços de refrigeração e elétrica**

[📖 Documentação](#-documentação) • [🚀 Começar](#-começar) • [✨ Funcionalidades](#-funcionalidades) • [🛠️ Tecnologias](#️-tecnologias)

</div>

---

## 📋 Sobre o Projeto

Sistema web responsivo (mobile-first) para empresas de refrigeração e elétrica, com foco em:

- ✅ **Gestão de Clientes** - Cadastro completo com histórico
- ✅ **Ordens de Serviço** - Criação, acompanhamento e conclusão
- ✅ **Orçamentos** - Criação e aprovação digital
- ✅ **WhatsApp** - Notificações automáticas (gratuito!)
- ✅ **Controle Financeiro** - Pagamentos e relatórios
- ✅ **Gestão de Técnicos** - Agenda e atribuição de serviços
- ✅ **PWA** - Funciona offline e pode ser instalado
- ✅ **100% Gratuito** - Sem APIs pagas

---

## ✨ Funcionalidades

### 🏠 Dashboard

- Visão geral do dia
- Estatísticas em tempo real
- Próximas visitas agendadas
- Alertas importantes

### 👥 Gestão de Clientes

- Cadastro completo
- Histórico de serviços
- Localização no mapa
- Contato via WhatsApp

### 📋 Ordens de Serviço

- Criação rápida e intuitiva
- Status personalizados:
  - 🟠 Aberto
  - 🔵 Em Atendimento
  - 🟡 Aguardando Peça
  - 🟢 Concluído
  - 🔴 Cancelado
- Upload de fotos
- Atribuição de técnicos
- Geolocalização

### 💰 Orçamentos

- Criação detalhada
- Itens personalizados
- Cálculo automático
- Envio por WhatsApp
- Aprovação digital
- Conversão automática para OS

### 💵 Financeiro

- Registro de pagamentos
- Múltiplas formas de pagamento
- Valores pendentes
- Relatórios mensais

### 👨‍🔧 Técnicos

- Cadastro completo
- Agenda de trabalho
- OS atribuídas
- Relatórios de produtividade

### 💬 WhatsApp (Gratuito!)

Notificações automáticas:
- ✅ Confirmação de agendamento
- ⏰ Lembrete de visita (24h antes)
- 💰 Envio de orçamento
- ✅ Serviço concluído

### 📱 PWA - Progressive Web App

- Instalável em Android/iOS
- Funciona offline
- Sincronização automática
- Performance nativa

---

## 🛠️ Tecnologias

### Frontend
- **Angular 20** - Framework moderno
- **TypeScript** - Type-safe
- **RxJS** - Programação reativa
- **Leaflet** - Mapas gratuitos
- **Service Workers** - PWA

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **JWT** - Autenticação segura
- **Multer** - Upload de arquivos

### Banco de Dados
- **PostgreSQL** - Banco relacional
- **Supabase** - BaaS gratuito
- **PostGIS** - Geolocalização

### WhatsApp
- **Baileys** - Biblioteca gratuita
- Conecta via WhatsApp Web
- Multi-dispositivo

### Arquitetura
- **Onion Architecture** - Clean code
- **Domain-Driven Design** - DDD
- **Repository Pattern** - Abstração de dados
- **Service Layer** - Lógica de negócio

---

## 🚀 Começar

### Pré-requisitos

- Node.js 18+
- NPM ou Yarn
- Conta Supabase (gratuita)

### Instalação Rápida

```bash
# Clonar repositório
git clone https://github.com/sanpaa/CRM-Imobil.git
cd CRM-Imobil

# Instalar dependências
npm install
cd frontend && npm install && cd ..

# Configurar ambiente
cp .env.example .env
# Editar .env com suas configurações

# Configurar banco de dados
# 1. Criar projeto no Supabase
# 2. Executar database/schema.sql no SQL Editor

# Iniciar desenvolvimento
npm run dev
# Em outro terminal:
cd frontend && npm start
```

Acesse:
- Frontend: `http://localhost:4200`
- API: `http://localhost:3000/api`

### Primeiro Login

**Credenciais padrão:**
- Email: `admin@empresa.com`
- Senha: `admin123`

⚠️ Altere a senha após primeiro acesso!

---

## 📖 Documentação

Documentação completa disponível em `/docs`:

| Documento | Descrição |
|-----------|-----------|
| [📘 Projeto Completo](PROJETO_REFRIGERACAO_ELETRICA.md) | Visão geral e arquitetura |
| [🗄️ Banco de Dados](database/schema.sql) | Schema completo SQL |
| [💬 WhatsApp](docs/WHATSAPP_INTEGRATION.md) | Integração gratuita |
| [🔌 API Exemplos](docs/API_EXAMPLES.md) | Exemplos de código backend |
| [🎨 Frontend](docs/FRONTEND_EXAMPLES.md) | Exemplos de código Angular |
| [🚀 Setup](docs/SETUP_GUIDE.md) | Guia de configuração |
| [📖 Manual](docs/USER_GUIDE.md) | Guia do usuário |

---

## 📁 Estrutura do Projeto

```
project-root/
├── frontend/                 # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── features/    # Módulos de funcionalidade
│   │   │   ├── shared/      # Componentes compartilhados
│   │   │   └── core/        # Serviços core
│   │   ├── assets/          # Imagens e ícones
│   │   └── manifest.json    # PWA manifest
│   └── package.json
│
├── src/                      # Backend Node.js
│   ├── domain/              # Entidades e interfaces
│   ├── application/         # Lógica de negócio
│   ├── infrastructure/      # Implementações
│   └── presentation/        # API Routes
│
├── database/
│   ├── schema.sql           # Schema completo
│   ├── migrations/          # Migrações
│   └── seeds/               # Dados iniciais
│
├── docs/                    # Documentação
├── .env.example             # Exemplo de variáveis
├── server.js                # Servidor principal
└── package.json
```

---

## 🎯 Roadmap

### Fase 1: Core ✅
- [x] Documentação completa
- [x] Arquitetura definida
- [x] Banco de dados
- [x] Entidades principais
- [ ] API endpoints
- [ ] Frontend básico

### Fase 2: Funcionalidades 🚧
- [ ] Dashboard
- [ ] Gestão de clientes
- [ ] Ordens de serviço
- [ ] Orçamentos
- [ ] Integração WhatsApp

### Fase 3: Avançado 📅
- [ ] Controle financeiro
- [ ] Gestão de técnicos
- [ ] Relatórios avançados
- [ ] PWA completo
- [ ] Modo offline

### Fase 4: Produção 📅
- [ ] Testes completos
- [ ] Otimizações
- [ ] Deploy
- [ ] Documentação final

---

## 💡 Exemplos de Uso

### Criar Cliente

```typescript
const client = await clientService.create({
  name: 'João Silva',
  phone: '(11) 99999-9999',
  whatsapp: '(11) 99999-9999',
  address: 'Rua A, 123',
  city: 'São Paulo',
  state: 'SP'
});
```

### Criar Ordem de Serviço

```typescript
const order = await orderService.create({
  client_id: client.id,
  type: 'refrigeration',
  equipment: 'Ar-condicionado 12.000 BTUs',
  problem_description: 'Não liga',
  scheduled_date: '2025-12-15T14:00:00Z'
});

// Cliente recebe confirmação automática no WhatsApp!
```

### Criar Orçamento

```typescript
const quote = await quoteService.create({
  client_id: client.id,
  order_id: order.id,
  items: [
    { description: 'Gás R-410A', quantity: 2, unit_price: 90.00 },
    { description: 'Mão de obra', quantity: 1, unit_price: 120.00 }
  ],
  discount: 30.00
});

// Enviar por WhatsApp
await quoteService.sendToClient(quote.id);
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/sanpaa/CRM-Imobil/issues)

Inclua:
- Descrição detalhada
- Passos para reproduzir
- Comportamento esperado
- Screenshots (se aplicável)
- Versão do sistema

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Paulo (sanpaa)**
- GitHub: [@sanpaa](https://github.com/sanpaa)

---

## 🙏 Agradecimentos

- Angular Team
- Node.js Community
- Supabase
- Baileys WhatsApp Library

---

## 📞 Suporte

Precisa de ajuda?
- 📖 [Documentação](docs/)
- 💬 [Issues](https://github.com/sanpaa/CRM-Imobil/issues)
- 📧 Email: contato@empresa.com

---

## 🌟 Star o Projeto

Se este projeto te ajudou, dê uma ⭐!

---

<div align="center">

**Feito com ❤️ para empresas de refrigeração e elétrica**

[⬆ Voltar ao topo](#-sistema-de-gestão---refrigeração-e-elétrica)

</div>
