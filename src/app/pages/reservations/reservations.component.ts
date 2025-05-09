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
import { StepperModule } from 'primeng/stepper';

import { AuthService, ClientsService, ProgrammingService, ReservationsService } from '../../services';

import { DateModel, PackageModel, PaymentModel, ReservationModel, ReservationTravelerModel, UserModel } from '../../models';

import { FormClientsComponent, FormPaymentsComponent, FormTravelersComponent } from '../../shared/components';
import { reservationStatus } from '../../shared/constants';

import { getSeverity, getSeverityReservation, getValue, getValueReservation } from '../../shared/helpers';

@Component({
    selector: 'app-reservations',
    templateUrl: './reservations.component.html',
    styleUrls: ['./reservations.component.scss'],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        TagModule,
        ConfirmDialogModule,
        DropdownModule,
        StepperModule,
        FormClientsComponent,
        FormTravelersComponent,
        FormPaymentsComponent
    ],
    providers: [ReservationsService, ProgrammingService, ClientsService, MessageService, ConfirmationService]
})
export class ReservationsPage implements OnInit {
    reservation: ReservationModel = new ReservationModel();
    reservations: ReservationModel[] = [];
    reservationDialog = false;
    submitted = false;
    dates: DateModel[] = [];
    clients: UserModel[] = [];
    client: UserModel = new UserModel();
    travel = false;
    traveler: UserModel = new UserModel();
    payment: PaymentModel = new PaymentModel();
    packages: PackageModel[] = [];
    reservationTravelers: ReservationTravelerModel[] = [];
    statuses = reservationStatus;
    getValueReservation = getValueReservation;
    getSeverityReservation = getSeverityReservation;
    getValue = getValue;
    getSeverity = getSeverity;
    activeStepIndex = 0;
    steps = [
        { label: 'Crear Cliente', value: 0 },
        { label: 'Agregar Viajeros', value: 1 },
        { label: 'Confirmar Reserva', value: 2 }
    ];
    expandedRows: Record<string, boolean> = {};

    constructor(
        private reservationService: ReservationsService,
        private programmingService: ProgrammingService,
        private clientsService: ClientsService,
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.getAllReservations();
        this.getAllDates();
        this.getAllUsers();
        this.findProgramming(1);
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

    getAllUsers() {
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
        console.log(event);
    }

    getTravelerInfo(travelerId: number): UserModel {
        const traveler = this.clients.find((c) => c.id === travelerId);

        if (!traveler) return new UserModel();

        return traveler;
    }

    findProgramming(id: number) {
        const dateFound = this.dates.find((d) => d.id === id);
        if (!dateFound)
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se encontró la fecha de programación',
                life: 3000
            });

        this.reservation.idDate = id;
    }

    searchClient(document: any) {
        if (!document) {
            return;
        }

        const clientFound = this.clients.find((u) => u.document === document);

        if (!clientFound) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se encontró el cliente',
                life: 3000
            });
        }

        if (this.reservation.idUser !== 0 && clientFound) {
            this.traveler = clientFound;
        }

        if (this.reservation.idUser === 0 && clientFound) {
            this.client = clientFound;
            this.reservation.idUser = clientFound.id;
        }

        if (this.travel && clientFound) {
            this.reservation.detailReservationTravelers.push({
                idTraveler: clientFound.id
            });
        }
    }

    createClient(event: any) {
        if (!event.value) {
            return;
        }

        if (this.submitted) {
            this.authService.register(this.client).subscribe({
                next: (client) => {
                    if (this.reservation.idUser === 0 && !this.travel) {
                        this.reservation.idUser = client.id;
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Client created successfully',
                        life: 3000
                    });
                    this.reservation.detailReservationTravelers.push({
                        idTraveler: client.id
                    });
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
    }

    saveReservation() {
        if (this.reservation.idDate === 0 || this.reservation.idUser === 0 || this.reservation.detailReservationTravelers.length === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, complete todos los campos requeridos',
                life: 3000
            });
            return;
        }

        this.reservationService.create(this.reservation).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Reservación creada correctamente',
                    life: 3000
                });
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

    addTraveler() {
        this.travel = true;
        if (this.travel && this.traveler.document) {
            this.reservation.detailReservationTravelers.push({
                idTraveler: this.traveler.id
            });
        }
    }

    getPrice(id: number) {
        const dateFound = this.dates.find((d) => d.id === id);
        if (!dateFound) return 0;
        return this.packages.find((p) => p.id === dateFound.idPackage)?.price;
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

    isStepValid(step: number): boolean {
        switch (step) {
            case 0:
                return this.reservation.idUser > 0;
            case 1:
                return this.reservation.detailReservationTravelers.length > 0;
            case 2:
                return this.reservation.idUser > 0 && this.reservation.detailReservationTravelers.length > 0;
            default:
                return false;
        }
    }

    previousStep() {
        if (this.activeStepIndex > 0) {
            this.activeStepIndex--;
        }
    }

    nextStep() {
        if (this.isStepValid(this.activeStepIndex) && this.activeStepIndex < this.steps.length - 1) {
            this.activeStepIndex++;
        }
    }

    showPopup() {
        this.reservation = new ReservationModel();
        this.reservationDialog = true;
        this.submitted = false;
    }

    closePopup() {
        this.reservationDialog = false;
        this.reservation = new ReservationModel();
    }

    refresh() {
        this.reservation = new ReservationModel();
        this.reservations = [];

        this.client = new UserModel();
        this.clients = [];

        this.traveler = new UserModel();

        this.payment = new PaymentModel();
        this.packages = [];

        this.dates = [];

        this.travel = false;
        this.activeStepIndex = 0;
        this.submitted = false;
        this.reservationDialog = false;

        this.getAllReservations();
        this.getAllDates();
        this.getAllUsers();

        this.closePopup();
    }
}
