import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MockDataService {
  // Mock data for dashboard
  getMockSales(): Observable<any> {
    const salesData = {
      total: '$7,842,900',
      growth: 24.5,
      monthly: [
        { month: 'Ene', amount: 540000 },
        { month: 'Feb', amount: 620000 },
        { month: 'Mar', amount: 710000 },
        { month: 'Abr', amount: 590000 },
        { month: 'May', amount: 820000 },
        { month: 'Jun', amount: 950000 },
        { month: 'Jul', amount: 1120000 },
        { month: 'Ago', amount: 980000 },
        { month: 'Sep', amount: 1080000 },
        { month: 'Oct', amount: 1250000 },
        { month: 'Nov', amount: 1380000 },
        { month: 'Dic', amount: 1490000 },
      ],
    };

    return of(salesData);
  }

  getMockTopClients(): Observable<any[]> {
    const topClients = [
      {
        id: 1,
        name: 'Carolina',
        surname: 'Herrera',
        purchases: 8,
        totalSpent: 3450000,
      },
      {
        id: 2,
        name: 'Andrés',
        surname: 'Gómez',
        purchases: 7,
        totalSpent: 2980000,
      },
      {
        id: 3,
        name: 'María',
        surname: 'López',
        purchases: 6,
        totalSpent: 2640000,
      },
      {
        id: 4,
        name: 'Juan',
        surname: 'Pérez',
        purchases: 5,
        totalSpent: 2150000,
      },
      {
        id: 5,
        name: 'Laura',
        surname: 'Martínez',
        purchases: 4,
        totalSpent: 1890000,
      },
    ];

    return of(topClients);
  }

  getMockPackages(): Observable<any[]> {
    const packages = [
      {
        id: 1,
        name: 'Romántico Premium',
        sales: 42,
        revenue: 8400000,
        price: 200000,
      },
      { id: 2, name: 'Familiar', sales: 36, revenue: 5400000, price: 150000 },
      { id: 3, name: 'Aventura', sales: 28, revenue: 4480000, price: 160000 },
      { id: 4, name: 'Cultural', sales: 22, revenue: 3300000, price: 150000 },
      {
        id: 5,
        name: 'Gastronómico',
        sales: 18,
        revenue: 2700000,
        price: 150000,
      },
    ];

    return of(packages);
  }
}
