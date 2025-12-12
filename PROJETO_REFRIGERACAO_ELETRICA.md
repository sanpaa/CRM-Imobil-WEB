# 🔧 Sistema de Gestão para Refrigeração e Elétrica

## 📋 Sumário Executivo

Sistema web completo e responsivo (mobile-first) para gestão de atendimentos, ordens de serviço, clientes, orçamentos e comunicação via WhatsApp para empresas de refrigeração e elétrica.

### Características Principais:
- ✅ **100% Web** - Funciona em qualquer navegador
- ✅ **Mobile-First** - Otimizado para dispositivos móveis
- ✅ **PWA** - Pode ser instalado como app
- ✅ **Offline-First** - Funciona sem internet
- ✅ **Gratuito** - Sem APIs pagas
- ✅ **Open Source** - Código aberto

---

## 🏗️ 1. ARQUITETURA DO SISTEMA

### 1.1 Visão Geral

```
┌─────────────────────────────────────────────────────────┐
│                     CAMADA DE APRESENTAÇÃO               │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Angular    │  │  Service     │  │   PWA        │ │
│  │  Components  │──│   Workers    │──│   Manifest   │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                   CAMADA DE API (Express.js)            │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Auth    │  │  Clients │  │  Orders  │  │ Quotes │ │
│  │  Routes  │  │  Routes  │  │  Routes  │  │ Routes │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│              CAMADA DE SERVIÇOS (Business Logic)         │
│                                                          │
│  ┌───────────────┐  ┌───────────────┐  ┌────────────┐ │
│  │  Client       │  │  Order        │  │  WhatsApp  │ │
│  │  Service      │  │  Service      │  │  Service   │ │
│  └───────────────┘  └───────────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│            CAMADA DE DADOS (Repositories)                │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           PostgreSQL / Supabase                   │  │
│  │  (Users, Clients, Orders, Services, Quotes, etc) │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────┐
│                 INTEGRAÇÕES EXTERNAS                     │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  WhatsApp    │  │  Geolocation │  │  Storage     │ │
│  │  (Free API)  │  │  (Maps API)  │  │  (Supabase)  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Tecnologias Utilizadas

#### Frontend
- **Framework**: Angular 20+ (já existe no projeto)
- **UI/UX**: CSS3 customizado + Angular Material (opcional)
- **PWA**: Service Workers + Manifest
- **Estado**: RxJS + LocalStorage para offline
- **Mapas**: Leaflet (gratuito)

#### Backend
- **Framework**: Node.js + Express.js (já existe)
- **Arquitetura**: Onion Architecture (já implementada)
- **Autenticação**: JWT + bcryptjs
- **Upload**: Multer para fotos/vídeos

#### Banco de Dados
- **Principal**: PostgreSQL via Supabase (gratuito)
- **Cache Local**: IndexedDB (para modo offline)
- **Storage**: Supabase Storage (gratuito)

#### WhatsApp (Soluções Gratuitas)
- **Opção 1**: WhatsApp Business API + Webhook próprio
- **Opção 2**: Baileys (biblioteca Node.js gratuita)
- **Opção 3**: WhatsApp Web.js (não oficial, mas funcional)

---

## 📊 2. MODELO DE BANCO DE DADOS

### 2.1 Diagrama ER

```
┌─────────────────┐
│     USERS       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email           │
│ password_hash   │
│ role            │ ─┐
│ phone           │  │
│ created_at      │  │
└─────────────────┘  │
                     │
                     │ FK
┌─────────────────┐  │
│   TECHNICIANS   │  │
├─────────────────┤  │
│ id (PK)         │  │
│ user_id (FK)────┼──┘
│ specialization  │
│ active          │
│ created_at      │
└─────────────────┘

