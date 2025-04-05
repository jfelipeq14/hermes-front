import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

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
export class AppMenu {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
      {
        items: [
          { label: 'Roles', icon: 'pi pi-fw pi-users', routerLink: ['roles'] },
        ],
      },
      {
        items: [
          {
            label: 'Usuarios',
            icon: 'pi pi-fw pi-user',
            routerLink: ['users'],
          },
        ],
      },
      {
        items: [
          {
            label: 'Categorias',
            icon: 'pi pi-fw pi-th-large',
            routerLink: ['categories'],
          },
        ],
      },
      {
        items: [
          {
            label: 'Servicios',
            icon: 'pi pi-fw pi-sparkles',
            routerLink: ['services'],
          },
        ],
      },
      {
        items: [
          {
            label: 'Actividades',
            icon: 'pi pi-fw pi-objects-column',
            routerLink: ['activities'],
          },
        ],
      },
      {
        items: [
          {
            label: 'Paquetes',
            icon: 'pi pi-fw pi-box',
            routerLink: ['packages'],
          },
        ],
      },
      {
        items: [
          {
            label: 'Programación',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['programming'],
          },
        ],
      },
    ];
  }
}
