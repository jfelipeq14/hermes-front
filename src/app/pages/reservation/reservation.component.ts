/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import { MessageService } from 'primeng/api';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import {
  FormClientsComponent,
  FormPaymentsComponent,
  FormTravelersComponent,
} from '../../shared/components';
import {
  ReservationsService,
  ProgrammingService,
  ClientsService,
  AuthService,
} from '../../services';
import {
  PackageModel,
  PaymentModel,
  ReservationModel,
  UserModel,
} from '../../models';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css',
  imports: [
    CommonModule,
    StepperModule,
    ButtonModule,
    CardModule,
    BreadcrumbModule,
    FormClientsComponent,
    FormTravelersComponent,
    FormPaymentsComponent,
  ],
  providers: [
    ReservationsService,
    ProgrammingService,
    ClientsService,
    AuthService,
    MessageService,
  ],
})
export class ReservationComponent implements OnInit {
  activeStepIndex = 0;
  steps = [
    { label: 'Crear Cliente', value: 0 },
    { label: 'Agregar Viajeros', value: 1 },
    { label: 'Confirmar Reserva', value: 2 },
  ];
  reservation: ReservationModel = new ReservationModel();
  clients: UserModel[] = [];
  client: UserModel = new UserModel();
  travel = true;
  traveler: UserModel = new UserModel();
  travelers: UserModel[] = [];
  payment: PaymentModel = new PaymentModel();
  package: PackageModel = new PackageModel();
  submitted = false;

  breadcrumbHome = { icon: 'pi pi-home', to: '' };
  breadcrumbItems = [{ label: 'Reservation' }];

  constructor(
    private reservationService: ReservationsService,
    private programmingService: ProgrammingService,
    private clientService: ClientsService,
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const idDate = params['idDate'];
      if (idDate) {
        this.reservation.idDate = +idDate;
      }
    });
    this.getAllClients();
  }

  getAllClients() {
    this.clientService.getAll().subscribe({
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

    const clientFound = this.clients.find((c) => c.document === document);

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
    if (!event.value) {
      return;
    }

    if (this.submitted) {
      this.client.idRole = 3;
      this.authService.register(this.client).subscribe({
        next: (client) => {
          if (this.reservation.idUser === 0) {
            this.reservation.idUser = client.id;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client created successfully',
            life: 3000,
          });
          if (this.travel) {
            this.travelers.push(client);
          }
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

    // const clientFound = this.clients.find((c) => c.document === event.value);

    // if (!clientFound) return;
    // if (this.reservation.idUser === 0) {
    //   this.reservation.idUser = clientFound.id;
    // }
    // if (this.travel) {
    //   this.travelers.push(clientFound);
    // }
  }

  addTraveler() {
    if (this.travel && this.traveler.document) {
      this.travelers.push(this.traveler);
    }
  }

  saveReservation() {
    if (this.activeStepIndex === 2) {
      this.reservationService.create(this.reservation).subscribe({
        next: (reservation) => {
          this.createTravelers(reservation.id);
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
  }

  createTravelers(idReservation: number) {
    if (this.travelers.length <= 0 || !idReservation) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No hay viajeros agregados',
        life: 3000,
      });
      return;
    }

    // this.travelers.forEach((traveler) => {
    //   this.clientService.createTraveler(traveler).subscribe({
    //     next: (traveler) => {
    //       this.messageService.add({
    //         severity: 'success',
    //         summary: 'Success',
    //         detail: 'Traveler created successfully',
    //         life: 3000,
    //       });
    //     },
    //     error: (e) => {
    //       this.messageService.add({
    //         severity: 'error',
    //         summary: 'Error',
    //         detail: e.error.message,
    //         life: 3000,
    //       });
    //     },
    //   });
    // });
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
        return this.reservation.idUser > 0;
      case 1:
        return this.travelers.length > 0;
      case 2:
        return this.reservation.idUser > 0 && this.travelers.length > 0;
      default:
        return false;
    }
  }
}
