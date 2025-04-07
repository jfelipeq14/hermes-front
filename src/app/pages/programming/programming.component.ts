/* eslint-disable @angular-eslint/component-class-suffix */
import { Component } from '@angular/core';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrl: './programming.component.css',
  imports: [CalendarComponent],
})
export class ProgrammingPage {}
