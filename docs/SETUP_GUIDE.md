# 🚀 Guia de Configuração e Implantação

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 14+ ou conta Supabase (gratuita)
- Git instalado
- Editor de código (VS Code recomendado)

---

## 🔧 1. Configuração Inicial

### 1.1 Clonar Repositório

```bash
git clone https://github.com/sanpaa/CRM-Imobil.git
cd CRM-Imobil
```

### 1.2 Instalar Dependências

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
cd ..
```

### 1.3 Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Supabase (Gratuito - https://supabase.com)
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica-anon
SUPABASE_SERVICE_KEY=sua-chave-service-role

# JWT
JWT_SECRET=sua-chave-secreta-aqui-muito-segura-123456

# Empresa
COMPANY_NAME=Refrigeração e Elétrica
COMPANY_PHONE=(11) 99999-9999
COMPANY_EMAIL=contato@empresa.com
COMPANY_WHATSAPP=(11) 99999-9999

# App URL
APP_URL=http://localhost:4200

# WhatsApp (Opcional)
WHATSAPP_ENABLED=true
```

---

## 🗄️ 2. Configurar Banco de Dados

### Opção A: Usar Supabase (Recomendado - Gratuito)

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma conta gratuita
3. Crie um novo projeto
4. Copie as credenciais (URL e chaves)
5. No painel do Supabase, vá em "SQL Editor"
6. Execute o script `database/schema.sql`

```sql
-- Cole o conteúdo de database/schema.sql e execute
```

### Opção B: PostgreSQL Local

```bash
# Criar banco de dados
createdb refri_eletrica

# Executar schema
psql refri_eletrica < database/schema.sql
```

Configurar `.env`:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/refri_eletrica
```

---

## 👤 3. Criar Usuário Admin

Execute o script de seed para criar um usuário administrador:

```bash
node database/seeds/create-admin.js
```

Ou crie manualmente no Supabase SQL Editor:

```sql
-- Criar usuário admin
INSERT INTO users (name, email, password_hash, role, active)
VALUES (
  'Administrador',
  'admin@empresa.com',
  -- Senha: admin123 (troque depois!)
  '$2a$10$8K1p/a0dL3LlL3LlL3LlL3LlL3LlL3LlL3LlL3LlL3LlL3LlL3Ll',
  'admin',
  true
);
```

**Credenciais padrão:**
- Email: `admin@empresa.com`
- Senha: `admin123`

⚠️ **IMPORTANTE**: Altere a senha após primeiro login!

---

## 🔐 4. Configurar Autenticação

O sistema usa JWT para autenticação. A configuração já está incluída no código.

Para gerar uma chave JWT segura:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Cole o resultado em `.env` como `JWT_SECRET`.

---

## 💬 5. Configurar WhatsApp (Opcional)

### Usando Baileys (Gratuito)

1. Instalar dependência:

```bash
npm install @whiskeysockets/baileys @hapi/boom
```

2. Inicializar WhatsApp:

```bash
npm run whatsapp:init
```

3. Escanear QR Code que aparecerá no terminal com seu WhatsApp

4. Aguardar confirmação de conexão

**Importante**: Use um número dedicado para testes, não seu número pessoal.

---

## 🚀 6. Executar o Sistema

### Modo Desenvolvimento

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

Acesse:
- Frontend: `http://localhost:4200`
- API: `http://localhost:3000/api`

### Modo Produção

```bash
# Build do frontend
cd frontend
npm run build
cd ..

# Executar servidor
npm start
```

Acesse: `http://localhost:3000`

---

## 📱 7. Configurar PWA

### 7.1 Adicionar Service Worker ao Angular

```bash
cd frontend
ng add @angular/pwa
```

### 7.2 Configurar manifest.json

O arquivo `manifest.json` já está criado em `frontend/src/manifest.json`.

### 7.3 Gerar Ícones

Você precisa criar ícones para o PWA:

1. Crie um ícone 512x512px
2. Use ferramentas online para gerar todos os tamanhos
3. Salve em `frontend/src/assets/icons/`

Tamanhos necessários:
- 72x72
- 96x96
- 128x128
- 144x144
- 152x152
- 192x192
- 384x384
- 512x512

### 7.4 Testar PWA

1. Build de produção:
```bash
cd frontend
npm run build
```

2. Servir com HTTPS (PWA requer HTTPS):
```bash
npx http-server -p 8080 --ssl
```

3. Abrir em dispositivo móvel e testar instalação

---

## ☁️ 8. Deploy em Produção

### Opção A: Vercel (Frontend) + Render (Backend)

#### Frontend no Vercel:

