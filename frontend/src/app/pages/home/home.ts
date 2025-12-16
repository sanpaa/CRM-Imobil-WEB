import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyCardComponent } from '../../components/property-card/property-card';
import { PropertyService } from '../../services/property';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, PropertyCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit {
  properties: Property[] = [];        // até 9
  visibleProperties: Property[] = []; // 3 por vez

  loading = true;
  error = false;

  pageSize = 3;
  currentIndex = 0;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (properties) => {
        this.properties = properties
          .filter(p => !p.sold)
          .slice(0, 9); // 🔥 LIMITE TOTAL

        this.updateVisible();
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  updateVisible(): void {
    this.visibleProperties = this.properties.slice(
      this.currentIndex,
      this.currentIndex + this.pageSize
    );
  }

  next(): void {
    if (this.currentIndex + this.pageSize < this.properties.length) {
      this.currentIndex += this.pageSize;
      this.updateVisible();
    }
  }

  prev(): void {
    if (this.currentIndex - this.pageSize >= 0) {
      this.currentIndex -= this.pageSize;
      this.updateVisible();
    }
  }
}

