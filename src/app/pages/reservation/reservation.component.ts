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
  UserService,
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
    UserService,
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
  users: UserModel[] = [];
  user: UserModel = new UserModel();
  travel = false;
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
    private userService: UserService,
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
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
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

    const clientFound = this.users.find((u) => u.document === document);

    if (!clientFound) return;

    if (this.reservation.idUser !== 0 && this.user.document !== '') {
      this.travel = true;
      this.traveler = clientFound;
    } else {
      this.user = clientFound;
    }

    if (this.reservation.idUser === 0) {
      this.reservation.idUser = this.user.id;
    }
  }

  createClient(event: any) {
    if (!event.value) {
      return;
    }

    if (this.submitted) {
      this.userService.create(this.user).subscribe({
        next: (user) => {
          if (this.reservation.idUser === 0 && !this.travel) {
            this.reservation.idUser = user.id;
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client created successfully',
            life: 3000,
          });
          this.travelers.push(user);
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

    const clientFound = this.users.find((u) => u.document === event.value);

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
}
