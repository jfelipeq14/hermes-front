/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';

import { AuthService, ClientsService, PackageService, ProfileService, ProgrammingService, ReservationsService } from '../../services';

import { DateModel, PackageModel, ReservationModel, ReservationTravelerModel, UserModel } from '../../models';

import { CalendarComponent, FormReservationComponent } from '../../shared/components';
import { reservationStatus } from '../../shared/constants';

import { getSeverity, getSeverityReservation, getValue, getValueReservation } from '../../shared/helpers';

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss'],
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, DialogModule, InputTextModule, InputIconModule, IconFieldModule, TagModule, ConfirmDialogModule, DropdownModule, CalendarComponent, FormReservationComponent],
    providers: [ProfileService, ReservationsService, ProgrammingService, PackageService, ClientsService, MessageService, ConfirmationService]
})
export class ReservationsPage implements OnInit {
    authService = inject(AuthService);

    reservations: ReservationModel[] = [];
    dates: DateModel[] = [];
    clients: UserModel[] = [];
    packages: PackageModel[] = [];
    reservationTravelers: ReservationTravelerModel[] = [];

    statuses = reservationStatus;
    getValueReservation = getValueReservation;
    getSeverityReservation = getSeverityReservation;
    getValue = getValue;
    getSeverity = getSeverity;

    expandedRows: Record<string, boolean> = {};

    idDate: number = 0;

    dialogVisible = false;
    dialogType: 'calendar' | 'reservation' = 'calendar';

    disabled = false;

    constructor(
        private profileService: ProfileService,
        private reservationService: ReservationsService,
        private programmingService: ProgrammingService,
        private packageService: PackageService,
        private clientsService: ClientsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.profileService.getCurrentUser().subscribe({
            next: (userData) => {
                if (userData.idRole === 3) {
                    this.getAllReservationsByUser(userData.id);
                    this.clients = [userData];
                    this.disabled = true;
                } else {
                    this.getAllReservations();
                    this.getAllClients();
                    this.disabled = false;
                }
            },
            error: (error) => {
                console.error(error);
            }
        });

        this.getAllDates();
        this.getAllPackages();
    }

    getAllReservations() {
        this.reservationService.getAll().subscribe({
            next: (reservations) => {
                this.reservations = reservations;
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    getAllReservationsByUser(idUser: number) {
        this.reservationService.getAllByUser(idUser).subscribe({
            next: (reservations) => {
                this.reservations = reservations;
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates.filter((d) => d.status === true);
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    getAllPackages() {
        this.packageService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages.filter((r) => r.status === true);
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    getAllClients() {
        this.clientsService.getAll().subscribe({
            next: (clients) => {
                this.clients = clients.filter((c) => c.status === true);
            },
            error: (e) => {
                console.error(e);
            }
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onRowExpand(event: any) {
        if (!event.data.detailReservationTravelers) {
            return;
        }

        this.expandedRows = {};
        this.expandedRows[event.data.id] = true;
    }

    getInfoUser(idUser: number) {
        if (idUser === 0) return;

        const user = this.clients.find((c) => c.id === idUser);

        if (!user) return;

        return user;
    }

    getInfoPackage(idDate: number): PackageModel {
        const date = this.dates.find((d) => d.id === idDate);
        const pack = this.packages.find((p) => p.id === date?.idPackage);

        if (!pack) return new PackageModel();

        return pack;
    }

    changeStatusReservation(reservation: ReservationModel) {
        // validar el rol
        if (this.authService.hasRole([3])) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No tienes permisos para cambiar el estado de los pagos',
                life: 3000
            });
            return;
        }
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea cambiar el estado de ' + reservation.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.reservationService.changeStatus(reservation.id, reservation.status).subscribe({
                    next: (reservation) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `${reservation.id} cambiado a ${this.getValueReservation(reservation.status)}`,
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

    clickProgramming(id: number) {
        this.idDate = id;
        this.dialogType = 'reservation';
        this.dialogVisible = true;
    }

    showPopup() {
        if (this.packages.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay paquetes disponibles para mostrar en el calendario.',
                life: 3000
            });
            return;
        }
        this.dialogType = 'calendar';
        this.dialogVisible = true;
    }

    closePopup() {
        this.dialogVisible = false;
        this.dialogType = 'calendar';
    }

    refresh() {
        this.reservations = [];
        this.clients = [];
        this.packages = [];
        this.dates = [];
        this.dialogVisible = false;
        this.dialogType = 'calendar';

        this.getAllReservations();
        this.getAllDates();
        this.getAllPackages();
        this.getAllClients();

        this.closePopup();
    }
}
