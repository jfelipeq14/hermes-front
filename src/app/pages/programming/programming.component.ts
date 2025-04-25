/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { PackageService, ProgrammingService } from '../../services';
import { DateModel, PackageModel } from '../../models';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.css'], // Fixed typo: changed "styleUrl" to "styleUrls"
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
    IconFieldModule,
    CalendarModule,
    DropdownModule,
  ], // Removed duplicate "InputNumberModule"
  providers: [
    ProgrammingService,
    PackageService,
    MessageService,
    ConfirmationService,
  ],
})
export class ProgrammingPage implements OnInit {
  @ViewChild('eventMenu') eventMenu: any;

  date: DateModel = new DateModel();
  dates: DateModel[] = [];
  packages: PackageModel[] = [];
  dateDialog = false;
  submitted = false;
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
        this.changeStatusDate(this.date);
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
      this.date.start = new Date(info.dateStr);
      this.dateDialog = true;
    },
    events: this.dates.map((date) => ({
      id: date.id.toString(),
      title: `Paquete ${date.idPackage}`,
      start: date.start,
      startStr: date.start,
      end: date.end,
      endStr: date.end,
      allDay: false,
      backgroundColor: 'transparent',
    })),
  });

  constructor(
    private programmingService: ProgrammingService,
    private packageService: PackageService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllDates();
    this.getAllPackages();
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
            startStr: date.start,
            end: date.end,
            endStr: date.end,
            allDay: false,
            backgroundColor: 'transparent',
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

      this.programmingService.create(dateToSend).subscribe({
        next: (date) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Programación ${date.id} creada`,
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

  editProgramming() {
    const id = this.selectedEvent?.id; // Use the selected event to get the ID
    console.log(id);

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
        this.dateDialog = true; // Open the dialog for editing
      }
    }
  }

  getProgrammingById(id: number) {
    // Replace with actual logic to fetch programming details by ID
    return this.dates.find((item) => item.id === id) || new DateModel();
  }

  changeStatusDate(date: DateModel): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de que desea ${
        date.status ? 'desactivar' : 'activar'
      } la programación ${date.id}?`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.programmingService.changeStatus(date.id).subscribe({
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
    this.date = new DateModel();
  }

  refresh() {
    this.getAllDates();
    this.closePopup();
    this.submitted = false;
  }
}
