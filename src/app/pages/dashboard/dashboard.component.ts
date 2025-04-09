/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { MockDataService } from '../../services/mock-data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, ChartModule],
  providers: [MessageService],
})
export class DashboardPage implements OnInit {
  topClients: any[] = [];
  sales: any = { total: '$0', growth: 0 };
  packages: any[] = [];

  // Chart data and options
  dataPackages: any;
  barOptions: any;

  constructor(
    private mockDataService: MockDataService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getSales();
    this.getClients();
    this.getPackages();
  }

  getSales() {
    this.mockDataService.getMockSales().subscribe({
      next: (data) => {
        this.sales = data;

        // Setup chart data for monthly sales
        this.setupMonthlySalesChart();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar datos de ventas',
          life: 3000,
        });
      },
    });
  }

  getClients() {
    this.mockDataService.getMockTopClients().subscribe({
      next: (data) => {
        this.topClients = data;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar datos de clientes',
          life: 3000,
        });
      },
    });
  }

  getPackages() {
    this.mockDataService.getMockPackages().subscribe({
      next: (data) => {
        this.packages = data;

        // Setup chart data for packages
        this.setupPackagesChart();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al cargar datos de paquetes',
          life: 3000,
        });
      },
    });
  }

  setupPackagesChart() {
    const packageNames = this.packages.map((p) => p.name);
    const packageSales = this.packages.map((p) => p.sales);

    this.dataPackages = {
      labels: packageNames,
      datasets: [
        {
          label: 'Ventas por paquete',
          backgroundColor: '#42A5F5',
          data: packageSales,
        },
      ],
    };

    this.barOptions = {
      plugins: {
        legend: {
          labels: {
            color: 'yellow',
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: 'green',
            font: {
              weight: 500,
            },
          },
          grid: {
            display: false,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: 'grey',
          },
          grid: {
            color: 'black',
            drawBorder: false,
          },
        },
      },
    };
  }

  setupMonthlySalesChart() {
    // Placeholder for monthly sales chart setup
  }
}
