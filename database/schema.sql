-- ============================================================================
-- SCHEMA DO BANCO DE DADOS - Sistema de Refrigeração e Elétrica
-- ============================================================================
-- Descrição: Schema completo para sistema de gestão de serviços
-- Banco: PostgreSQL / Supabase
-- Versão: 1.0.0
-- Data: 12/12/2025
-- ============================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- Para geolocalização

-- ============================================================================
-- TABELA: users
-- Descrição: Usuários do sistema (admin, técnicos, atendentes)
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'technician', 'attendant', 'manager')),
    phone VARCHAR(20),
    avatar_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);

-- ============================================================================
-- TABELA: technicians
-- Descrição: Dados adicionais dos técnicos
-- ============================================================================
CREATE TABLE technicians (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    specialization VARCHAR(100)[] NOT NULL, -- Array: ['refrigeration', 'electrical']
    crea_number VARCHAR(50), -- Número do CREA (se aplicável)
    cpf VARCHAR(14),
    available BOOLEAN DEFAULT true,
    working_hours JSONB, -- Horários de trabalho
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Índices
CREATE INDEX idx_technicians_user_id ON technicians(user_id);
CREATE INDEX idx_technicians_available ON technicians(available);

-- ============================================================================
-- TABELA: clients
-- Descrição: Clientes da empresa
-- ============================================================================
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp VARCHAR(20),
    cpf_cnpj VARCHAR(18),
    
    -- Endereço
    address TEXT,
    address_number VARCHAR(20),
    address_complement VARCHAR(100),
    neighborhood VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    
    -- Geolocalização
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326), -- PostGIS para consultas espaciais
    
    -- Outras informações
    notes TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_clients_name ON clients(name);
CREATE INDEX idx_clients_phone ON clients(phone);
CREATE INDEX idx_clients_whatsapp ON clients(whatsapp);
CREATE INDEX idx_clients_cpf_cnpj ON clients(cpf_cnpj);
CREATE INDEX idx_clients_city ON clients(city);
CREATE INDEX idx_clients_active ON clients(active);
CREATE INDEX idx_clients_location ON clients USING GIST(location);

-- ============================================================================
-- TABELA: services
-- Descrição: Tipos de serviços oferecidos
-- ============================================================================
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('refrigeration', 'electrical', 'both')),
    description TEXT,
    base_price DECIMAL(10, 2),
    estimated_duration INTEGER, -- Duração em minutos
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_services_type ON services(type);
CREATE INDEX idx_services_active ON services(active);

-- ============================================================================
-- TABELA: orders
-- Descrição: Ordens de Serviço (OS)
-- ============================================================================
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL, -- Ex: OS-2025-0001
    
    -- Relacionamentos
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    technician_id UUID REFERENCES technicians(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE RESTRICT,
    
    -- Detalhes do serviço
    type VARCHAR(50) NOT NULL CHECK (type IN ('refrigeration', 'electrical')),
    equipment VARCHAR(255),
    problem_description TEXT NOT NULL,
    solution_description TEXT,
    
    -- Status e prioridade
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting_parts', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Datas
    scheduled_date TIMESTAMP WITH TIME ZONE,
    started_at TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    
    -- Localização
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    location GEOGRAPHY(POINT, 4326),
    address TEXT,
    
    -- Observações
    notes TEXT,
    internal_notes TEXT, -- Notas internas não visíveis ao cliente
    
    -- Valores
    estimated_cost DECIMAL(10, 2),
    final_cost DECIMAL(10, 2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_client_id ON orders(client_id);
CREATE INDEX idx_orders_technician_id ON orders(technician_id);
CREATE INDEX idx_orders_service_id ON orders(service_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_priority ON orders(priority);
CREATE INDEX idx_orders_type ON orders(type);
CREATE INDEX idx_orders_scheduled_date ON orders(scheduled_date);
CREATE INDEX idx_orders_location ON orders USING GIST(location);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- TABELA: order_photos
-- Descrição: Fotos das ordens de serviço
-- ============================================================================
CREATE TABLE order_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    file_type VARCHAR(50), -- 'before', 'during', 'after', 'problem', 'solution'
    file_size INTEGER,
    mime_type VARCHAR(100),
    description TEXT,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_order_photos_order_id ON order_photos(order_id);
CREATE INDEX idx_order_photos_file_type ON order_photos(file_type);

-- ============================================================================
-- TABELA: quotes
-- Descrição: Orçamentos
-- ============================================================================
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_number VARCHAR(50) UNIQUE NOT NULL, -- Ex: ORC-2025-0001
    
    -- Relacionamentos
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Itens do orçamento (JSON)
    items JSONB NOT NULL, -- Array de itens: [{description, quantity, unit_price, total}]
    
    -- Valores
    subtotal DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'approved', 'rejected', 'expired')),
    
    -- Datas
    valid_until DATE,
    sent_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    rejected_at TIMESTAMP WITH TIME ZONE,
    
    -- Observações
    notes TEXT,
    terms_conditions TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_quotes_quote_number ON quotes(quote_number);
CREATE INDEX idx_quotes_client_id ON quotes(client_id);
CREATE INDEX idx_quotes_order_id ON quotes(order_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created_at ON quotes(created_at DESC);

-- ============================================================================
-- TABELA: payments
-- Descrição: Pagamentos recebidos
-- ============================================================================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
    received_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Valores
    amount DECIMAL(10, 2) NOT NULL,
    
    -- Forma de pagamento
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'debit_card', 'credit_card', 'pix', 'bank_transfer', 'check')),
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'refunded')),
    
    -- Datas
    due_date DATE,
    paid_at TIMESTAMP WITH TIME ZONE,
    
    -- Observações
    notes TEXT,
    receipt_url TEXT, -- URL do comprovante
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_quote_id ON payments(quote_id);
CREATE INDEX idx_payments_client_id ON payments(client_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_payment_method ON payments(payment_method);
CREATE INDEX idx_payments_paid_at ON payments(paid_at DESC);
CREATE INDEX idx_payments_due_date ON payments(due_date);

-- ============================================================================
-- TABELA: whatsapp_logs
-- Descrição: Log de mensagens do WhatsApp
-- ============================================================================
CREATE TABLE whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    quote_id UUID REFERENCES quotes(id) ON DELETE SET NULL,
    
    -- Dados da mensagem
    phone_number VARCHAR(20) NOT NULL,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('confirmation', 'reminder', 'quote', 'completion', 'custom', 'received')),
    message_content TEXT NOT NULL,
    
    -- Status de entrega
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Erros
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    
    -- WhatsApp message ID
    whatsapp_message_id VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_whatsapp_logs_client_id ON whatsapp_logs(client_id);