┌─────────────────┐
│    CLIENTS      │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email           │
│ phone           │
│ whatsapp        │
│ cpf_cnpj        │
│ address         │
│ city            │
│ state           │
│ zip_code        │
│ latitude        │
│ longitude       │
│ notes           │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        │
┌─────────────────┐       ┌─────────────────┐
│   ORDERS (OS)   │       │    SERVICES     │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ client_id (FK)──┼───────┤ name            │
│ technician_id   │       │ type            │
│ service_id (FK)─┼───────│ description     │
│ order_number    │       │ base_price      │
│ type            │       │ active          │
│ equipment       │       │ created_at      │
│ problem         │       └─────────────────┘
│ status          │
│ priority        │
│ scheduled_date  │
│ completion_date │
│ latitude        │
│ longitude       │
│ notes           │
│ created_at      │
│ updated_at      │
└─────────────────┘
        │
        │ 1:N
        │
┌─────────────────┐
│  ORDER_PHOTOS   │
├─────────────────┤
│ id (PK)         │
│ order_id (FK)───┼───┘
│ file_url        │
│ file_type       │
│ description     │
│ uploaded_at     │
└─────────────────┘

┌─────────────────┐
│     QUOTES      │
├─────────────────┤
│ id (PK)         │
│ client_id (FK)──┼───────┐
│ order_id (FK)   │       │
│ quote_number    │       │
│ items           │ (JSON)│
│ subtotal        │       │
│ discount        │       │
│ total           │       │
│ status          │       │
│ valid_until     │       │
│ approved_at     │       │
│ created_at      │       │
│ updated_at      │       │
└─────────────────┘       │
                          │
┌─────────────────┐       │
│    PAYMENTS     │       │
├─────────────────┤       │
│ id (PK)         │       │
│ order_id (FK)───┼───────┤
│ quote_id (FK)   │       │
│ amount          │       │
│ payment_method  │       │
│ status          │       │
│ paid_at         │       │
│ created_at      │       │
└─────────────────┘       │
                          │
┌─────────────────┐       │
│ WHATSAPP_LOGS   │       │
├─────────────────┤       │
│ id (PK)         │       │
│ client_id (FK)──┼───────┘
│ order_id (FK)   │
│ message_type    │
│ message_content │
│ status          │
│ sent_at         │
│ delivered_at    │
│ read_at         │
│ error_message   │
└─────────────────┘

