/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule, ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardPage implements OnInit {
  dailyRevenueData: any = {};
  dailyRevenueOptions: any = {};
  topClients: any[] = [];
  topSellingPackagesData: any = {};
  topSellingPackagesOptions: any = {};
  barData: any = {};
  barOptions: any = {};
  revenue = 0;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDailyRevenue();
    this.loadTopClients();
    this.loadTopSellingPackages();
    this.loadBarChartData();
    this.loadRevenueData();
  }

  loadDailyRevenue(): void {
    this.dashboardService.getDailyRevenue().subscribe((data) => {
      this.dailyRevenueData = data.chartData;
      this.dailyRevenueOptions = data.chartOptions;
    });
  }

  loadTopClients(): void {
    this.dashboardService.getTopClients().subscribe((data) => {
      this.topClients = data;
    });
  }

  loadTopSellingPackages(): void {
    this.dashboardService.getTopSellingPackages().subscribe((data) => {
      this.topSellingPackagesData = data.chartData;
      this.topSellingPackagesOptions = data.chartOptions;
    });
  }

  loadBarChartData(): void {
    this.dashboardService.getTopClients().subscribe((data) => {
      this.barData = data.toLocaleString;
      this.barOptions = data.toLocaleString;
    });
  }

  loadRevenueData(): void {
    this.dashboardService.getDailyRevenue().subscribe((data) => {
      this.revenue = data.totalRevenue;
    });
  }
}
