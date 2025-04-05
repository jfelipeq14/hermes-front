/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TableModule, ButtonModule, RippleModule,ChartModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardPage {
  topClients: any[] = [
    { name: 'Client 1',surName: 'sanchez', reservations: 1000 },
    { name: 'Client 2', surName: 'sanchez', reservations: 800 },
    { name: 'Client 3', surName: 'sanchez', reservations: 600 },
    { name: 'Client 4', surName: 'sanchez', reservations: 400 },
    { name: 'Client 5', surName: 'sanchez', reservations: 200 },
  ];

  barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'My First dataset',
            backgroundColor:"red",
            borderColor: "black",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: 'My Second dataset',
            backgroundColor:"blue",
            borderColor: "black",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};

barOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
        legend: {
            labels: {
                color: "yellow",
            }
        }
    },
    scales: {
        x: {
            ticks: {
                color: "green",
                font: {
                    weight: 500
                }
            },
            grid: {
                display: false,
                drawBorder: false
            }
        },
        y: {
            ticks: {
                color: "grey"
            },
            grid: {
                color: "black",
                drawBorder: false
            }
        }
    }
};
    
}
