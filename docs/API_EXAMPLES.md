# 🔌 API - Exemplos de Código

## 📋 Índice

1. [Serviços (Services)](#serviços-services)
2. [Repositórios (Repositories)](#repositórios-repositories)
3. [Rotas (Routes)](#rotas-routes)
4. [Exemplos de Uso](#exemplos-de-uso)

---

## Serviços (Services)

### ClientService.js

```javascript
// src/application/services/ClientService.js
const Client = require('../../domain/entities/Client');

class ClientService {
  constructor(clientRepository) {
    this.clientRepository = clientRepository;
  }

  /**
   * Cria novo cliente
   */
  async create(clientData) {
    const client = new Client(clientData);
    
    // Validar
    const validation = client.validate();
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Salvar
    return await this.clientRepository.create(client);
  }

  /**
   * Busca cliente por ID
   */
  async getById(id) {
    const client = await this.clientRepository.findById(id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }
    return client;
  }

  /**
   * Lista todos os clientes
   */
  async list(filters = {}) {
    return await this.clientRepository.findAll(filters);
  }

  /**
   * Atualiza cliente
   */
  async update(id, clientData) {
    const existing = await this.getById(id);
    
    const updated = new Client({
      ...existing,
      ...clientData,
      id: existing.id
    });

    const validation = updated.validate();
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    return await this.clientRepository.update(id, updated);
  }

  /**
   * Remove cliente
   */
  async delete(id) {
    const client = await this.getById(id);
    return await this.clientRepository.delete(id);
  }

  /**
   * Busca histórico de serviços do cliente
   */
  async getOrderHistory(clientId) {
    return await this.clientRepository.findOrdersByClient(clientId);
  }

  /**
   * Busca clientes por telefone/WhatsApp
   */
  async findByPhone(phone) {
    return await this.clientRepository.findByPhone(phone);
  }
}

module.exports = ClientService;
```

### OrderService.js

```javascript
// src/application/services/OrderService.js
const Order = require('../../domain/entities/Order');

class OrderService {
  constructor(orderRepository, clientRepository, whatsappService) {
    this.orderRepository = orderRepository;
    this.clientRepository = clientRepository;
    this.whatsappService = whatsappService;
  }

  /**
   * Cria nova ordem de serviço
   */
  async create(orderData) {
    const order = new Order(orderData);
    
    // Validar
    const validation = order.validate();
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Verificar se cliente existe
    const client = await this.clientRepository.findById(order.client_id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Salvar ordem
    const savedOrder = await this.orderRepository.create(order);

    // Enviar confirmação por WhatsApp (se configurado)
    try {
      if (client.whatsapp && this.whatsappService) {
        await this.whatsappService.sendScheduleConfirmation(
          savedOrder,
          client,
          null // técnico ainda não atribuído
        );
      }
    } catch (error) {
      console.error('Erro ao enviar WhatsApp:', error);
      // Não falha a criação da OS se WhatsApp falhar
    }

    return savedOrder;
  }

  /**
   * Busca ordem por ID
   */
  async getById(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Ordem de serviço não encontrada');
    }
    return order;
  }

  /**
   * Lista ordens com filtros
   */
  async list(filters = {}) {
    return await this.orderRepository.findAll(filters);
  }

  /**
   * Atualiza ordem
   */
  async update(id, orderData) {
    const existing = await this.getById(id);
    
    const updated = new Order({
      ...existing,
      ...orderData,
      id: existing.id
    });

    const validation = updated.validate();
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    return await this.orderRepository.update(id, updated);
  }

  /**
   * Atualiza status da ordem
   */
  async updateStatus(id, newStatus) {
    const order = await this.getById(id);
    order.updateStatus(newStatus);
    
    const updated = await this.orderRepository.update(id, order);

    // Enviar notificação se concluído
    if (newStatus === 'completed') {
      try {
        const client = await this.clientRepository.findById(order.client_id);
        if (client.whatsapp && this.whatsappService) {
          await this.whatsappService.sendCompletion(updated, client);
        }
      } catch (error) {
        console.error('Erro ao enviar WhatsApp:', error);
      }
    }

    return updated;
  }

  /**
   * Atribui técnico à ordem
   */
  async assignTechnician(orderId, technicianId) {
    const order = await this.getById(orderId);
    order.technician_id = technicianId;
    return await this.orderRepository.update(orderId, order);
  }

  /**
   * Lista ordens por técnico
   */
  async getByTechnician(technicianId) {
    return await this.orderRepository.findByTechnician(technicianId);
  }

  /**
   * Lista ordens por status
   */
  async getByStatus(status) {
    return await this.orderRepository.findByStatus(status);
  }

  /**
   * Lista ordens do dia
   */
  async getToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.orderRepository.findByDateRange(today, tomorrow);
  }

  /**
   * Adiciona foto à ordem
   */
  async addPhoto(orderId, photoData) {
    const order = await this.getById(orderId);
    return await this.orderRepository.addPhoto(orderId, photoData);
  }

  /**
   * Remove ordem
   */
  async delete(id) {
    const order = await this.getById(id);
    return await this.orderRepository.delete(id);
  }
}

module.exports = OrderService;
```

### QuoteService.js

```javascript
// src/application/services/QuoteService.js
const Quote = require('../../domain/entities/Quote');

class QuoteService {
  constructor(quoteRepository, clientRepository, orderRepository, whatsappService) {
    this.quoteRepository = quoteRepository;
    this.clientRepository = clientRepository;
    this.orderRepository = orderRepository;
    this.whatsappService = whatsappService;
  }

  /**
   * Cria novo orçamento
   */
  async create(quoteData) {
    const quote = new Quote(quoteData);
    
    // Calcular valores
    quote.calculateValues();
    
    // Validar
    const validation = quote.validate();
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    // Verificar se cliente existe
    const client = await this.clientRepository.findById(quote.client_id);
    if (!client) {
      throw new Error('Cliente não encontrado');
    }

    // Salvar orçamento
    const savedQuote = await this.quoteRepository.create(quote);

    return savedQuote;
  }

  /**
   * Busca orçamento por ID
   */
  async getById(id) {
    const quote = await this.quoteRepository.findById(id);
    if (!quote) {
      throw new Error('Orçamento não encontrado');
    }
    return quote;
  }

  /**
   * Lista orçamentos
   */
  async list(filters = {}) {
    return await this.quoteRepository.findAll(filters);
  }

  /**
   * Atualiza orçamento
   */
  async update(id, quoteData) {
    const existing = await this.getById(id);
    
    if (existing.status === 'approved') {
      throw new Error('Orçamento já aprovado não pode ser editado');
    }

    const updated = new Quote({
      ...existing,
      ...quoteData,
      id: existing.id
    });

    updated.calculateValues();

    const validation = updated.validate();
    if (!validation.isValid) {
      throw new Error(`Validação falhou: ${validation.errors.join(', ')}`);
    }

    return await this.quoteRepository.update(id, updated);
  }

  /**
   * Envia orçamento por WhatsApp
   */
  async sendToClient(id) {
    const quote = await this.getById(id);
    const client = await this.clientRepository.findById(quote.client_id);

    if (!client.whatsapp) {
      throw new Error('Cliente não possui WhatsApp cadastrado');
    }

    // Atualizar status
    quote.updateStatus('sent');
    await this.quoteRepository.update(id, quote);

    // Enviar por WhatsApp
    if (this.whatsappService) {
      await this.whatsappService.sendQuote(quote, client);
    }

    return quote;
  }

  /**
   * Aprova orçamento
   */
  async approve(id) {
    const quote = await this.getById(id);
    
    if (quote.status === 'approved') {
      throw new Error('Orçamento já aprovado');
    }

    if (quote.isExpired()) {
      throw new Error('Orçamento expirado');
    }

    // Atualizar status
    quote.updateStatus('approved');
    const approvedQuote = await this.quoteRepository.update(id, quote);

    // Se tem ordem vinculada, atualizar status da ordem
    if (quote.order_id) {
      try {
        await this.orderRepository.update(quote.order_id, {
          status: 'in_progress',
          estimated_cost: quote.total
        });
      } catch (error) {
        console.error('Erro ao atualizar ordem:', error);
      }
    }

    return approvedQuote;
  }

  /**
   * Rejeita orçamento
   */
  async reject(id, reason) {
    const quote = await this.getById(id);
    
    quote.updateStatus('rejected');
    quote.notes = reason || quote.notes;
    
    return await this.quoteRepository.update(id, quote);
  }

  /**
   * Remove orçamento
   */
  async delete(id) {
    const quote = await this.getById(id);
    
    if (quote.status === 'approved') {
      throw new Error('Orçamento aprovado não pode ser removido');
    }

    return await this.quoteRepository.delete(id);
  }
}

module.exports = QuoteService;
```

---

## Repositórios (Repositories)

### SupabaseClientRepository.js

```javascript
// src/infrastructure/repositories/SupabaseClientRepository.js
const { createClient } = require('@supabase/supabase-js');
const Client = require('../../domain/entities/Client');

class SupabaseClientRepository {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    );
    this.table = 'clients';
  }

  /**
   * Cria novo cliente
   */
  async create(client) {
    const { data, error } = await this.supabase
      .from(this.table)
      .insert([client.toJSON()])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new Client(data);
  }

  /**
   * Busca cliente por ID
   */
  async findById(id) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data ? new Client(data) : null;
  }

  /**
   * Lista todos os clientes
   */
  async findAll(filters = {}) {
    let query = this.supabase.from(this.table).select('*');

    if (filters.active !== undefined) {
      query = query.eq('active', filters.active);
    }

    if (filters.city) {
      query = query.eq('city', filters.city);
    }

    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
    }

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data.map(item => new Client(item));
  }

  /**
   * Atualiza cliente
   */
  async update(id, client) {
    const { data, error } = await this.supabase
      .from(this.table)
      .update(client.toJSON())
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return new Client(data);
  }

  /**
   * Remove cliente
   */
  async delete(id) {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  }

  /**
   * Busca ordens de serviço do cliente
   */
  async findOrdersByClient(clientId) {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  /**
   * Busca cliente por telefone
   */
  async findByPhone(phone) {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('*')
      .or(`phone.eq.${phone},whatsapp.eq.${phone}`)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(error.message);
    }

    return data ? new Client(data) : null;
  }
}

module.exports = SupabaseClientRepository;
```

---

## Rotas (Routes)

### clientRoutes.js

```javascript
// src/presentation/routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const ClientService = require('../../application/services/ClientService');
const SupabaseClientRepository = require('../../infrastructure/repositories/SupabaseClientRepository');
const { authMiddleware } = require('../middleware/authMiddleware');

// Inicializar serviço
const clientRepository = new SupabaseClientRepository();
const clientService = new ClientService(clientRepository);

/**
 * GET /api/clients
 * Lista todos os clientes
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const filters = {
      active: req.query.active === 'true',
      city: req.query.city,
      search: req.query.search
    };

    const clients = await clientService.list(filters);
    
    res.json({
      success: true,
      data: clients
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/clients/:id
 * Busca cliente por ID
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await clientService.getById(req.params.id);
    
    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/clients
 * Cria novo cliente
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const client = await clientService.create(req.body);
    
    res.status(201).json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/clients/:id
 * Atualiza cliente
 */
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const client = await clientService.update(req.params.id, req.body);
    
    res.json({
      success: true,
      data: client
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/clients/:id
 * Remove cliente
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await clientService.delete(req.params.id);
    
    res.json({
      success: true,
      message: 'Cliente removido com sucesso'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/clients/:id/orders
 * Busca histórico de ordens do cliente
 */
router.get('/:id/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await clientService.getOrderHistory(req.params.id);
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

---

## Exemplos de Uso

### Criar Cliente

```bash
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999",
    "whatsapp": "(11) 99999-9999",
    "address": "Rua A",
    "address_number": "123",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zip_code": "01234-567"
  }'
```

### Criar Ordem de Serviço

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "client_id": "uuid-do-cliente",
    "type": "refrigeration",
    "equipment": "Ar-condicionado 12.000 BTUs",
    "problem_description": "Não liga",
    "scheduled_date": "2025-12-15T14:00:00Z",
    "priority": "normal"
  }'
```

### Criar Orçamento

```bash
curl -X POST http://localhost:3000/api/quotes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "client_id": "uuid-do-cliente",
    "order_id": "uuid-da-ordem",
    "items": [
      {
        "description": "Gás R-410A",
        "quantity": 2,
        "unit_price": 90.00
      },
      {
        "description": "Mão de obra",
        "quantity": 1,
        "unit_price": 120.00
      }
    ],
    "discount": 30.00,
    "valid_until": "2025-12-27"
  }'
```

### Aprovar Orçamento

```bash
curl -X POST http://localhost:3000/api/quotes/uuid-do-orcamento/approve \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

**Criado em**: 12/12/2025
**Versão**: 1.0.0
