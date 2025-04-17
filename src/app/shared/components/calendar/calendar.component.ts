/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CalendarOptions } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { TabsModule } from 'primeng/tabs';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';

import { DateModel } from '../../../models';
import { MessageService } from 'primeng/api';
import { ProgrammingService } from '../../../services';

interface MenuItem {
  label: string;
  icon: string;
  command?: () => void;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule, FullCalendarModule, MenuModule, ButtonModule],
  providers: [ProgrammingService, MessageService],
})
export class CalendarComponent implements OnInit {
  constructor(private programmingService: ProgrammingService) {}

  selectedEvent: any;
  dates: DateModel[] = [];
  overlayMenuItems: MenuItem[] = [
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
}
