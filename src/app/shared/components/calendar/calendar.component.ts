/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarOptions, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';

import { DateModel } from '../../../models';
import { MessageService, MenuItem } from 'primeng/api';
import { ProgrammingService } from '../../../services';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule, FullCalendarModule, MenuModule, ButtonModule],
  providers: [ProgrammingService, MessageService],
})
export class CalendarComponent implements OnInit {
  @ViewChild('eventMenu') eventMenu: any;

  constructor(private programmingService: ProgrammingService) {}

  selectedEvent: any;
  dates: DateModel[] = [];
  menuItems: MenuItem[] = [
    {
      label: 'Editar programación',
      icon: 'pi pi-fw pi-pencil',
    },
    {
      label: 'Cambiar estado',
      icon: 'pi pi-fw pi-sync',
    },
    {
      label: 'Crear reserva',
      icon: 'pi pi-fw pi-calendar-plus',
    },
    {
      label: 'Ver clientes',
      icon: 'pi pi-fw pi-user',
    },
  ];

  ngOnInit(): void {
    this.getAllDates();
  }

  getAllDates() {
    this.programmingService.getAll().subscribe({
      next: (dates) => {
        this.dates = dates;
        this.calendarOptions.update((options) => ({
          ...options,
          events: dates.map((date) => ({
            title: `Paquete ${date.idPackage}`,
            start: date.start,
            end: date.end,
            allDay: false,
          })),
        }));
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

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
    events: this.dates.map((date) => ({
      title: `Paquete ${date.idPackage}`,
      start: date.start,
      end: date.end,
      allDay: false,
    })),
  });

  eventMenuItems(event: EventApi): MenuItem[] {
    return [
      {
        label: 'View Details',
        icon: 'pi pi-eye',
        command: () => this.viewEventDetails(event),
      },
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => this.editEvent(event),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => this.deleteEvent(event),
      },
    ];
  }

  showEventMenu(
    event: Event,
    menuButton: HTMLElement,
    calendarEvent: EventApi
  ): void {
    event.stopPropagation();
    this.eventMenu.toggle(event, menuButton);
  }

  viewEventDetails(event: EventApi): void {
    console.log('View event details', event);
  }

  editEvent(event: EventApi): void {
    console.log('Edit event', event);
  }

  deleteEvent(event: EventApi): void {
    console.log('Delete event', event);
  }
}
