import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ROLE_IDS } from '../../shared/constants';
import { AuthService } from '../../services';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li
        app-menuitem
        *ngIf="!item.separator"
        [item]="item"
        [index]="i"
        [root]="true"
      ></li>

      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
})
export class AppMenuComponent implements OnInit {
  authService = inject(AuthService);
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        items: [
          {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-home',
            routerLink: ['dashboard'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },

      {
        items: [
          { label: 'Roles', icon: 'pi pi-fw pi-users', routerLink: ['roles'] },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },

      {
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },

      {
        items: [
          {
            label: 'Categorias',
            icon: 'pi pi-fw pi-th-large',
            routerLink: ['categories'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },

      {
        items: [
          {
            label: 'Servicios',
            icon: 'pi pi-fw pi-sparkles',
            routerLink: ['services'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },

      {
        items: [
          {
            label: 'Actividades',
            icon: 'pi pi-fw pi-objects-column',
            routerLink: ['activities'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },

      {
        items: [
          {
            label: 'Paquetes',
            icon: 'pi pi-fw pi-box',
            routerLink: ['packages'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },

      {
        items: [
          {
            label: 'Programación',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['programming'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN, ROLE_IDS.GUIDE]),
      },
      {
        items: [
          {
            label: 'Clientes',
            icon: 'pi pi-fw pi-user',
            routerLink: ['clients'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN]),
      },
      {
        items: [
          {
            label: 'Reservas',
            icon: 'pi pi-fw pi-building',
            routerLink: ['reservations'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN, ROLE_IDS.CLIENT]),
      },
      {
        items: [
          {
            label: 'Pagos',
            icon: 'pi pi-fw pi-money-bill',
            routerLink: ['payments'],
          },
        ],
        visible: this.authService.hasRole([ROLE_IDS.ADMIN, ROLE_IDS.CLIENT]),
      },
    ];
  }
}
