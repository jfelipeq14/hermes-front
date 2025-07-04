/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TagModule } from 'primeng/tag';

import { AuthService, PaymentService, ProfileService, ReservationsService } from '../../services';
import { PaymentModel, ReservationModel } from '../../models';
import { paymentStatus } from '../../shared/constants';
import { getSeverityPayment, getSeverityReservation, getValuePayment, getValueReservation } from '../../shared/helpers';
import { FormPaymentsComponent } from '../../shared/components';

@Component({
    selector: 'app-payments',
    templateUrl: './payments.component.html',
    styleUrls: ['./payments.component.scss'],
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        ToastModule,
        DialogModule,
        InputTextModule,
        InputNumberModule,
        InputIconModule,
        IconFieldModule,
        DropdownModule,
        ConfirmDialogModule,
        CalendarModule,
        TagModule,
        FormPaymentsComponent
    ],
    providers: [ProfileService, PaymentService, ReservationsService, MessageService, ConfirmationService]
})
export class PaymentsPage implements OnInit {
    authService = inject(AuthService);

    payments: PaymentModel[] = [];
    reservations: ReservationModel[] = [];
    payment: PaymentModel = new PaymentModel();
    dateToday: Date = new Date();
    statuses = paymentStatus;
    getServerityPayment = getSeverityPayment;
    getSeverityReservation = getSeverityReservation;
    getValuePayment = getValuePayment;
    getValueReservation = getValueReservation;
    expandedRows: Record<string, boolean> = {};
    totalPay = 0;

    disabled = false;
    dialogVisible = false;
    dialogType: 'image' | 'payment' = 'image';
    isPayFixed = false;

