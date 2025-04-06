/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../services/dashboard.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, ChartModule],
  providers: [DashboardService, MessageService],
})
export class DashboardPage implements OnInit {
  constructor(
    private dashboardService: DashboardService,
    private messageService: MessageService
  ) {}

  topClients: any[] = [];
  sales: any;
  packages: any[] = [];

  ngOnInit(): void {
    this.getSales();
    this.getClients();
    this.getPackages();
  }

  getSales() {
    this.dashboardService.getSales().subscribe({
      next: (data) => {
        this.sales = data;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message,
          life: 3000,
        });
      },
    });
  }

  getClients() {
    this.dashboardService.getSales().subscribe({
      next: (data) => {
        this.topClients = data;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message,
          life: 3000,
        });
      },
    });
  }

  getPackages() {
    this.dashboardService.getPackages().subscribe({
      next: (data) => {
        this.packages = data;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message,
          life: 3000,
        });
      },
    });
  }

  getPackageNames(): string[] {
    return this.packages.map((p) => p.name);
  }

  getPackageSales(): number[] {
    return this.packages.map((p) => p.sales);
  }

  dataPackages = {
    labels: this.getPackageNames(),
    datasets: [
      {
        label: 'Paquetes',
        backgroundColor: 'red',
        borderColor: 'black',
        data: this.getPackageSales(),
      },
    ],
  };

  barOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
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
