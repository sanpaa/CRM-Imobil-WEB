import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicSectionComponent } from '../../components/dynamic-section/dynamic-section';
import { WebsiteCustomizationService } from '../../services/website-customization.service';
import { WebsiteLayout, FlexibleLayoutSection } from '../../models/website-layout.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface SiteConfigResponse {
  success: boolean;
  company?: {
    id: string;
    [key: string]: any;
  };
  [key: string]: any;
}

@Component({
  selector: 'app-modular-home',
  standalone: true,
  imports: [CommonModule, DynamicSectionComponent],
  templateUrl: './modular-home.html',
  styleUrls: ['./modular-home.css']
})
export class ModularHomeComponent implements OnInit {
  layout: WebsiteLayout | null = null;
  sections: FlexibleLayoutSection[] = [];
  loading = true;
  error = false;
  companyId: string | null = null;

  constructor(
    private websiteService: WebsiteCustomizationService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadLayout();
  }

  loadLayout() {
    // Get the domain from window location
    const domain = window.location.hostname;
    
    // For local development, use localhost as domain to get default company
    // In production, this would use the actual domain
    if (domain === 'localhost' || domain.startsWith('127.0.0.1')) {
      // Load by localhost domain to get default company
      this.loadByDomain('localhost');
    } else {
      // Load by actual domain
      this.loadByDomain(domain);
    }
  }

  loadDefaultLayout() {
    // Fallback when no company is found - use default template
    console.warn('No company found, using default template');
    this.sections = this.websiteService.getDefaultTemplate('home');
    this.loading = false;
  }

  loadByDomain(domain: string) {
    // Get site config by domain which includes company_id
    this.http.get<SiteConfigResponse>(`${environment.apiUrl}/api/site-config?domain=${domain}`).subscribe({
      next: (config) => {
        if (config.success && config.company && config.company.id) {
          this.companyId = config.company.id;
          this.loadLayoutForCompany(config.company.id);
        } else {
          this.loadDefaultLayout();
        }
      },
      error: () => {
        this.loadDefaultLayout();
      }
    });
  }

  loadLayoutForCompany(companyId: string) {
    this.websiteService.getActiveLayout(companyId, 'home').subscribe({
      next: (layout) => {
        this.layout = layout;
        this.sections = layout.layout_config.sections.sort((a, b) => a.order - b.order);
        this.loading = false;
      },
      error: (err) => {
        console.warn('Could not load layout for company, using default template', err);
        this.sections = this.websiteService.getDefaultTemplate('home');
        this.loading = false;
      }
    });
  }
}