    constructor(
        private profileService: ProfileService,
        private paymentService: PaymentService,
        private reservationService: ReservationsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.loadData();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    loadData() {
        this.profileService.getCurrentUser().subscribe({
            next: (userData) => {
                if (userData.idRole === 3) {
                    this.reservationService.getAllByUser(userData.id).subscribe({
                        next: (reservations) => {
                            this.reservations = reservations.filter((r) => r.idUser === userData.id);
                            this.disabled = true;
                            this.reservations.forEach((reservation) => {
                                this.paymentService.getByReservation(reservation.id).subscribe({
                                    next: (payments) => {
                                        reservation.totalPay = payments.reduce((total, payment) => total + Number(payment.pay), 0);
                                        reservation.isFullyPaid = reservation.totalPay >= reservation.price;
                                        this.payments = [...this.payments, ...payments];
                                    },
                                    error: () => {
                                        reservation.totalPay = 0;
                                        reservation.isFullyPaid = false;
                                    }
                                });
                            });
                        },
                        error: (e) => {
                            this.disabled = false;
                            console.error(e);
                        }
                    });
                } else {
                    this.paymentService.getAllReservationWhitPayments().subscribe({
                        next: (reservations) => {
                            this.reservations = reservations;
                            // Calcular totalPay para cada reserva
                            this.reservations.forEach((reservation) => {
                                this.paymentService.getByReservation(reservation.id).subscribe({
                                    next: (payments) => {
                                        reservation.totalPay = payments.reduce((total, payment) => total + Number(payment.pay), 0);
                                        reservation.isFullyPaid = reservation.totalPay >= reservation.price;
                                        this.payments = [...this.payments, ...payments];
                                    },
                                    error: () => {
                                        reservation.totalPay = 0;
                                        reservation.isFullyPaid = false;
                                    }
                                });
                            });
                        },
                        error: (e) => {
                            console.error(e);
                        }
                    });
                }
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    getPaymentsByReservation(reservationId: number): PaymentModel[] {
        return this.payments.filter((payment) => payment.idReservation === reservationId);
    }

    getTotalPayByReservation(reservation: ReservationModel): number {
        return this.payments
            .filter((payment) => payment.idReservation === reservation.id)
            .reduce((total, payment) => {
                if (payment.status === 'A') {
                    reservation.isFullyPaid = false;
                    return total + Number(payment.pay) * 0;
                } else {
                    return total + Number(payment.pay);
                }
            }, 0);
    }

    onRowExpand(event: any) {
        const reservationId = event.data.id;
        // Cargar los pagos si aún no están cargados
        if (!this.payments.some((p) => p.idReservation === reservationId)) {
            this.paymentService.getByReservation(reservationId).subscribe({
                next: (payments) => {
                    this.payments = [...this.payments, ...payments];
                    // Calcular la suma de abonos para esta reserva
                    const totalPaid = this.payments.filter((p) => p.idReservation === reservationId).reduce((total, payment) => total + Number(payment.pay), 0);
                    // Asignar el valor a la reserva correspondiente
                    const reservation = this.reservations.find((r) => r.id === reservationId);
                    if (reservation) {
                        reservation.totalPay = totalPaid;
                    }
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'No se pudieron cargar los pagos de la reservación',
                        life: 3000
                    });
                }
            });
        }
    }

    savePayment(payment: PaymentModel) {
        if (!payment.idReservation || !payment.pay || payment.pay <= 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'Debe ingresar un monto válido y seleccionar una reserva',
                life: 3000
            });
            return;
        }
        if (payment.id) {
            this.paymentService.update(payment).subscribe({
                next: (p) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Pago con ID ${p.id} actualizado`,
                        life: 3000
                    });
                    this.refresh();
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message || 'No se pudo actualizar el pago',
                        life: 3000
                    });
                }
            });
        } else {
            this.paymentService.create(payment).subscribe({
                next: (p) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Pago con ID ${p.id} creado`,
                        life: 3000
                    });
                    this.refresh();
                },
                error: (e) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: e.error.message || 'No se pudo crear el pago',
                        life: 3000
                    });
                }
            });
        }
    }

    editPayment(payment: PaymentModel) {
        this.payment = { ...payment };
        this.dialogType = 'payment';
        this.dialogVisible = true;
    }

    changeStatusPayment(payment: any) {
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
            message: '¿Está seguro de que desea cambiar el estado de ' + payment.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.paymentService.changeStatus(payment.id, payment.status).subscribe({
                    next: (pay) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `${pay.id} cambiado a ${this.getValuePayment(pay.status)}`,
                            life: 3000
                        });
                        // Si el pago fue anulado, descuenta el 50% de su valor del totalPay de la reserva
                        if (pay.status === 'A') {
                            const reservation = this.reservations.find((r) => r.id === pay.idReservation);
                            if (reservation) {
                                reservation.totalPay = (reservation.totalPay || 0) - Number(pay.pay) * 0.5;
                                reservation.isFullyPaid = reservation.totalPay >= reservation.price;
                            }
                            this.refresh();
                        } else if (pay.status === 'N') {
                            // Si el pago fue marcado como abonado, cambia el estado de la reserva a confirmada
                            this.reservationService.changeStatus(pay.idReservation, 'C').subscribe({
                                next: (res) => {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: `${res.id} cambiado a ${this.getValueReservation(res.status)}`,
                                        life: 3000
                                    });
                                    this.refresh();
                                },
                                error: () => {
                                    this.refresh();
                                }
                            });
                        } else if (pay.status === 'P') {
                            // Si el pago fue marcado como pagado, cambia el estado de la reserva a pagado
                            this.reservationService.changeStatus(pay.idReservation, 'P').subscribe({
                                next: (res) => {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Éxito',
                                        detail: `${res.id} cambiado a ${this.getValueReservation(res.status)}`,
                                        life: 3000
                                    });
                                    this.refresh();
                                },
                                error: () => {
                                    this.refresh();
                                }
                            });
                        } else {
                            this.refresh();
                        }
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
            reject: () => this.refresh()
        });
    }

    showImage(payment: PaymentModel) {
        if (!payment.voucher) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay imagen disponible para este pago',
                life: 3000
            });
            return;
        }
        this.payment = { ...payment };
        this.dialogType = 'image';
        this.dialogVisible = true;
    }

    showPopup(idReservation: number) {
        this.payment = new PaymentModel();
        this.payment.idReservation = idReservation;
        this.payment.total = this.reservations.find((r) => r.id === idReservation)?.price || 0;
        this.payment.pay = this.payment.total / 2; // Pago inicial del 50%
        this.dialogType = 'payment';
        this.dialogVisible = true;
        this.isPayFixed = true;
    }

    closePopup() {
        this.dialogVisible = false;
        this.isPayFixed = false;
    }

    refresh() {
        this.payments = [];
        this.reservations = [];
        this.payment = new PaymentModel();
        this.dialogVisible = false;
        this.dateToday = new Date();
        this.statuses = paymentStatus;
        this.getServerityPayment = getSeverityPayment;
        this.getSeverityReservation = getSeverityReservation;
        this.getValuePayment = getValuePayment;
        this.getValueReservation = getValueReservation;
        this.expandedRows = {};
        this.disabled = false;
        this.loadData();
    }
}