┌─────────────────┐
│   AUDIT_LOGS    │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ action          │
│ entity_type     │
│ entity_id       │
│ old_values      │ (JSON)
│ new_values      │ (JSON)
│ ip_address      │
│ created_at      │
└─────────────────┘
```

### 2.2 Script SQL de Criação

**Ver arquivo**: `database/schema.sql`

---

## 🌐 3. API ENDPOINTS

### 3.1 Autenticação

```
POST   /api/auth/register          - Registrar novo usuário
POST   /api/auth/login             - Login
POST   /api/auth/logout            - Logout
POST   /api/auth/refresh           - Refresh token
GET    /api/auth/me                - Dados do usuário logado
```

### 3.2 Clientes

```
GET    /api/clients                - Listar todos os clientes
GET    /api/clients/:id            - Obter cliente específico
POST   /api/clients                - Criar novo cliente
PUT    /api/clients/:id            - Atualizar cliente
DELETE /api/clients/:id            - Remover cliente
GET    /api/clients/:id/orders     - Ordens de serviço do cliente
GET    /api/clients/:id/history    - Histórico completo
```

### 3.3 Ordens de Serviço (OS)

```
GET    /api/orders                 - Listar todas as OS
GET    /api/orders/:id             - Obter OS específica
POST   /api/orders                 - Criar nova OS
PUT    /api/orders/:id             - Atualizar OS
DELETE /api/orders/:id             - Remover OS
PATCH  /api/orders/:id/status      - Atualizar status
POST   /api/orders/:id/photos      - Upload de fotos
GET    /api/orders/:id/photos      - Listar fotos da OS
POST   /api/orders/:id/assign      - Atribuir técnico
GET    /api/orders/technician/:id  - OS por técnico
GET    /api/orders/status/:status  - OS por status
```

### 3.4 Orçamentos

```
GET    /api/quotes                 - Listar todos os orçamentos
GET    /api/quotes/:id             - Obter orçamento específico
POST   /api/quotes                 - Criar novo orçamento
PUT    /api/quotes/:id             - Atualizar orçamento
DELETE /api/quotes/:id             - Remover orçamento
POST   /api/quotes/:id/approve     - Aprovar orçamento
POST   /api/quotes/:id/send        - Enviar por WhatsApp
GET    /api/quotes/:id/pdf         - Gerar PDF
```

### 3.5 Técnicos

```
GET    /api/technicians            - Listar técnicos
GET    /api/technicians/:id        - Obter técnico
POST   /api/technicians            - Criar técnico
PUT    /api/technicians/:id        - Atualizar técnico
GET    /api/technicians/:id/schedule - Agenda do técnico
GET    /api/technicians/:id/orders - OS atribuídas
```

### 3.6 WhatsApp

```
POST   /api/whatsapp/send          - Enviar mensagem
POST   /api/whatsapp/webhook       - Receber mensagens
GET    /api/whatsapp/logs          - Logs de mensagens
GET    /api/whatsapp/status/:id    - Status da mensagem
POST   /api/whatsapp/templates     - Templates de mensagem
```

### 3.7 Financeiro

```
GET    /api/payments               - Listar pagamentos
POST   /api/payments               - Registrar pagamento
GET    /api/payments/pending       - Pagamentos pendentes
GET    /api/reports/monthly        - Relatório mensal
GET    /api/reports/revenue        - Receita por período
```

### 3.8 Dashboard

```
GET    /api/dashboard/stats        - Estatísticas gerais
GET    /api/dashboard/today        - Atendimentos de hoje
GET    /api/dashboard/pending      - Serviços pendentes
GET    /api/dashboard/upcoming     - Próximas visitas
```

---

## 📱 4. TELAS E FLUXOS

### 4.1 Wireframes das Principais Telas

#### Dashboard
```
┌─────────────────────────────────────────┐
│  ☰  Dashboard          🔔 👤           │
├─────────────────────────────────────────┤
│                                         │
│  📊 Resumo do Dia                      │
│  ┌───────────┬───────────┬──────────┐ │
│  │    15     │     8     │    23    │ │
│  │  Abertos  │Atendendo  │Concluídos│ │
│  └───────────┴───────────┴──────────┘ │
│                                         │
│  📅 Próximas Visitas                   │
│  ┌─────────────────────────────────┐  │
│  │ 14:00 - João Silva               │  │
│  │ 📍 Rua A, 123  [VER MAPA]       │  │
│  │ ⚡ Instalação elétrica           │  │
│  └─────────────────────────────────┘  │
│  ┌─────────────────────────────────┐  │
│  │ 16:00 - Maria Santos             │  │
│  │ 📍 Av. B, 456  [VER MAPA]       │  │
│  │ ❄️ Manutenção ar-condicionado   │  │
│  └─────────────────────────────────┘  │
│                                         │
│  ⚠️ Alertas                            │
│  • 3 orçamentos aguardando aprovação   │
│  • 2 pagamentos vencidos                │
│                                         │
│  [+ NOVA OS]  [VER TODAS]              │
└─────────────────────────────────────────┘
```

#### Lista de Ordens de Serviço
```
┌─────────────────────────────────────────┐
│  ←  Ordens de Serviço    🔍 [filtro]   │
├─────────────────────────────────────────┤
│  [Todas] [Abertas] [Andamento] [Concl] │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ OS #1234  [ABERTO]              │   │
│  │ João Silva - (11) 99999-9999    │   │
│  │ ❄️ Refrigeração                 │   │
│  │ Ar-condicionado não liga        │   │
│  │ 📅 Hoje, 14:00                  │   │
│  │ [VER] [ATRIBUIR] [EDITAR]      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ OS #1233  [EM ATENDIMENTO]      │   │
│  │ Maria Santos - (11) 98888-8888  │   │
│  │ ⚡ Elétrica                      │   │
│  │ Disjuntor queimado              │   │
│  │ 👤 Técnico: Carlos              │   │
│  │ [VER] [ATUALIZAR STATUS]        │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [+ NOVA OS]                            │
└─────────────────────────────────────────┘
```

#### Detalhes da OS
```
┌─────────────────────────────────────────┐
│  ←  OS #1234                [EDITAR]   │
├─────────────────────────────────────────┤
│                                         │
│  STATUS: [ABERTO ▼]                    │
│                                         │
│  👤 Cliente                             │
│  João Silva                             │
│  📱 (11) 99999-9999                     │
│  📍 Rua A, 123, São Paulo              │
│  [VER NO MAPA] [WHATSAPP]              │
│                                         │
│  🔧 Serviço                             │
│  Tipo: ❄️ Refrigeração                 │
│  Equipamento: Ar-condicionado 12.000   │
│  Problema: Não liga                     │
│                                         │
│  📅 Agendamento                         │
│  Data: 12/12/2025  Hora: 14:00         │
│                                         │
│  👨‍🔧 Técnico                              │
│  [ATRIBUIR TÉCNICO ▼]                   │
│                                         │
│  📷 Fotos                               │
│  [🖼️] [🖼️] [🖼️] [+ ADICIONAR]        │
│                                         │
│  📝 Observações                         │
│  ┌─────────────────────────────────┐   │
│  │ Cliente relatou que...          │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [CRIAR ORÇAMENTO] [SALVAR]            │
└─────────────────────────────────────────┘
```

#### Criar/Editar Orçamento
```
┌─────────────────────────────────────────┐
│  ←  Novo Orçamento                      │
├─────────────────────────────────────────┤
│                                         │
│  Cliente: João Silva                    │
│  OS: #1234                              │
│                                         │
│  Itens do Orçamento                     │
│  ┌─────────────────────────────────┐   │
│  │ Item                Qtd   Valor │   │
│  │ Gás R-410A          2kg   180,00│   │
│  │ Mão de obra         1h    120,00│   │
│  │ Limpeza completa    1un   80,00 │   │
│  │                                 │   │
│  │ [+ ADICIONAR ITEM]              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Subtotal:           R$ 380,00          │
│  Desconto:           R$ 30,00           │
│  ──────────────────────────────         │
│  TOTAL:              R$ 350,00          │
│                                         │
│  Validade: [15 dias ▼]                 │
│                                         │
│  [SALVAR] [ENVIAR POR WHATSAPP]        │
└─────────────────────────────────────────┘
```

#### Cadastro de Cliente
```
┌─────────────────────────────────────────┐
│  ←  Novo Cliente                        │
├─────────────────────────────────────────┤
│                                         │
│  Nome Completo *                        │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  CPF/CNPJ                               │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Telefone *                             │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  WhatsApp *                             │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Email                                  │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  📍 Endereço                            │
│  CEP: [_____-___] [BUSCAR]             │
│  Rua: ___________________________       │
│  Número: ____  Complemento: _____       │
│  Bairro: ___________                    │
│  Cidade: ___________  UF: [__]         │
│                                         │
│  Observações                            │
│  ┌─────────────────────────────────┐   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  [CANCELAR]  [SALVAR CLIENTE]          │
└─────────────────────────────────────────┘
```

### 4.2 Fluxos de Navegação

#### Fluxo: Criar Nova OS
```
1. Dashboard → [+ NOVA OS]
2. Selecionar/Criar Cliente
3. Preencher dados da OS
   - Tipo de serviço
   - Equipamento
   - Problema
   - Agendar data/hora
