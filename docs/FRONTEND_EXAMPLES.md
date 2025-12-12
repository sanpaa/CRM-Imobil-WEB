# 🎨 Frontend - Exemplos de Código Angular

## 📋 Estrutura de Componentes

```
frontend/src/app/
├── features/
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.component.css
│   ├── clients/
│   │   ├── client-list/
│   │   ├── client-form/
│   │   └── client-detail/
│   ├── orders/
│   │   ├── order-list/
│   │   ├── order-form/
│   │   └── order-detail/
│   └── quotes/
│       ├── quote-list/
│       ├── quote-form/
│       └── quote-detail/
├── shared/
│   ├── components/
│   │   ├── status-badge/
│   │   ├── client-card/
│   │   └── map-view/
│   └── services/
│       ├── client.service.ts
│       ├── order.service.ts
│       └── quote.service.ts
└── core/
    ├── auth/
    └── http/
```

---

## 🔧 Services

### client.service.ts

```typescript
// frontend/src/app/services/client.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Client {
  id?: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  cpf_cnpj?: string;
  address?: string;
  address_number?: string;
  address_complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  rating?: number;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = `${environment.apiUrl}/clients`;

  constructor(private http: HttpClient) {}

  /**
   * Lista todos os clientes
   */
  getAll(filters?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: filters });
  }

  /**
   * Busca cliente por ID
   */
  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  /**
   * Cria novo cliente
   */
  create(client: Client): Observable<any> {
    return this.http.post(this.apiUrl, client);
  }

  /**
   * Atualiza cliente
   */
  update(id: string, client: Client): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, client);
  }

  /**
   * Remove cliente
   */
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  /**
   * Busca histórico de ordens do cliente
   */
  getOrderHistory(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/orders`);
  }
}
```

### order.service.ts

```typescript
// frontend/src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
  id?: string;
  order_number?: string;
  client_id: string;
  technician_id?: string;
  service_id?: string;
  type: 'refrigeration' | 'electrical';
  equipment?: string;
  problem_description: string;
  solution_description?: string;
  status?: 'open' | 'in_progress' | 'waiting_parts' | 'completed' | 'cancelled';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  scheduled_date?: string;
  started_at?: string;
  completion_date?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  notes?: string;
  internal_notes?: string;
  estimated_cost?: number;
  final_cost?: number;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  getAll(filters?: any): Observable<any> {
    return this.http.get(this.apiUrl, { params: filters });
  }

  getById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  create(order: Order): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  update(id: string, order: Order): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, order);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, { status });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  assignTechnician(id: string, technicianId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/assign`, { technician_id: technicianId });
  }

  uploadPhoto(id: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post(`${this.apiUrl}/${id}/photos`, formData);
  }

  getPhotos(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}/photos`);
  }

  getByTechnician(technicianId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/technician/${technicianId}`);
  }

  getByStatus(status: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${status}`);
  }

  getToday(): Observable<any> {
    return this.http.get(`${this.apiUrl}`, {
      params: {
        date: new Date().toISOString().split('T')[0]
      }
    });
  }
}
```

---

## 📱 Componentes

### Dashboard Component

```typescript
// frontend/src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';

