/* eslint-disable @angular-eslint/component-class-suffix */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { Table, TableModule } from 'primeng/table';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';

import { ActivateModel, PackageModel, ReservationModel, UserModel } from '../../models';
import { AuthService, ClientsService, PackageService, ReservationsService, UserService } from '../../services';
import { DialogModule } from 'primeng/dialog';
import { FormUsersComponent } from '../../shared/components';
import { getSeverity } from '../../shared/helpers';

@Component({
    selector: 'app-clients',
    templateUrl: './clients.component.html',
    styleUrl: './clients.component.scss',
    imports: [CommonModule, TableModule, TagModule, ButtonModule, ToastModule, InputTextModule, InputIconModule, IconFieldModule, DialogModule, ConfirmDialogModule, FormUsersComponent],
    providers: [ClientsService, PackageService, ReservationsService, AuthService, UserService, MessageService, ConfirmationService]
})
export class ClientsPage implements OnInit {
    constructor(
        private clientsService: ClientsService,
        private reservationsService: ReservationsService,
        private packagesService: PackageService,
        private authService: AuthService,
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    client: UserModel = new UserModel();
    clients: UserModel[] = [];
    packages: PackageModel[] = [];
    reservations: ReservationModel[] = [];
    expandedRows: Record<string, boolean> = {};
    activateModel: ActivateModel = new ActivateModel();
    popupVisible = false;
    getSeverity = getSeverity;

    ngOnInit(): void {
        this.getAllClients();
        this.getAllPackages();
    }

    getAllClients() {
        this.clientsService.getAll().subscribe({
            next: (clients) => {
                this.clients = clients;
            },
            error: (e) => console.error(e)
        });
    }

    getAllPackages() {
        this.packagesService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages;
            },
            error: (e) => console.error(e)
        });
    }

    getReservationsByClient(id: number) {
        this.reservationsService.getAllByUser(id).subscribe({
            next: (reservations) => {
                this.reservations = reservations;
            },
            error: (e) => console.error(e)
        });
    }

    getPackageInfo(id: number) {
        const packageInfo = this.packages.find((pack) => pack.id === id);
        if (!packageInfo) return;

        return packageInfo;
    }

    createClient(client: UserModel) {
        if (!client.id) {
            this.authService.register(client).subscribe({
                next: (response) => {
                    if (!response) return;

                    this.activateModel.email = response.email;
                    this.activateModel.activationUserToken = response.activationToken;

                    this.authService.activateAccount(this.activateModel).subscribe({
                        next: (response) => {
                            if (!response) return;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Éxito',
                                detail: 'Usuario ha sido creado y activado correctamente',
                                life: 3000
                            });
                            this.refresh();
                        },
                        error: (e) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error al activar la cuenta: ' + (e.error.message || 'Error desconocido'),
                                life: 3000
                            });
                        }
                    });
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message === 'User already exists' ? 'El correo electrónico ya existe, ingrese otro correo por favor' : 'Error al crear el usuario: ' + (e.error.message || 'Error desconocido'),
                        life: 3000
                    });
                }
            });
        } else {
            this.userService.update(client).subscribe({
                next: (response) => {
                    if (!response) return;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Usuario actualizado correctamente',
                        life: 3000
                    });
                    this.refresh();
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error al actualizar el usuario: ' + (e.error.message || 'Error desconocido'),
                        life: 3000
                    });
                }
            });
        }
    }

    editClient(client: UserModel) {
        this.client = { ...client };
        const date = new Date(this.client.dateBirth);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        this.client.dateBirth = date;
        this.popupVisible = true;
    }

    changeStatusClient(client: UserModel) {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea cambiar el estado de ' + client.name + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.userService.changeStatus(client.id).subscribe({
                    next: (c) => {
                        this.messageService.add({
                            severity: this.getSeverity(c.status),
                            summary: 'Éxito',
                            detail: `Cliente ${c.status ? 'activado' : 'desactivado'}`,
                            life: 3000
                        });
                        this.refresh();
                    },
                    error: (e) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: e.error.message,
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    showPopup() {
        this.popupVisible = true;
    }

    closePopup() {
        this.popupVisible = false;
        this.expandedRows = {};
    }

    refresh() {
        this.client = new UserModel();
        this.clients = [];
        this.packages = [];
        this.reservations = [];
        this.expandedRows = {};
        this.activateModel = new ActivateModel();
        this.popupVisible = false;

        this.getAllClients();
        this.getAllPackages();
    }

    onRowExpand(event: any) {
        if (!event.data) {
            return;
        }

        // Collapse all other rows
        this.expandedRows = {};
        this.expandedRows[event.data.id] = true;

        this.getReservationsByClient(event.data.id);
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