4. Adicionar fotos (opcional)
5. Salvar OS
6. WhatsApp automático enviado ao cliente
```

#### Fluxo: Criar e Enviar Orçamento
```
1. OS Detalhes → [CRIAR ORÇAMENTO]
2. Adicionar itens do orçamento
3. Definir valores e descontos
4. Salvar orçamento
5. [ENVIAR POR WHATSAPP]
6. Cliente recebe link com orçamento
7. Cliente aprova/rejeita
8. Se aprovado → OS muda status automaticamente
```

#### Fluxo: Atendimento Completo
```
1. Técnico visualiza OS atribuída
2. Técnico vai ao local
3. Atualiza status → "EM ATENDIMENTO"
4. Tira fotos do serviço
5. Completa o serviço
6. Atualiza status → "CONCLUÍDO"
7. Cliente recebe confirmação no WhatsApp
8. Registra pagamento
```

---

## 💬 5. INTEGRAÇÃO WHATSAPP (GRATUITA)

### 5.1 Opções de Integração Gratuitas

#### Opção 1: Baileys (Recomendada) ⭐
- Biblioteca Node.js gratuita
- Conecta via QR Code
- Multi-dispositivo
- Suporta texto, imagens, documentos

#### Opção 2: WhatsApp Web.js
- Puppeteer-based
- Simula WhatsApp Web
- Mais pesado, mas funcional

#### Opção 3: WhatsApp Business API + Twilio (Limitado Gratuito)
- Twilio tem tier gratuito limitado
- Mais profissional
- Limitações de mensagens

### 5.2 Mensagens Automáticas

#### Template: Confirmação de Agendamento
```
🔧 *[NOME DA EMPRESA]*

