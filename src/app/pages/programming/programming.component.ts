/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CalendarOptions } from '@fullcalendar/core/index.js';
import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';

import { IconFieldModule } from 'primeng/iconfield';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';

import {
  MeetingService,
  PackageService,
  ProgrammingService,
  ResponsibleService,
} from '../../services';
import {
  DateModel,
  MeetingModel,
  PackageModel,
  ResponsibleModel,
  UserModel,
} from '../../models';
import { ZONE } from '../../shared/constants';

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.css'],
  imports: [
    CommonModule,
    FullCalendarModule,
    MenuModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule,
    FormsModule,
    InputTextModule,
    InputNumberModule,
    InputIconModule,
    MultiSelectModule,
    TextareaModule,
    IconFieldModule,
    SplitButtonModule,
    DatePickerModule,
    DropdownModule,
  ],
  providers: [
    ProgrammingService,
    PackageService,
    ResponsibleService,
    MeetingService,
    MessageService,
    ConfirmationService,
  ],
})
export class ProgrammingPage implements OnInit {
  @ViewChild('eventMenu') eventMenu: any;

  date: DateModel = new DateModel();
  dates: DateModel[] = [];
  meeting: MeetingModel = new MeetingModel();
  responsible: ResponsibleModel = new ResponsibleModel();
  packages: PackageModel[] = [];
  responsibles: UserModel[] = [];
  zones = ZONE;
  dateDialog = false;
  submitted = false;
  dateNow = this.formatDate(new Date());
  selectedEvent: any;
  menuItems: MenuItem[] = [
    {
      label: 'Editar programación',
      icon: 'pi pi-pencil',
      command: () => this.editProgramming(),
    },
    {
      label: 'Cambiar estado',
      icon: 'pi pi-fw pi-sync',
      command: () => {
        this.changeStatusDate();
      },
    },
    {
      label: 'Crear reserva',
      icon: 'pi pi-fw pi-calendar-plus',
      command: () => {
        this.goToReservation(this.date.id);
      },
    },
    {
      label: 'Ver clientes',
      icon: 'pi pi-fw pi-user',
    },
  ];

  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventDisplay: 'block',
    eventClassNames: ['calendar-event'],
    dateClick: (info) => {
      this.date = new DateModel();
      this.date.start = info.date;
      this.date.end = info.date;
      this.dateDialog = true;
    },
    events: this.dates.map((date) => ({
      id: date.id.toString(),
      title: `Paquete ${date.idPackage}`,
      start: date.start,
      end: date.end,
      allDay: false,
      classNames: ['bg-primary'],
    })),
  });

  constructor(
    private programmingService: ProgrammingService,
    private packageService: PackageService,
    private responsibleService: ResponsibleService,
    private meetingService: MeetingService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllDates();
    this.getAllPackages();
    this.getAllResponsibles();
  }

  getAllDates() {
    this.programmingService.getAll().subscribe({
      next: (dates) => {
        this.dates = dates;
        this.calendarOptions.update((options) => ({
          ...options,
          events: dates.map((date) => ({
            id: date.id.toString(),
            title: `Paquete ${date.idPackage}`,
            start: date.start,
            end: date.end,
            allDay: false,
            classNames: [date.status ? 'bg-primary' : 'bg-danger', 'border-0'],
          })),
        }));
      },
    });
  }

  getAllPackages() {
    this.packageService.getAll().subscribe({
      next: (packages) => {
        this.packages = packages;
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

  getAllResponsibles() {
    this.responsibleService.getAll().subscribe({
      next: (responsibles) => {
        this.responsibles = responsibles.map((responsible) => ({
          ...responsible,
          fullName: `${responsible.name} ${responsible.surName}`,
        }));
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

  createDate() {
    this.submitted = true;
    if (this.date.start && this.date.end) {
      const dateToSend = {
        ...this.date,
        start: new Date(this.date.start),
        end: new Date(this.date.end),
        startRegistration: new Date(this.date.startRegistration),
        endRegistration: new Date(this.date.endRegistration),
      };

      if (this.date.id) {
        // Edit existing programming
        this.programmingService.update(dateToSend).subscribe({
          next: (updatedDate) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Programación ${updatedDate.id} actualizada`,
              life: 3000,
            });
            this.createMeeting(updatedDate.id);
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
      } else {
        // Create new programming
        this.programmingService.create(dateToSend).subscribe({
          next: (date) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: `Programación ${date.id} creada`,
              life: 3000,
            });

            this.createMeeting(date.id);
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

  createMeeting(idDate: number) {
    if (!idDate) return;

    this.meeting.idDate = idDate;
    const hourFormated = this.formatTime(this.meeting.hour);
    this.meeting.hour = hourFormated;
    console.log(this.meeting);

    if (this.meeting.id) {
      this.meetingService.update(this.meeting).subscribe({
        next: (meeting) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Encuentro actualizado con ID ${meeting.id}`,
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
    } else {
      this.meetingService.create(this.meeting).subscribe({
        next: (meeting) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Encuentro creado con ID ${meeting.id}`,
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

  // Helper function to format a Date object to HH:mm
  private formatTime(date: string): string {
    const parsedDate = new Date(date);
    const hours = String(parsedDate.getUTCHours()).padStart(2, '0');
    const minutes = String(parsedDate.getUTCMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  private formatDate(date: Date): Date {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return new Date(`${year}-${month}-${day}`);
  }

  editProgramming() {
    const id = this.selectedEvent?.id; // Use the selected event to get the ID

    if (id) {
      const programming = this.getProgrammingById(+id); // Fetch programming details by ID
      if (programming) {
        this.date = {
          ...programming,
          start: new Date(programming.start), // Convert to Date object
          end: new Date(programming.end), // Convert to Date object
          startRegistration: new Date(programming.startRegistration), // Convert to Date object
          endRegistration: new Date(programming.endRegistration), // Convert to Date object
        };

        // Fetch the meeting related to the programming
        this.meetingService.getByIdDate(programming.id).subscribe({
          next: (meeting) => {
            console.log(meeting);

            this.meeting = {
              ...meeting,
              hour: new Date(`1970-01-01T${meeting.hour}`).toString(), // Convert hour to Date object
            };
            this.dateDialog = true; // Open the dialog for editing
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

  getProgrammingById(id: number) {
    return this.dates.find((item) => item.id === id) || new DateModel();
  }

  changeStatusDate(): void {
    const id = this.selectedEvent?.id;

    if (!id) {
      return;
    }

    const programming = this.getProgrammingById(+id); // Fetch programming details by ID
    if (programming) {
      this.confirmationService.confirm({
        message: `¿Está seguro de que desea ${
          programming.status ? 'desactivar' : 'activar'
        } la programación ${programming.id}?`,
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Sí',
        rejectLabel: 'No',
        acceptButtonStyleClass: 'p-button-primary',
        rejectButtonStyleClass: 'p-button-secondary',
        accept: () => {
          this.programmingService.changeStatus(programming.id).subscribe({
            next: (updatedDate) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Éxito',
                detail: `Programación ${updatedDate.id} ${
                  updatedDate.status ? 'activada' : 'desactivada'
                }`,
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
        },
      });
    }
  }

  onResponsibleChange(event: any): void {
    if (!event.value) return;

    this.meeting.responsibles = event.value.map((responsible: any) => ({
      idUser: responsible,
    }));
  }

  goToReservation(idDate: number) {
    if (!idDate) {
      return;
    }

    this.router.navigate(['/home/reservations'], {
      queryParams: { idDate: this.date.id },
    });
  }

  showPopup() {
    this.date = new DateModel();
    this.dateDialog = true;
    this.submitted = false;
  }

  closePopup() {
    this.dateDialog = false;
    this.submitted = false;
    this.date = new DateModel();
    this.meeting = new MeetingModel();
  }

  refresh() {
    this.date = new DateModel();
    this.dates = [];
    this.meeting = new MeetingModel();
    this.responsible = new ResponsibleModel();
    this.packages = [];
    this.responsibles = [];
    this.dateDialog = false;
    this.submitted = false;

    this.getAllDates();
    this.getAllPackages();
    this.getAllResponsibles();
  }
}
