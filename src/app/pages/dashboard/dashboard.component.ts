/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../services';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    imports: [CommonModule, ButtonModule, RippleModule, ChartModule],
    providers: [DashboardService]
})
export class DashboardPage implements OnInit {
    dataPackages: any;
    barOptions: any;
    salesChartData: any;
    pieOptions: any;
    // clietData: any;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.getSales();
        this.getPackages();
        this.getClients();
    }

    getSales() {
        this.dashboardService.getSales().subscribe({
            next: (data) => {
                this.setupMonthlySalesChart(data);
            },
            error: (error) => console.error(error)
        });
    }

    getPackages() {
        this.dashboardService.getPackages().subscribe({
            next: (data) => {
                this.setupPackagesChart(data);
            },
            error: (error) => console.error(error)
        });
    }

    getClients() {
        this.dashboardService.getClients().subscribe({
            next: (data) => {
                console.log('Top clients:', data);
            },
            error: (error) => console.error(error)
        });
    }

    setupPackagesChart(packages: any) {
        this.dataPackages = {
            labels: packages.labels,
            datasets: packages.datasets
        };

        this.barOptions = {
            responsive: true,
            maintainAspectRatio: false,
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

    setupMonthlySalesChart(sales: any) {
        this.salesChartData = {
            labels: sales.labels,
            datasets: sales.datasets
        };

        this.pieOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#495057'
                    }
                }
            }
        };
    }
}
