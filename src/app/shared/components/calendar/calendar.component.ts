import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { MenuItem, MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';

import { ProgrammingService } from '../../../services';
import { DateModel } from '../../../models';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    imports: [CommonModule, FullCalendarModule, SplitButtonModule, MenuModule, ButtonModule],
    providers: [ProgrammingService, MessageService]
})
export class CalendarComponent implements OnInit {
    constructor(
        private programmingService: ProgrammingService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.getAllDates();
    }

    @Output() clickDate = new EventEmitter<DateModel>();
    @Output() clickProgramming = new EventEmitter<any>();
    @Output() editProgramming = new EventEmitter<DateModel>();
    @Output() changeStatusDate = new EventEmitter<DateModel>();
    @Output() toReservation = new EventEmitter<number>();
    @Output() toClients = new EventEmitter<number>();

    dates: DateModel[] = [];
    date: DateModel = new DateModel();

    programmingSelect: any = null;

    buttons: MenuItem[] = [
        {
            label: 'Editar programación',
            icon: 'pi pi-pencil',
            command: () => {
                this.onEditProgramming();
            }
        },
        {
            label: 'Cambiar estado',
            icon: 'pi pi-fw pi-sync',
            command: () => {
                this.onChangeStatusDate();
            }
        },
        {
            label: 'Crear reserva',
            icon: 'pi pi-fw pi-calendar-plus',
            command: () => {
                this.onClickReservation();
            }
        },
        {
            label: 'Ver clientes',
            icon: 'pi pi-fw pi-user',
            command: () => {
                this.onClickClients();
            }
        }
    ];

    calendarOptions = signal<CalendarOptions>({
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        initialView: 'dayGridMonth',
        selectable: true,
        dateClick: (info) => this.onClickDate(info),
        events: this.dates.map((date) => ({
            id: date.id.toString(),
            title: `Paquete ${date.idPackage}`,
            start: date.start,
            end: date.end,
            allDay: false,
            status: date.status
        }))
    });

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
                        status: date.status
                    }))
                }));
            },
            error: (e) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.error.message,
                    life: 3000
                });
            }
        });
    }

    onClickDate(info: any) {
        if (!info) return;

        this.date = new DateModel();
        this.date.start = info.date;
        this.date.end = info.date;
        this.clickDate.emit(this.date);
    }

    onClickProgramming(event: any, selectEvent: any) {
        if (!event || !selectEvent) return;

        this.programmingSelect = this.dates.find((date) => date.id === +selectEvent.id);

        this.clickProgramming.emit(this.programmingSelect);
    }

    onEditProgramming() {
        if (!this.programmingSelect) return;
        const programming = this.dates.find((date) => date.id === this.programmingSelect.id);
        this.editProgramming.emit(programming);
    }

    onChangeStatusDate() {
        if (!this.programmingSelect) return;
        const programming = this.dates.find((date) => date.id === this.programmingSelect.id);
        this.changeStatusDate.emit(programming);
    }

    onClickReservation() {
        if (!this.programmingSelect) return;
        this.toReservation.emit(this.programmingSelect.id);
    }

    onClickClients() {
        if (!this.programmingSelect) return;
        this.toClients.emit(this.programmingSelect.id);
    }
}
