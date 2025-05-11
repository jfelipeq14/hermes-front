/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
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

import { AuthService, ClientsService, PackageService, ProgrammingService, ReservationsService } from '../../services';

import { DateModel, PackageModel, ReservationModel, ReservationTravelerModel, UserModel } from '../../models';

import { CalendarComponent, FormReservationComponent } from '../../shared/components';
import { reservationStatus } from '../../shared/constants';

import { getSeverity, getSeverityReservation, getValue, getValueReservation } from '../../shared/helpers';

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss'],
    imports: [CommonModule, TableModule, FormsModule, ButtonModule, ToastModule, DialogModule, InputTextModule, InputIconModule, IconFieldModule, TagModule, ConfirmDialogModule, DropdownModule, CalendarComponent],
    providers: [ReservationsService, ProgrammingService, PackageService, ClientsService, MessageService, ConfirmationService]
})
export class ReservationsPage implements OnInit {
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

    calendarDialog = false;

    expandedRows: Record<string, boolean> = {};

    constructor(
        private reservationService: ReservationsService,
        private programmingService: ProgrammingService,
        private packageService: PackageService,
        private clientsService: ClientsService,
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getAllReservations();
        this.getAllDates();
        this.getAllPackages();
        this.getAllClients();
    }

    getAllReservations() {
        this.reservationService.getAll().subscribe({
            next: (reservations) => {
                this.reservations = reservations;
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

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates;
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

    getAllPackages() {
        this.packageService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages;
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

    getAllClients() {
        this.clientsService.getAll().subscribe({
            next: (clients) => {
                this.clients = clients;
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

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onRowExpand(event: any) {
        if (!event) return;
    }

    getInfoUser(idUser: number): UserModel {
        const traveler = this.clients.find((c) => c.id === idUser);

        if (!traveler) return new UserModel();

        return traveler;
    }

    getInfoPackage(idDate: number): PackageModel {
        const date = this.dates.find((d) => d.id === idDate);
        const pack = this.packages.find((p) => p.id === date?.idPackage);

        if (!pack) return new PackageModel();

        return pack;
    }

    changeStatusReservation(reservation: ReservationModel) {
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
            },
            reject: () => {
                this.refresh();
            }
        });
    }

    showPopup() {
        this.calendarDialog = true;
    }

    closePopup() {
        this.calendarDialog = false;
    }

    refresh() {
        this.reservations = [];
        this.clients = [];
        this.packages = [];
        this.dates = [];
        this.calendarDialog = false;

        this.getAllReservations();
        this.getAllDates();
        this.getAllClients();

        this.closePopup();
    }
}
