/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { MessageService } from 'primeng/api';
import { MockDataService } from '../../services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [CommonModule, TableModule, ButtonModule, RippleModule, ChartModule],
    providers: [MessageService]
})
export class DashboardPage implements OnInit {
    topClients: any[] = [];
    sales: any = { total: '$0', growth: 0 };
    packages: any[] = [];

    // Chart data and options
    dataPackages: any;
    barOptions: any;
    salesChartData: any;
    pieOptions: any;

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
                    life: 3000
                });
            }
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
                    life: 3000
                });
            }
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
                    life: 3000
                });
            }
        });
    }

    setupPackagesChart() {
        this.dataPackages = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [
                {
                    label: 'Cartagena',
                    backgroundColor: '#FCD34D',
                    data: [10, 8, 15, 12, 22]
                },
                {
                    label: 'Baru',
                    backgroundColor: '#22C55E',
                    data: [8, 7, 12, 15, 10]
                },
                {
                    label: 'Santa Marta',
                    backgroundColor: '#EC4899',
                    data: [12, 10, 18, 14, 8]
                },
                {
                    label: 'Covenas',
                    backgroundColor: '#8B5CF6',
                    data: [9, 8, 10, 11, 7]
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057',
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };
    }

    setupMonthlySalesChart() {
        this.salesChartData = {
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo'],
            datasets: [
                {
                    data: [12500000, 15000000, 9000000, 7500000, 10000000],
                    backgroundColor: ['#6366F1', '#F59E0B', '#EC4899', '#581C87', '#DC2626']
                }
            ]
        };

        this.pieOptions = {
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#495057'
                    }
                }
            }
        };
    }
}