1. Acesse [vercel.com](https://vercel.com)
2. Importe o repositório
3. Configure:
   - Framework: Angular
   - Build Command: `cd frontend && npm run build`
   - Output Directory: `frontend/dist/frontend/browser`

4. Adicione variáveis de ambiente:
```
NEXT_PUBLIC_API_URL=https://seu-backend.onrender.com/api
```

#### Backend no Render:

1. Acesse [render.com](https://render.com)
2. Crie novo Web Service
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. Adicione variáveis de ambiente (mesmo do `.env`)

### Opção B: Netlify (Tudo-em-um)

1. Acesse [netlify.com](https://netlify.com)
2. Importe repositório
3. Configure:
   - Build Command: `npm run build`
   - Publish Directory: `frontend/dist/frontend/browser`
   - Functions Directory: `netlify/functions`

4. Configure serverless functions para o backend

### Opção C: Servidor VPS (DigitalOcean, Linode, etc)

```bash
# Conectar ao servidor
ssh usuario@seu-servidor.com

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PM2
sudo npm install -g pm2

# Clonar repositório
git clone https://github.com/sanpaa/CRM-Imobil.git
cd CRM-Imobil

# Instalar dependências
npm install
cd frontend && npm install && cd ..

# Build
npm run build:prod

# Configurar .env
nano .env
# (Cole suas configurações)

# Iniciar com PM2
pm2 start npm --name "refri-eletrica" -- start
pm2 save
pm2 startup

# Configurar Nginx
sudo nano /etc/nginx/sites-available/refri-eletrica

# Cole:
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Ativar site
sudo ln -s /etc/nginx/sites-available/refri-eletrica /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Configurar SSL com Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

---

## 🔒 9. Segurança

### 9.1 Checklist de Segurança

- [ ] Alterar senha padrão do admin
- [ ] Gerar JWT_SECRET forte
- [ ] Configurar HTTPS
- [ ] Configurar CORS adequadamente
- [ ] Ativar rate limiting
- [ ] Manter dependências atualizadas
- [ ] Fazer backup regular do banco

### 9.2 Configurar CORS

Em `server.js`:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));
```

### 9.3 Rate Limiting

Já configurado no projeto:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite de 100 requisições
});

app.use('/api/', limiter);
```

---

## 📊 10. Monitoramento

### 10.1 Logs

Ver logs em produção:

```bash
# PM2
pm2 logs refri-eletrica

# Docker
docker logs nome-container

# Render/Netlify
Usar interface web
```

### 10.2 Métricas

Ferramentas recomendadas:
- **Sentry** - Rastreamento de erros
- **Google Analytics** - Análise de uso
- **Uptime Robot** - Monitoramento de disponibilidade

---

## 🔄 11. Atualizações

### Atualizar sistema em produção:

```bash
# Conectar ao servidor
ssh usuario@servidor

# Ir para diretório
cd CRM-Imobil

# Puxar alterações
git pull origin main

# Instalar novas dependências
npm install
cd frontend && npm install && cd ..

# Rebuild
npm run build:prod

# Reiniciar
pm2 restart refri-eletrica
```

---

## 📚 12. Recursos Adicionais

### Documentação:
- [Angular](https://angular.io/docs)
- [Node.js](https://nodejs.org/docs)
- [Supabase](https://supabase.com/docs)
- [PostgreSQL](https://www.postgresql.org/docs/)

### Comunidade:
- GitHub Issues
- Discord
- Stack Overflow

---

## ❓ 13. Solução de Problemas

### Erro: "Cannot connect to database"

Verifique:
1. Variáveis SUPABASE_URL e SUPABASE_KEY em `.env`
2. Firewall não está bloqueando conexão
3. Supabase projeto está ativo

### Erro: "JWT token invalid"

Verifique:
1. JWT_SECRET está configurado
2. Token não expirou
3. Formato do token está correto

### WhatsApp não conecta

Verifique:
1. QR Code foi escaneado
2. Celular está com internet
3. WhatsApp não está aberto em outro lugar
4. Logs para mais detalhes

### Build falha

```bash
# Limpar cache
rm -rf node_modules package-lock.json
cd frontend && rm -rf node_modules package-lock.json && cd ..

# Reinstalar
npm install
cd frontend && npm install && cd ..

# Tentar build novamente
npm run build:prod
```

---

## 📞 Suporte

Para dúvidas e problemas:
1. Consultar documentação
2. Verificar issues no GitHub
3. Criar novo issue com detalhes do problema

---

**Criado em**: 12/12/2025
**Versão**: 1.0.0
**Status**: Pronto para uso