Olá *{cliente_nome}*! 👋

✅ Seu atendimento foi agendado!

📋 *Ordem de Serviço:* #{os_numero}
📅 *Data:* {data}
🕐 *Horário:* {hora}
👨‍🔧 *Técnico:* {tecnico_nome}
📍 *Local:* {endereco}

🔧 *Serviço:*
{tipo_servico} - {equipamento}

💡 *Dica:* Mantenha o local acessível para facilitar o atendimento.

Em caso de dúvidas, responda esta mensagem!

_Mensagem automática - não responda_
```

#### Template: Orçamento Aprovação
```
💰 *ORÇAMENTO #{orcamento_numero}*

Olá *{cliente_nome}*!

Segue orçamento para o serviço solicitado:

📋 *Itens:*
{lista_itens}

💵 *Valor Total:* R$ {valor_total}
⏰ *Validade:* {validade}

Para aprovar o orçamento, clique no link abaixo:
👉 {link_aprovacao}

Dúvidas? Responda esta mensagem!

🔧 *{nome_empresa}*
📱 {telefone_empresa}
```

#### Template: Serviço Concluído
```
✅ *SERVIÇO CONCLUÍDO*

Olá *{cliente_nome}*!

Seu serviço foi finalizado com sucesso! 🎉

📋 *OS:* #{os_numero}
✔️ *Serviço:* {tipo_servico}
👨‍🔧 *Técnico:* {tecnico_nome}
📅 *Concluído em:* {data_conclusao}

💵 *Valor do Serviço:* R$ {valor_servico}
{status_pagamento}

📝 *Observações:*
{observacoes}

Obrigado pela preferência! 
Avalie nosso serviço: {link_avaliacao}

🔧 *{nome_empresa}*
```

#### Template: Lembrete de Visita
```
⏰ *LEMBRETE DE VISITA*

Olá *{cliente_nome}*!

Lembrando que temos um atendimento agendado:

📅 *Amanhã* - {data}
🕐 {hora}
📍 {endereco}

👨‍🔧 Técnico *{tecnico_nome}* estará presente.

Precisa reagendar? Responda esta mensagem!

