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

import {
  ProgrammingService,
  ReservationsService,
  UserService,
} from '../../services';
import { DateModel, ReservationModel, UserModel } from '../../models';
import { FormClientsComponent } from '../../shared/components';

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
    FormClientsComponent,
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
  users: UserModel[] = [];
  user: UserModel = new UserModel();
  travel=false;
  travelers: UserModel[] = [];
  submitted = false;

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

  getSeverity(status: boolean): 'success' | 'danger' {
    return status ? 'success' : 'danger';
  }

  onRowExpand(event: any) {
    console.log('Row expanded:', event);
  }

  onRowCollapse(event: any) {
    console.log('Row collapsed:', event);
  }

  createClient(event: any) {
    console.log('Client created:', event);

    if (!event.value) {
      return;
    }

    const clientFound = this.users.find((u) => u.document === event.value);

    if (!clientFound) {
      return;
    }
    this.user = clientFound;
    if (this.travel){
      this.travelers.push(this.user);
    }
    if(this.submitted){
      this.userService.create(this.user).subscribe({
        next: (user) => {
          this.user = user;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Client created successfully',
            life: 3000,
          });
        }
      });

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
    this.getAllReservations();
    this.closePopup();
    this.submitted = false;
  }


}
