/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit } from '@angular/core';
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
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmationService, MessageService } from 'primeng/api';

import { PaymentService, ReservationsService } from '../../services';
import { PaymentModel, ReservationModel } from '../../models';
import { paymentStatus } from '../../shared/constants';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css'],
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
    DropdownModule,
    ConfirmDialogModule,
    CalendarModule,
  ],
  providers: [
    PaymentService,
    ReservationsService,
    MessageService,
    ConfirmationService,
  ],
})
export class PaymentsPage implements OnInit {
  payments: PaymentModel[] = [];
  reservations: ReservationModel[] = [];
  payment: PaymentModel = new PaymentModel();
  paymentDialog = false;
  submitted = false;
  dateToday: Date = new Date();
  statuses = paymentStatus;

  constructor(
    private paymentService: PaymentService,
    private reservationsService: ReservationsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.payment.date = this.dateToday;
  }

  ngOnInit(): void {
    this.getAllPayments();
    this.getAllReservations();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getAllPayments() {
    this.paymentService.getAll().subscribe({
      next: (payments) => {
        this.payments = payments;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message || 'No se pudieron cargar los pagos',
          life: 3000,
        });
      },
    });
  }

  getAllReservations() {
    this.reservationsService.getAll().subscribe({
      next: (reservations) => {
        this.reservations = reservations;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message || 'No se pudieron cargar las reservas',
          life: 3000,
        });
      },
    });
  }

  showPopup() {
    this.payment = new PaymentModel();
    this.submitted = false;
    this.paymentDialog = true;
  }

  closePopup() {
    this.paymentDialog = false;
    this.submitted = false;
  }

  refresh() {
    this.getAllPayments();
  }

  savePayment() {
    this.submitted = true;

    if (this.payment.id) {
      this.paymentService.update(this.payment).subscribe({
        next: (p) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Pago con ID ${p.id} actualizado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message || 'No se pudo actualizar el pago',
            life: 3000,
          });
        },
      });
    } else {
      this.paymentService.create(this.payment).subscribe({
        next: (p) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Pago con ID ${p.id} creado`,
            life: 3000,
          });
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message || 'No se pudo crear el pago',
            life: 3000,
          });
        },
      });
    }
    this.refresh();
    this.closePopup();
  }

  editPayment(payment: PaymentModel) {
    this.payment = { ...payment };
    this.paymentDialog = true;
  }

  changeStatusPayment(payment: PaymentModel) {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea cambiar el estado del pago con ID ${payment.id}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.paymentService.changeStatus(payment.id).subscribe({
          next: (p) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Pago con ID ${p.id} ${
                p.status ? 'activado' : 'desactivado'
              }`,
              life: 3000,
            });
          },
          error: (e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                e.error.message || 'No se pudo cambiar el estado del pago',
              life: 3000,
            });
          },
        });
        this.refresh();
      },
    });
  }
}