🔧 *{nome_empresa}*
```

### 5.3 Implementação Webhook

```javascript
// Receber mensagens do cliente
app.post('/api/whatsapp/webhook', async (req, res) => {
  const { from, body, messageId } = req.body;
  
  try {
    // Buscar cliente pelo número
    const client = await findClientByPhone(from);
    
    // Registrar mensagem no log
    await logWhatsAppMessage({
      clientId: client?.id,
      messageType: 'received',
      messageContent: body,
      status: 'received',
      sentAt: new Date()
    });
    
    // Auto-resposta (opcional)
    if (body.toLowerCase().includes('orçamento')) {
      await sendWhatsAppMessage(from, 
        'Obrigado pelo contato! Um de nossos atendentes responderá em breve.');
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});
```

---

## 🎨 6. DESIGN E UI/UX

### 6.1 Paleta de Cores

```css
:root {
  /* Cores Principais */
  --primary-color: #0066CC;        /* Azul profissional */
  --secondary-color: #00A86B;      /* Verde sucesso */
  --accent-color: #FF6B35;         /* Laranja destaque */
  
  /* Status */
  --status-open: #FFA500;          /* Laranja - Aberto */
  --status-progress: #1E90FF;      /* Azul - Em Andamento */
  --status-waiting: #FFD700;       /* Amarelo - Aguardando */
  --status-completed: #32CD32;     /* Verde - Concluído */
  --status-cancelled: #DC143C;     /* Vermelho - Cancelado */
  
  /* Tipos de Serviço */
  --service-refrigeration: #00CED1; /* Ciano - Refrigeração */
  --service-electrical: #FFD700;    /* Amarelo - Elétrica */
  
  /* Neutros */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F5F5F5;
  --text-primary: #333333;
  --text-secondary: #666666;
  --border-color: #DDDDDD;
}
```

### 6.2 Componentes Reutilizáveis

- **StatusBadge**: Badge colorido para status
- **ServiceTypeIcon**: Ícone baseado no tipo de serviço
- **ClientCard**: Card compacto de cliente
- **OrderCard**: Card de ordem de serviço
- **QuoteCard**: Card de orçamento
- **MapView**: Visualização de mapa
- **PhotoGallery**: Galeria de fotos
- **WhatsAppButton**: Botão de ação WhatsApp

### 6.3 Responsividade

```css
/* Mobile First */
.container {
  padding: 16px;
  max-width: 100%;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 720px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 24px;
  }
}
```

---

## 🔄 7. PWA - PROGRESSIVE WEB APP

### 7.1 Manifest (manifest.json)

```json
{
  "name": "RefriElétrica - Gestão de Serviços",
  "short_name": "RefriElétrica",
  "description": "Sistema de gestão para refrigeração e elétrica",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#FFFFFF",
  "theme_color": "#0066CC",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### 7.2 Service Worker Básico

```javascript
const CACHE_NAME = 'refri-eletrica-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/offline.html'
];

// Instalação
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Ativação
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - Network First, Cache Fallback
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache nova resposta
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se falhar, busca do cache
        return caches.match(event.request);
      })
  );
});
```

### 7.3 Funcionalidade Offline

- Salvar OS criadas no IndexedDB
- Sincronizar quando voltar online
- Indicador visual de status offline
- Fila de mensagens WhatsApp pendentes

---

## 📦 8. ESTRUTURA DE ARQUIVOS

```
project-root/
│
├── frontend/                    # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Serviços core
│   │   │   │   ├── auth/
│   │   │   │   ├── http/
│   │   │   │   └── storage/
│   │   │   ├── features/       # Módulos de funcionalidade
│   │   │   │   ├── dashboard/
│   │   │   │   ├── clients/
│   │   │   │   ├── orders/
│   │   │   │   ├── quotes/
│   │   │   │   ├── technicians/
│   │   │   │   ├── payments/
│   │   │   │   └── whatsapp/
│   │   │   ├── shared/         # Componentes compartilhados
│   │   │   │   ├── components/
│   │   │   │   ├── directives/
│   │   │   │   ├── pipes/
│   │   │   │   └── models/
│   │   │   └── app.component.ts
│   │   ├── assets/
│   │   │   ├── icons/
│   │   │   ├── images/
│   │   │   └── i18n/
│   │   ├── manifest.json
│   │   └── service-worker.js
│   └── package.json
│
├── src/                        # Backend (Node.js)
│   ├── domain/                 # Entidades e interfaces
│   │   ├── entities/
│   │   │   ├── Client.js
│   │   │   ├── Order.js
│   │   │   ├── Quote.js
│   │   │   ├── Payment.js
│   │   │   ├── Technician.js
│   │   │   └── WhatsAppLog.js
│   │   └── interfaces/
│   │       ├── IClientRepository.js
│   │       ├── IOrderRepository.js
│   │       └── IQuoteRepository.js
│   │
│   ├── application/            # Lógica de negócio
│   │   └── services/
│   │       ├── ClientService.js
│   │       ├── OrderService.js
│   │       ├── QuoteService.js
│   │       ├── PaymentService.js
│   │       ├── TechnicianService.js
│   │       └── WhatsAppService.js
│   │
│   ├── infrastructure/         # Implementações
│   │   ├── database/
│   │   │   └── supabase.js
│   │   ├── repositories/
│   │   │   ├── SupabaseClientRepository.js
│   │   │   ├── SupabaseOrderRepository.js
│   │   │   └── SupabaseQuoteRepository.js
│   │   ├── whatsapp/
│   │   │   └── baileys-adapter.js
│   │   └── storage/
│   │       └── SupabaseStorageService.js
│   │
│   └── presentation/           # API Routes
│       ├── routes/
│       │   ├── clientRoutes.js
│       │   ├── orderRoutes.js
│       │   ├── quoteRoutes.js
│       │   ├── paymentRoutes.js
│       │   ├── technicianRoutes.js
│       │   ├── whatsappRoutes.js
│       │   └── dashboardRoutes.js
│       └── middleware/
│           ├── authMiddleware.js
│           └── errorMiddleware.js
│
├── database/
│   ├── schema.sql              # Schema completo
│   ├── migrations/             # Migrações
│   └── seeds/                  # Dados iniciais
│
├── docs/
│   ├── API.md                  # Documentação da API
│   ├── DEPLOYMENT.md           # Guia de deploy
│   └── USER_GUIDE.md           # Guia do usuário
│
├── .env.example                # Variáveis de ambiente
├── server.js                   # Servidor principal
└── package.json
```

---

## 🚀 9. PRÓXIMOS PASSOS DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial ✅
- [x] Documentação completa
- [ ] Configurar variáveis de ambiente
- [ ] Criar schema do banco de dados

### Fase 2: Backend Core
- [ ] Implementar entidades
- [ ] Criar repositories
- [ ] Desenvolver serviços
- [ ] Criar rotas da API

### Fase 3: Frontend Core
- [ ] Criar componentes base
- [ ] Implementar dashboard
- [ ] Criar gestão de clientes
- [ ] Desenvolver gestão de OS

### Fase 4: Funcionalidades Avançadas
- [ ] Implementar orçamentos
- [ ] Sistema de pagamentos
- [ ] Gestão de técnicos
- [ ] Integração WhatsApp

### Fase 5: PWA e Offline
- [ ] Configurar Service Worker
- [ ] Implementar cache offline
- [ ] Sincronização background

### Fase 6: Testes e Deploy
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Deploy em produção
- [ ] Documentação final

---

## 📚 RECURSOS ADICIONAIS

### Documentação Técnica
- **Ver**: `docs/API.md` - Documentação completa da API
- **Ver**: `docs/DATABASE.md` - Estrutura do banco de dados
- **Ver**: `docs/WHATSAPP.md` - Guia de integração WhatsApp

### Guias de Uso
- **Ver**: `docs/USER_GUIDE.md` - Manual do usuário
- **Ver**: `docs/DEPLOYMENT.md` - Guia de implantação
- **Ver**: `docs/SETUP.md` - Configuração inicial

---

**Documento criado em**: 12/12/2025
**Versão**: 1.0.0
**Status**: ✅ Completo e pronto para implementação