CREATE INDEX idx_whatsapp_logs_order_id ON whatsapp_logs(order_id);
CREATE INDEX idx_whatsapp_logs_quote_id ON whatsapp_logs(quote_id);
CREATE INDEX idx_whatsapp_logs_phone_number ON whatsapp_logs(phone_number);
CREATE INDEX idx_whatsapp_logs_message_type ON whatsapp_logs(message_type);
CREATE INDEX idx_whatsapp_logs_status ON whatsapp_logs(status);
CREATE INDEX idx_whatsapp_logs_created_at ON whatsapp_logs(created_at DESC);

-- ============================================================================
-- TABELA: audit_logs
-- Descrição: Log de auditoria de ações no sistema
-- ============================================================================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Usuário que realizou a ação
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Ação realizada
    action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'login', 'logout'
    entity_type VARCHAR(50) NOT NULL, -- 'order', 'client', 'quote', etc
    entity_id UUID,
    
    -- Dados da mudança
    old_values JSONB,
    new_values JSONB,
    
    -- Informações de contexto
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- TABELA: company_settings
-- Descrição: Configurações da empresa
-- ============================================================================
CREATE TABLE company_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    company_cnpj VARCHAR(18),
    company_phone VARCHAR(20),
    company_email VARCHAR(255),
    company_whatsapp VARCHAR(20),
    
    -- Endereço
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    
    -- Logo
    logo_url TEXT,
    
    -- Configurações de WhatsApp
    whatsapp_enabled BOOLEAN DEFAULT false,
    whatsapp_api_key TEXT,
    whatsapp_instance_id TEXT,
    
    -- Outras configurações
    settings JSONB, -- Configurações gerais em JSON
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABELA: schedules
-- Descrição: Agenda de técnicos
-- ============================================================================
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    technician_id UUID NOT NULL REFERENCES technicians(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
    
    -- Data e hora
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    
    -- Observações
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX idx_schedules_technician_id ON schedules(technician_id);
CREATE INDEX idx_schedules_order_id ON schedules(order_id);
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_schedules_status ON schedules(status);

-- ============================================================================
-- TRIGGERS - Atualizar updated_at automaticamente
-- ============================================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotes_updated_at BEFORE UPDATE ON quotes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER - Atualizar location quando latitude/longitude mudarem
-- ============================================================================

-- Para clients
CREATE OR REPLACE FUNCTION update_client_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_location_trigger
    BEFORE INSERT OR UPDATE OF latitude, longitude ON clients
    FOR EACH ROW EXECUTE FUNCTION update_client_location();

-- Para orders
CREATE OR REPLACE FUNCTION update_order_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_order_location_trigger
    BEFORE INSERT OR UPDATE OF latitude, longitude ON orders
    FOR EACH ROW EXECUTE FUNCTION update_order_location();

-- ============================================================================
-- TRIGGER - Auto-gerar números de OS e Orçamentos
-- ============================================================================

-- Função para gerar número de OS
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_number INTEGER;
BEGIN
    IF NEW.order_number IS NULL THEN
        year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
        
        -- Obter próximo número da sequência
        SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 9) AS INTEGER)), 0) + 1
        INTO sequence_number
        FROM orders
        WHERE order_number LIKE 'OS-' || year_part || '-%';
        
        NEW.order_number := 'OS-' || year_part || '-' || LPAD(sequence_number::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Função para gerar número de orçamento
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
    year_part VARCHAR(4);
    sequence_number INTEGER;
BEGIN
    IF NEW.quote_number IS NULL THEN
        year_part := TO_CHAR(CURRENT_DATE, 'YYYY');
        
        SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 10) AS INTEGER)), 0) + 1
        INTO sequence_number
        FROM quotes
        WHERE quote_number LIKE 'ORC-' || year_part || '-%';
        
        NEW.quote_number := 'ORC-' || year_part || '-' || LPAD(sequence_number::TEXT, 4, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_quote_number_trigger
    BEFORE INSERT ON quotes
    FOR EACH ROW EXECUTE FUNCTION generate_quote_number();

-- ============================================================================
-- VIEWS - Consultas úteis
-- ============================================================================

-- View: Ordens com informações completas
CREATE OR REPLACE VIEW v_orders_full AS
SELECT 
    o.id,
    o.order_number,
    o.status,
    o.priority,
    o.type,
    o.equipment,
    o.problem_description,
    o.scheduled_date,
    o.completion_date,
    
    -- Cliente
    c.id AS client_id,
    c.name AS client_name,
    c.phone AS client_phone,
    c.whatsapp AS client_whatsapp,
    c.address AS client_address,
    c.city AS client_city,
    
    -- Técnico
    t.id AS technician_id,
    u.name AS technician_name,
    u.phone AS technician_phone,
    
    -- Serviço
    s.id AS service_id,
    s.name AS service_name,
    s.type AS service_type,
    
    -- Valores
    o.estimated_cost,
    o.final_cost,
    
    o.created_at,
    o.updated_at
FROM orders o
LEFT JOIN clients c ON o.client_id = c.id
LEFT JOIN technicians t ON o.technician_id = t.id
LEFT JOIN users u ON t.user_id = u.id
LEFT JOIN services s ON o.service_id = s.id;

-- View: Estatísticas do dashboard
CREATE OR REPLACE VIEW v_dashboard_stats AS
SELECT
    (SELECT COUNT(*) FROM orders WHERE status = 'open') AS orders_open,
    (SELECT COUNT(*) FROM orders WHERE status = 'in_progress') AS orders_in_progress,
    (SELECT COUNT(*) FROM orders WHERE status = 'waiting_parts') AS orders_waiting_parts,
    (SELECT COUNT(*) FROM orders WHERE DATE(scheduled_date) = CURRENT_DATE) AS orders_today,
    (SELECT COUNT(*) FROM quotes WHERE status = 'pending') AS quotes_pending,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'pending') AS payments_pending,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed' AND DATE(paid_at) = CURRENT_DATE) AS revenue_today,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE status = 'completed' AND EXTRACT(MONTH FROM paid_at) = EXTRACT(MONTH FROM CURRENT_DATE)) AS revenue_month;