interface DashboardStats {
  orders_open: number;
  orders_in_progress: number;
  orders_waiting_parts: number;
  orders_today: number;
  quotes_pending: number;
  payments_pending: number;
  revenue_today: number;
  revenue_month: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    orders_open: 0,
    orders_in_progress: 0,
    orders_waiting_parts: 0,
    orders_today: 0,
    quotes_pending: 0,
    payments_pending: 0,
    revenue_today: 0,
    revenue_month: 0
  };

  todayOrders: any[] = [];
  upcomingVisits: any[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;

    // Carregar estatísticas
    this.loadStats();

    // Carregar ordens de hoje
    this.orderService.getToday().subscribe({
      next: (response) => {
        this.todayOrders = response.data;
      },
      error: (error) => {
        console.error('Erro ao carregar ordens de hoje:', error);
      }
    });

    // Carregar próximas visitas
    this.loadUpcomingVisits();

    this.loading = false;
  }

  loadStats() {
    // Implementar chamada para endpoint de estatísticas
    // Por enquanto, valores mockados
    this.stats = {
      orders_open: 15,
      orders_in_progress: 8,
      orders_waiting_parts: 3,
      orders_today: 5,
      quotes_pending: 7,
      payments_pending: 1250.00,
      revenue_today: 850.00,
      revenue_month: 15300.00
    };
  }

  loadUpcomingVisits() {
    // Implementar lógica para carregar próximas visitas
    this.upcomingVisits = [
      {
        id: '1',
        client_name: 'João Silva',
        address: 'Rua A, 123',
        type: 'refrigeration',
        scheduled_date: new Date(Date.now() + 2 * 60 * 60 * 1000),
        equipment: 'Ar-condicionado'
      },
      {
        id: '2',
        client_name: 'Maria Santos',
        address: 'Av. B, 456',
        type: 'electrical',
        scheduled_date: new Date(Date.now() + 4 * 60 * 60 * 1000),
        equipment: 'Instalação elétrica'
      }
    ];
  }

  getTypeIcon(type: string): string {
    return type === 'refrigeration' ? '❄️' : '⚡';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  formatTime(date: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
}
```

```html
<!-- frontend/src/app/features/dashboard/dashboard.component.html -->
<div class="dashboard-container">
  <header class="dashboard-header">
    <h1>Dashboard</h1>
    <button class="btn-new-order" routerLink="/orders/new">
      + Nova OS
    </button>
  </header>

  <!-- Estatísticas -->
  <section class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">{{ stats.orders_open }}</div>
      <div class="stat-label">Abertos</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ stats.orders_in_progress }}</div>
      <div class="stat-label">Em Atendimento</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ stats.orders_today }}</div>
      <div class="stat-label">Hoje</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">{{ formatCurrency(stats.revenue_month) }}</div>
      <div class="stat-label">Receita do Mês</div>
    </div>
  </section>

  <!-- Próximas Visitas -->
  <section class="upcoming-visits">
    <h2>📅 Próximas Visitas</h2>
    <div class="visit-list">
      <div *ngFor="let visit of upcomingVisits" class="visit-card">
        <div class="visit-time">
          {{ formatTime(visit.scheduled_date) }}
        </div>
        <div class="visit-details">
          <div class="visit-client">
            <span class="type-icon">{{ getTypeIcon(visit.type) }}</span>
            <strong>{{ visit.client_name }}</strong>
          </div>
          <div class="visit-address">
            📍 {{ visit.address }}
          </div>
          <div class="visit-equipment">
            {{ visit.equipment }}
          </div>
        </div>
        <div class="visit-actions">
          <button class="btn-view" [routerLink]="['/orders', visit.id]">
            Ver
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Alertas -->
  <section class="alerts" *ngIf="stats.quotes_pending > 0 || stats.payments_pending > 0">
    <h2>⚠️ Alertas</h2>
    <div class="alert-list">
      <div class="alert-item" *ngIf="stats.quotes_pending > 0">
        <span class="alert-icon">💰</span>
        <span class="alert-text">
          {{ stats.quotes_pending }} orçamento(s) aguardando aprovação
        </span>
        <button class="btn-alert" routerLink="/quotes">Ver</button>
      </div>
      <div class="alert-item" *ngIf="stats.payments_pending > 0">
        <span class="alert-icon">💵</span>
        <span class="alert-text">
          {{ formatCurrency(stats.payments_pending) }} em pagamentos pendentes
        </span>
        <button class="btn-alert" routerLink="/payments">Ver</button>
      </div>
    </div>
  </section>
</div>
```

```css
/* frontend/src/app/features/dashboard/dashboard.component.css */
.dashboard-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: bold;
  color: #333;
}

.btn-new-order {
  background: #0066CC;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-new-order:hover {
  background: #0052A3;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: #0066CC;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

/* Upcoming Visits */
.upcoming-visits {
  background: white;
  border: 1px solid #E0E0E0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
}

.upcoming-visits h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}

.visit-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.visit-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: #F9F9F9;
  border-radius: 8px;
  border-left: 4px solid #0066CC;
}

.visit-time {
  font-size: 18px;
  font-weight: bold;
  color: #0066CC;
  min-width: 80px;
}

.visit-details {
  flex: 1;
  margin-left: 16px;
}

.visit-client {
  font-size: 16px;
  margin-bottom: 4px;
}

.type-icon {
  font-size: 20px;
  margin-right: 8px;
}

.visit-address {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.visit-equipment {
  font-size: 14px;
  color: #999;
}

.visit-actions {
  margin-left: 16px;
}

.btn-view {
  background: #00A86B;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-view:hover {
  background: #008C59;
}

/* Alerts */
.alerts {
  background: #FFF8E1;
  border: 1px solid #FFD54F;
  border-radius: 12px;
  padding: 24px;
}

.alerts h2 {
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
}

.alert-icon {
  font-size: 24px;
  margin-right: 12px;
}

.alert-text {
  flex: 1;
  font-size: 14px;
  color: #666;
}

.btn-alert {
  background: #FF6B35;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.btn-alert:hover {
  background: #E55A2B;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .visit-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .visit-time {
    margin-bottom: 8px;
  }

  .visit-details {
    margin-left: 0;
  }

  .visit-actions {
    margin-left: 0;
    margin-top: 12px;
    width: 100%;
  }

  .btn-view {
    width: 100%;
  }
}
```

---

## 📦 PWA Configuration

### manifest.json

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
      "src": "/assets/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker (ngsw-config.json)

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": [
          "/favicon.ico",
          "/index.html",
          "/manifest.json",
          "/*.css",
          "/*.js"
        ]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": [
          "/assets/**",
          "/*.(eot|svg|cur|jpg|png|webp|gif|otf|ttf|woff|woff2|ani)"
        ]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api",
      "urls": ["/api/**"],
      "cacheConfig": {
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "10s",
        "strategy": "performance"
      }
    }
  ]
}
```

---

**Criado em**: 12/12/2025
**Versão**: 1.0.0
