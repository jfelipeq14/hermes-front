/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { AuthService } from '../../services';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, ButtonModule, MenuModule, AppConfigurator],
    providers: [AuthService],
    template: ` <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <img src="/hermes.png" width="30" alt="Hermes" />
                Hermes
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i
                        [ngClass]="{
                            'pi ': true,
                            'pi-moon': layoutService.isDarkTheme(),
                            'pi-sun': !layoutService.isDarkTheme()
                        }"
                    ></i>
                </button>
            </div>

            <app-configurator />

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <p-menu #menu [popup]="true" [model]="overlayMenuItems"></p-menu>
                    <button class="layout-topbar-action" type="button" (click)="menu.toggle($event)">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
})
export class AppTopbar {
    constructor(
        public layoutService: LayoutService,
        private authService: AuthService
    ) {}

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    overlayMenuItems = [
        {
            label: 'Perfil',
            icon: 'pi pi-user',
            command: () => {
                window.location.href = '/home/profile';
            }
        },
        {
            label: 'Cerrar sesión',
            icon: 'pi pi-sign-out',
            command: () => {
                this.authService.clearSession();
            }
        }
    ];
}
