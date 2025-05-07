 
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


import { FullCalendarModule } from '@fullcalendar/angular';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ProgrammingService } from '../../../services';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  imports: [CommonModule, FullCalendarModule, MenuModule, ButtonModule],
  providers: [ProgrammingService, MessageService],
})
export class CalendarComponent {
  
}
