/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StepperModule } from 'primeng/stepper';
import { FormClientsComponent, FormPaymentsComponent, FormTravelersComponent, PackageCardComponent } from '..';
import { CommonModule } from '@angular/common';
import { ActivateModel, DateModel, PackageModel, PaymentModel, ReservationModel, ReservationTravelerModel, UserModel } from '../../../models';
import { MessageService } from 'primeng/api';
import { AuthService, ClientsService, PackageService, PaymentService, ProgrammingService, ReservationsService } from '../../../services';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-form-reservation',
    templateUrl: './form-reservation.component.html',
    styleUrl: './form-reservation.component.scss',
    imports: [CommonModule, ButtonModule, StepperModule, ToastModule, FormClientsComponent, FormTravelersComponent, FormPaymentsComponent, PackageCardComponent],
    providers: [AuthService, ReservationsService, ProgrammingService, PackageService, PaymentService, ClientsService, MessageService]
})
export class FormReservationComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private reservationService: ReservationsService,
        private programmingService: ProgrammingService,
        private packageService: PackageService,
        private paymentService: PaymentService,
        private clientsService: ClientsService,
        private messageService: MessageService
    ) {}

    ngOnInit() {
        this.getAllClients();
        this.getAllDates();
        this.getAllPackages();
    }

    @Input() idDate = 0;
    @Output() toCancel = new EventEmitter<void>();

    reservation: ReservationModel = new ReservationModel();
    payment: PaymentModel = new PaymentModel();

    traveler: UserModel = new UserModel();
    travel = false;

    client: UserModel = new UserModel();
    clients: UserModel[] = [];
    activateModel: ActivateModel = new ActivateModel();

    dates: DateModel[] = [];
    packages: PackageModel[] = [];

    activeStepIndex = 0;
    steps = [
        { label: 'Crear Cliente', value: 0 },
        { label: 'Agregar Viajeros', value: 1 },
        { label: 'Pagar', value: 2 }
    ];
    submitted = false;
    isFormDisabled = false;

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

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates;
            },
            error: (e) => console.error(e)
        });
    }

    getAllPackages() {
        this.packageService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages;
            },
            error: (e) => console.error(e)
        });
    }

    getDateInfo(idDate: number) {
        if (!idDate) return;
        const dateInfo = this.dates.find((date) => date.id === idDate);
        return dateInfo || new DateModel();
    }

    getPackageInfo(id: number) {
        const packageInfo = this.packages.find((pack) => pack.id === id);
        if (!packageInfo) return;

        return packageInfo || new PackageModel();
    }

    searchClient(document: string) {
        const clientFound = this.clients.find((u) => u.document === document);

        if (!clientFound) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'No se encontró el cliente',
                life: 3000
            });
            this.client = new UserModel();
            this.client.document = document;
            this.isFormDisabled = false; // Permitir nuevas búsquedas
            return;
        } else {
            this.client = clientFound;
            this.isFormDisabled = true; // Bloquear campos si se encuentra un cliente
        }

        if (this.reservation.idUser !== 0) {
            this.traveler = clientFound;
        } else {
            this.client = clientFound;
            this.reservation.idUser = clientFound.id;
        }

        this.isFormDisabled = true; // Bloquear campos si se encuentra un cliente
    }

    handleTravel(travel: boolean) {
        this.travel = travel;
        if (travel) {
            // Si el cliente ya tiene id, agregarlo como viajero automáticamente
            if (this.client && this.client.id > 0) {
                // Solo agregar si no está ya en la lista
                if (!this.reservation.detailReservationTravelers.some((t) => t.idTraveler === this.client.id)) {
                    this.reservation.detailReservationTravelers.push({
                        idTraveler: this.client.id
                    });
                }
                // No limpiar los datos del cliente aquí, solo cuando se cree uno nuevo
            }
        } else {
            this.reservation.detailReservationTravelers = this.reservation.detailReservationTravelers.filter((traveler) => traveler.idTraveler !== this.client.id);
        }
    }

    createClient(client: UserModel, isTraveler: boolean = false) {
        if (!client) return;

        client.idRole = 3;

        this.authService.register(client).subscribe({
            next: (response) => {
                if (!response) return;

                this.activateModel.email = response.email;
                this.activateModel.activationUserToken = response.activationToken;

                if (isTraveler) {
                    this.traveler = response;
                    this.addTraveler();
                } else {
                    this.client = response;
                    this.reservation.idUser = response.id;
                }

                this.authService.activateAccount(this.activateModel).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Usuario creado y activado.',
                            life: 3000
                        });
                        // Si es viajero, agregarlo a la reserva y limpiar formulario
                        if (isTraveler) {
                            // Asegura limpieza del formulario
                            this.traveler = new UserModel();
                        } else {
                            this.activeStepIndex = 1;
                            if (this.travel) {
                                this.reservation.detailReservationTravelers.push({ idTraveler: this.client.id });
                                if (!this.clients.some((c) => c.id === this.client.id)) {
                                    this.clients.push(this.client);
                                }
                            }
                            this.client = new UserModel();
                            this.traveler = new UserModel();
                            this.isFormDisabled = false;
                        }
                    },
                    error: (e) => console.error(e)
                });
            },
            error: (e) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.error.message,
                    life: 3000
                });
                this.submitted = false;
            }
        });
    }

    saveReservation() {
        if (!this.reservation.price || this.reservation.price <= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'El precio de la reservación no puede ser cero o negativo',
                life: 3000
            });
            return;
        }

        this.reservationService.create(this.reservation).subscribe({
            next: (r) => {
                this.payment.idReservation = r.id;

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
        if (!this.traveler || !this.traveler.id || !this.traveler.document) return;
        // Solo agregar si no está ya en la lista de viajeros
        if (!this.reservation.detailReservationTravelers.some((t) => t.idTraveler === this.traveler.id)) {
            this.reservation.detailReservationTravelers.push({
                idTraveler: this.traveler.id
            });
            // Agregar el viajero a la lista de clients si no está
            if (!this.clients.some((c) => c.id === this.traveler.id)) {
                this.clients.push({ ...this.traveler });
            }
        }
        // Limpiar el formulario de viajero
        this.traveler = new UserModel();
        this.isFormDisabled = false; // Permitir nuevas búsquedas o adiciones
    }

    deleteTraveler(traveler: ReservationTravelerModel) {
        if (!traveler) return;

        this.reservation.detailReservationTravelers = this.reservation.detailReservationTravelers.filter((t) => t.idTraveler !== traveler.idTraveler);
    }

    payReservation() {
        if (this.payment.idReservation === 0 || this.payment.total === 0) {
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

    validateStep(step: number) {
        if (step === 0) {
            if (this.client.id === 0) {
                return this.createClient(this.client);
            } else if (this.client.id > 0) {
                this.reservation.idUser = this.client.id;
            }

            this.isFormDisabled = false; // Bloquear campos si se encuentra un cliente

            this.reservation.idDate = this.idDate;

            return this.reservation.idUser > 0 ? true : false;
        } else if (step === 1) {
            if (this.reservation.detailReservationTravelers.length > 0) {
                this.reservation.price = this.getPackageInfo(this.getDateInfo(this.idDate)?.idPackage || 0)?.price || 0 * this.reservation.detailReservationTravelers.length;

                // formato de int al precio
                this.reservation.price = Math.round(this.reservation.price * this.reservation.detailReservationTravelers.length);

                if (this.reservation.price <= 0) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'El precio de la reservación no puede ser cero o negativo',
                        life: 3000
                    });
                    return false;
                }

                this.saveReservation();

                this.payment.idReservation = this.reservation.id;
                this.payment.total = this.reservation.price;
                this.payment.pay = this.payment.total / 2;

                return true;
            }
            return false;
        } else if (step === 2) {
            if (this.payment.idReservation > 0 && this.payment.total > 0 && this.payment.pay > 0) {
                this.payReservation();
                return true;
            }
            return false;
        }
        return false;
    }

    nextStep() {
        if (this.validateStep(this.activeStepIndex)) {
            this.activeStepIndex++;
            if (this.activeStepIndex >= this.steps.length) {
                setTimeout(() => {
                    this.onClosePopup();
                }, 3000);
            }
        }
    }

    onClosePopup() {
        this.reservation = new ReservationModel();
        this.payment = new PaymentModel();

        this.traveler = new UserModel();
        this.travel = false;

        this.client = new UserModel();
        this.clients = [];

        this.activeStepIndex = 0;
        this.submitted = false;
        this.isFormDisabled = false;

        this.getAllClients();

        this.toCancel.emit();
    }
}
