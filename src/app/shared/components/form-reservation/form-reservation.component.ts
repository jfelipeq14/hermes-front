/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, OnInit } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { FormClientsComponent, FormPaymentsComponent, FormTravelersComponent, PackageCardComponent } from '..';
import { CommonModule } from '@angular/common';
import { PaymentModel, ReservationModel, ReservationTravelerModel, UserModel } from '../../../models';
import { MessageService } from 'primeng/api';
import { AuthService, ClientsService, PaymentService, ReservationsService } from '../../../services';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-form-reservation',
    templateUrl: './form-reservation.component.html',
    styleUrl: './form-reservation.component.scss',
    imports: [CommonModule, ButtonModule, StepperModule, ToastModule, FormClientsComponent, FormTravelersComponent, FormPaymentsComponent, PackageCardComponent],
    providers: [AuthService, ReservationsService, PaymentService, ClientsService, MessageService]
})
export class FormReservationComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private reservationService: ReservationsService,
        private paymentService: PaymentService,
        private clientsService: ClientsService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getAllClients();
    }

    @Input() idDate = 0;

    reservation: ReservationModel = new ReservationModel();
    payment: PaymentModel = new PaymentModel();

    traveler: UserModel = new UserModel();
    travel = false;

    client: UserModel = new UserModel();
    clients: UserModel[] = [];

    activeStepIndex = 0;
    steps = [
        { label: 'Crear Cliente', value: 0 },
        { label: 'Agregar Viajeros', value: 1 },
        { label: 'Pagar', value: 2 }
    ];
    submitted = false;
    isPasswordDisable = false;

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

    searchClient(document: string) {
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
            this.isPasswordDisable = false;
        }

        if (this.reservation.idUser !== 0 && clientFound) {
            this.traveler = clientFound;
            this.isPasswordDisable = true;
        }

        if (this.reservation.idUser === 0 && clientFound) {
            this.client = clientFound;
            this.reservation.idUser = clientFound.id;
            this.isPasswordDisable = true;
        }
    }

    handleTravel(travel: boolean) {
        this.travel = travel;
        if (travel) {
            this.reservation.detailReservationTravelers.push({
                idTraveler: this.client.id
            });
        } else {
            //remove traveler
            this.reservation.detailReservationTravelers = this.reservation.detailReservationTravelers.filter((traveler) => traveler.idTraveler !== this.client.id);
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
        if (!this.traveler.document) return;
        this.travel = true;
        this.reservation.detailReservationTravelers.push({
            idTraveler: this.traveler.id
        });
    }

    deleteTraveler(traveler: ReservationTravelerModel) {
        if (!traveler) return;

        this.reservation.detailReservationTravelers = this.reservation.detailReservationTravelers.filter((t) => t.idTraveler !== traveler.idTraveler);
    }

    payReservation() {
        if (this.payment.idReservation === 0 || this.payment.price === 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Por favor, complete todos los campos requeridos',
                life: 3000
            });
            return;
        }

        this.paymentService.create(this.payment).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'Pago realizado correctamente',
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
        if (this.activeStepIndex > 0) this.activeStepIndex--;
    }

    nextStep() {
        if (this.activeStepIndex === 1 && this.reservation.detailReservationTravelers.length > 0) {
            this.reservation.idDate = this.idDate;

            this.reservationService.create(this.reservation).subscribe({
                next: (r) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: 'Reservación creada correctamente',
                        life: 3000
                    });
                    this.payment.idReservation = r.id;
                    this.payment.price = r.detailReservationTravelers.length * r.price;
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

        if (this.isStepValid(this.activeStepIndex) && this.activeStepIndex < this.steps.length - 1) {
            this.activeStepIndex++;
        }
    }
}
