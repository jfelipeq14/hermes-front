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

import {
  ProgrammingService,
  ReservationsService,
  UserService,
} from '../../services';
import {
  DateModel,
  PackageModel,
  PaymentModel,
  ReservationModel,
  UserModel,
} from '../../models';
import {
  FormClientsComponent,
  FormPaymentsComponent,
  FormTravelersComponent,
} from '../../shared/components';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.css'],
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
    FormPaymentsComponent,
  ],
  providers: [
    ReservationsService,
    ProgrammingService,
    UserService,
    MessageService,
    ConfirmationService,
  ],
})
export class ReservationsPage implements OnInit {
  reservation: ReservationModel = new ReservationModel();
  reservations: ReservationModel[] = [];
  reservationDialog = false;
  submitted = false;
  expandedRows: Record<string, boolean> = {};
  statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  dates: DateModel[] = [];
  clients: UserModel[] = [];
  client: UserModel = new UserModel();
  travel = false;
  traveler: UserModel = new UserModel();
  travelers: UserModel[] = [];
  payment: PaymentModel = new PaymentModel();
  packages: PackageModel[] = [];
  activeStepIndex = 0;
  steps = [
    { label: 'Crear Cliente', value: 0 },
    { label: 'Agregar Viajeros', value: 1 },
    { label: 'Confirmar Reserva', value: 2 },
  ];

  constructor(
    private reservationService: ReservationsService,
    private programmingService: ProgrammingService,
    private userService: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.getAllReservations();
    this.getAllDates();
    this.getAllUsers();
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
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
          life: 3000,
        });
      },
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
          life: 3000,
        });
      },
    });
  }

  getAllUsers() {
    this.userService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message,
          life: 3000,
        });
      },
    });
  }

  searchClient(document: any) {
    if (!document) {
      return;
    }

    const clientFound = this.clients.find((u) => u.document === document);

    if (!clientFound) return;

    if (this.reservation.idUser !== 0 && this.client.document !== '') {
      this.travel = true;
      this.traveler = clientFound;
    } else {
      this.client = clientFound;
    }

    if (this.reservation.idUser === 0) {
      this.reservation.idUser = this.client.id;
    }
  }

  createClient(event: any) {
    console.log('Client created:', event);

    if (!event.value) {
      return;
    }

    if (this.submitted) {
      this.userService.create(this.client).subscribe({
        next: (client) => {
          if (this.reservation.idUser === 0 && !this.travel) {
            this.reservation.idUser = client.id;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client created successfully',
            life: 3000,
          });
          this.travelers.push(client);
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message,
            life: 3000,
          });
        },
      });
    }

    const clientFound = this.clients.find((u) => u.document === event.value);

    if (!clientFound) return;
    if (this.reservation.idUser === 0) {
      this.reservation.idUser = clientFound.id;
    }
    if (this.travel) {
      this.travelers.push(clientFound);
    }
  }

  addTraveler() {
    if (this.travel && this.traveler.document) {
      this.travelers.push(this.traveler);
    }
  }

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }

  onRowExpand(event: any) {
    console.log('Row expanded:', event);
  }

  onRowCollapse(event: any) {
    console.log('Row collapsed:', event);
  }

  previousStep() {
    if (this.activeStepIndex > 0) {
      this.activeStepIndex--;
    }
  }

  nextStep() {
    if (
      this.isStepValid(this.activeStepIndex) &&
      this.activeStepIndex < this.steps.length - 1
    ) {
      this.activeStepIndex++;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return this.reservation.idUser > 0; // Validar que se haya seleccionado un cliente
      case 1:
        return this.travelers.length > 0; // Validar que se haya agregado al menos un viajero
      case 2:
        return this.reservation.idUser > 0 && this.travelers.length > 0; // Validar que todo esté completo
      default:
        return false;
    }
  }

  saveReservation() {
    if (this.activeStepIndex === 2) {
      this.reservationService.create(this.reservation).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Reservación creada correctamente',
            life: 3000,
          });
          this.refresh();
        },
        error: (e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: e.error.message,
            life: 3000,
          });
        },
      });
    }
  }

  getPrice(id: number) {
    const dateFound = this.dates.find((d) => d.id === id);
    if (!dateFound) return 0;
    return this.packages.find((p) => p.id === dateFound.idPackage)?.price;
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
    this.getAllReservations();
    this.closePopup();
    this.submitted = false;
  }
}
