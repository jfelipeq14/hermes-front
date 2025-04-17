/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  signal,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { DateModel } from '../../../models';
import { MessageService } from 'primeng/api';
import { ProgrammingService } from '../../../services';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule, FullCalendarModule],
  providers: [ProgrammingService, MessageService],
})
export class CalendarComponent implements OnInit {
  constructor(
    private changeDetector: ChangeDetectorRef,
    private programmingService: ProgrammingService,
    private messageService: MessageService
  ) {}

  dates: DateModel[] = [];

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
            allDay: true,
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
      allDay: true,
    })),
  });
}
