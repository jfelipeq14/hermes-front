import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { ShowForRolesDirective } from '../../directives/show-roles.directive';
import { ROLE_IDS } from '../../shared/constants/roles';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule, ShowForRolesDirective],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <ng-container *ngIf="item.roles">
          <li
            app-menuitem
            *akoShowForRoles="item.roles"
            [item]="item.menuItem"
            [index]="i"
            [root]="true"
          ></li>
        </ng-container>
        <ng-container *ngIf="!item.roles">
          <li
            app-menuitem
            *ngIf="!item.menuItem.separator"
            [item]="item.menuItem"
            [index]="i"
            [root]="true"
          ></li>
          <li *ngIf="item.menuItem.separator" class="menu-separator"></li>
        </ng-container>
      </ng-container>
    </ul>
  `,
})
export class AppMenu implements OnInit {
  model: {menuItem: MenuItem, roles?: number[]}[] = [];

  ngOnInit() {
    this.model = [
      {
        menuItem: {
          label: 'Dashboard',
          icon: 'pi pi-fw pi-home',
          routerLink: ['dashboard'],
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: { 
          label: 'Roles', 
          icon: 'pi pi-fw pi-users', 
          routerLink: ['roles'] 
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: {
          label: 'Usuarios',
          icon: 'pi pi-fw pi-user',
          routerLink: ['users'],
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: {
          label: 'Categorias',
          icon: 'pi pi-fw pi-th-large',
          routerLink: ['categories'],
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: {
          label: 'Servicios',
          icon: 'pi pi-fw pi-sparkles',
          routerLink: ['services'],
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: {
          label: 'Actividades',
          icon: 'pi pi-fw pi-objects-column',
          routerLink: ['activities'],
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: {
          label: 'Paquetes',
          icon: 'pi pi-fw pi-box',
          routerLink: ['packages'],
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: {
          label: 'Programación',
          icon: 'pi pi-fw pi-calendar',
          routerLink: ['programming'],
        },
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.GUIDE]
      },
      {
        menuItem: {
          label: 'Clientes',
          icon: 'pi pi-fw pi-user',
          routerLink: ['clients'],
        },
        roles: [ROLE_IDS.ADMIN]
      },
      {
        menuItem: {
          label: 'Reservas',
          icon: 'pi pi-fw pi-building',
          routerLink: ['reservations'],
        },
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.CLIENT]
      },
      {
        menuItem: {
          label: 'Pagos',
          icon: 'pi pi-fw pi-money-bill',
          routerLink: ['payments'],
        },
        roles: [ROLE_IDS.ADMIN, ROLE_IDS.CLIENT]
      },
    ];
  }
}