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

    @Input() reservationDialog = false;
    @Input() clientsDialog = false;
    @Input() programmingDialog = false;
    @Output() clickPackage = new EventEmitter<any>();
    @Output() editProgramming = new EventEmitter<DateModel>();
    @Output() changeStatusDate = new EventEmitter<DateModel>();
    @Output() handleReservation = new EventEmitter<boolean>();
    @Output() handleClients = new EventEmitter<boolean>();
    @Output() handleProgramming = new EventEmitter<boolean>();

    date = new DateModel();
    dates: DateModel[] = [];

    calendarOptions = signal<CalendarOptions>({
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
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
            this.programmingDialog = true;
        },
        events: this.dates.map((date) => ({
            id: date.id.toString(),
            title: `Paquete ${date.idPackage}`,
            start: date.start,
            end: date.end,
            allDay: false,
            status: date.status
        }))
    });

    getMappedMenuItems(event: any) {
        return [
            {
                label: 'Editar programación',
                icon: 'pi pi-pencil',
                command: () => {
                    this.onEditProgramming(event.id);
                }
            },
            {
                label: 'Cambiar estado',
                icon: 'pi pi-fw pi-sync',
                command: () => {
                    this.onChangeStatusDate(event.id);
                }
            },
            {
                label: 'Crear reserva',
                icon: 'pi pi-fw pi-calendar-plus',
                command: () => {
                    this.onHandleReservation(event.id);
                }
            },
            {
                label: 'Ver clientes',
                icon: 'pi pi-fw pi-user',
                command: () => {
                    this.onHandleClients(event.id);
                }
            }
        ];
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

    onClickPackage(id: any) {
        this.clickPackage.emit(id);
    }

    onEditProgramming(id: any) {
        if (!id) return;
        const date = this.dates.find((date) => date.id === id);
        this.editProgramming.emit(date);
    }

    onChangeStatusDate(id: any) {
        if (!id) return;
        const date = this.dates.find((date) => date.id === id);
        this.changeStatusDate.emit(date);
    }

    onHandleReservation(id: any) {
        this.handleReservation.emit(!this.reservationDialog);
    }

    onHandleClients(id: any) {
        this.handleClients.emit(!this.clientsDialog);
    }

    onHandleProgramming() {
        this.handleProgramming.emit(!this.programmingDialog);
    }
}
