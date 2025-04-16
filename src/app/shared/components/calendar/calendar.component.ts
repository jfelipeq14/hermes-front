/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  signal,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
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

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  imports: [CommonModule, FullCalendarModule],
})
export class CalendarComponent {
  @Input() dates: DateModel[] = [];
  @Output() datesChanged = new EventEmitter<DateModel[]>();

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
    events: this.getCalendarEvents(),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
  });

  private getCalendarEvents(): any[] {
    return this.dates.map((date) => ({
      id: date.id.toString(),
      title: date.idPackage,
      start: new Date(date.start),
      allDay: false,
      backgroundColor: date.status === true ? '#4caf50' : '#f44336',
    }));
  }

  constructor(private changeDetector: ChangeDetectorRef) {}

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.datesChanged.emit(this.dates);
  }

  handleEventClick(clickInfo: EventClickArg) {
    const date = this.dates.find((d) => d.id === parseInt(clickInfo.event.id));
    if (!date) return;
  }

  handleEventChange(changeInfo: EventClickArg) {
    const date = this.dates.find((d) => d.id === parseInt(changeInfo.event.id));
    if (date) {
      this.datesChanged.emit(this.dates);
    }
  }

  editDate(date: DateModel) {
    // Implement date editing logic here
  }

  handleEvents(events: EventApi[]) {
    this.changeDetector.detectChanges();
  }
}