-- ============================================================================
-- DADOS INICIAIS
-- ============================================================================

-- Inserir configurações padrão da empresa
INSERT INTO company_settings (company_name) 
VALUES ('Refrigeração e Elétrica') 
ON CONFLICT DO NOTHING;

-- Inserir serviços padrão
INSERT INTO services (name, type, description, base_price) VALUES
('Instalação de Ar-Condicionado', 'refrigeration', 'Instalação completa de aparelho de ar-condicionado', 350.00),
('Manutenção de Ar-Condicionado', 'refrigeration', 'Limpeza e manutenção preventiva', 150.00),
('Recarga de Gás', 'refrigeration', 'Recarga de gás refrigerante', 200.00),
('Reparo de Geladeira', 'refrigeration', 'Conserto geral de refrigerador', 180.00),
('Instalação Elétrica Residencial', 'electrical', 'Instalação elétrica completa', 500.00),
('Manutenção Elétrica', 'electrical', 'Manutenção preventiva e corretiva', 120.00),
('Troca de Disjuntor', 'electrical', 'Substituição de disjuntor', 80.00),
('Instalação de Ventilador de Teto', 'electrical', 'Instalação completa', 100.00)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- COMENTÁRIOS NAS TABELAS E COLUNAS
-- ============================================================================

COMMENT ON TABLE users IS 'Usuários do sistema (admin, técnicos, atendentes)';
COMMENT ON TABLE technicians IS 'Dados adicionais dos técnicos';
COMMENT ON TABLE clients IS 'Clientes da empresa';
COMMENT ON TABLE services IS 'Tipos de serviços oferecidos';
COMMENT ON TABLE orders IS 'Ordens de Serviço (OS)';
COMMENT ON TABLE order_photos IS 'Fotos das ordens de serviço';
COMMENT ON TABLE quotes IS 'Orçamentos';
COMMENT ON TABLE payments IS 'Pagamentos recebidos';
COMMENT ON TABLE whatsapp_logs IS 'Log de mensagens do WhatsApp';
COMMENT ON TABLE audit_logs IS 'Log de auditoria de ações no sistema';
COMMENT ON TABLE company_settings IS 'Configurações da empresa';
COMMENT ON TABLE schedules IS 'Agenda de técnicos';

-- ============================================================================
-- FIM DO SCHEMA
-- ============================================================================
