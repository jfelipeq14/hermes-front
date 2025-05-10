/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, ElementRef } from '@angular/core';
import { AppMenuComponent } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenuComponent],
    template: ` <div class="layout-sidebar">
        <app-menu></app-menu>
    </div>`
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
