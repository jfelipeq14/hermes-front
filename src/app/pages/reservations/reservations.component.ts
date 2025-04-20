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
  AuthService,
  ClientsService,
  ProgrammingService,
  ReservationsService,
} from '../../services';
import {
  DateModel,
  PackageModel,
  PaymentModel,
  ReservationModel,
  ReservationTravelerModel,
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
    ClientsService,
    MessageService,
    ConfirmationService,
  ],
})
export class ReservationsPage implements OnInit {
  reservation: ReservationModel = new ReservationModel();
  reservations: ReservationModel[] = [];
  reservationDialog = false;
  submitted = false;
  selectedTraveler: ReservationTravelerModel[] = [];
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
  expandedRows: Record<string, boolean> = {};
  statusOptions = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];
  reservationTravelers: ReservationTravelerModel[] = [];

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
    this.clientsService.getAll().subscribe({
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

  findProgramming(id: number) {
    const dateFound = this.dates.find((d) => d.id === id);
    if (!dateFound)
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró la fecha de programación',
        life: 3000,
      });

    this.reservation.idDate = id;
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
      this.reservation.idUser = clientFound.id;
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
      this.authService.register(this.client).subscribe({
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
      this.selectedTraveler.push({
        id: 0,
        idReservation: 0,
        idTraveler: +this.traveler.id,
        status: this.travel,
      });
    }
  }

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }

  onRowExpand(event: any) {
    const reservationId = event.data.id;
    // Cargar los viajeros si aún no están cargados
    if (!this.reservationTravelers.some(t => t.idReservation === reservationId)) {
      this.reservationService.getAllTravelersByReservation(reservationId).subscribe({
        next: (travelers) => {
          // Agregar los nuevos viajeros al array existente
          this.reservationTravelers = [...this.reservationTravelers, ...travelers];
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar los viajeros de la reservación',
            life: 3000
          });
        }
      });
    }
  }

  getTravelersByReservation(reservationId: number): ReservationTravelerModel[] {
    return this.reservationTravelers.filter(
      traveler => traveler.idReservation === reservationId
    );
  }

  getTravelerName(travelerId: number): string {
    const traveler = this.clients.find((c) => c.id === travelerId);
    return traveler ? `${traveler.name} ${traveler.surName}` : 'N/A';
  }

  getTravelerDocument(travelerId: number): string {
    const traveler = this.clients.find((c) => c.id === travelerId);
    return traveler ? traveler.document : 'N/A';
  }

  getTravelerEmail(travelerId: number): string {
    const traveler = this.clients.find((c) => c.id === travelerId);
    return traveler ? traveler.email : 'N/A';
  }

  getTravelerPhone(travelerId: number): string {
    const traveler = this.clients.find((c) => c.id === travelerId);
    return traveler ? traveler.phone : 'N/A';
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
    if (this.activeStepIndex === 0) {
      this.saveReservation();
    } else if (this.activeStepIndex === 1) {
      this.createTraveler(this.reservation.id);
    }

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
    this.reservation.idDate = 2;
    this.reservation.price = 1000;
    console.log('Next step:', this.reservation);
    if (this.reservation.idDate === 0 || this.reservation.idUser === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Por favor, complete todos los campos requeridos',
        life: 3000,
      });
      return;
    }
    this.reservationService.create(this.reservation).subscribe({
      next: (reservation) => {
        this.reservation = reservation;
        console.log('Reservation created:', reservation);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Reservación creada correctamente',
          life: 3000,
        });
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

  createTraveler(idReservation: number) {
    this.selectedTraveler.forEach((traveler) => {
      traveler.id = 0;
      traveler.idReservation = idReservation;
    });

    this.reservationService.createTraveler(this.selectedTraveler).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Viajero creado correctamente',
          life: 3000,
        });
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
    this.getAllDates();
    this.getAllUsers();
    this.closePopup();
    this.reservation = new ReservationModel();
    this.reservations = [];
    this.reservationDialog = false;
    this.submitted = false;
    this.selectedTraveler = [];
    this.dates = [];
    this.clients = [];
    this.client = new UserModel();
    this.travel = false;
    this.traveler = new UserModel();
    this.travelers = [];
    this.payment = new PaymentModel();
    this.packages = [];
    this.activeStepIndex = 0;
    this.submitted = false;
  }
}
