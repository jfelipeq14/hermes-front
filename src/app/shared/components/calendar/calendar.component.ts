import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
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

import { AuthService, ProgrammingService } from '../../../services';
import { DateModel, PackageModel } from '../../../models';
import { ROLE_IDS } from '../../constants';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    imports: [CommonModule, FullCalendarModule, SplitButtonModule, MenuModule, ButtonModule],
    providers: [ProgrammingService, MessageService]
})
export class CalendarComponent implements OnInit {
    authService = inject(AuthService);

    constructor(
        private programmingService: ProgrammingService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.getAllDates();
    }

    @Input() packages: PackageModel[] = [];
    @Output() clickDate = new EventEmitter<DateModel>();
    @Output() clickProgramming = new EventEmitter<any>();
    @Output() editProgramming = new EventEmitter<DateModel>();
    @Output() changeStatusDate = new EventEmitter<DateModel>();
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
            },
            visible: this.authService.hasRole([ROLE_IDS.ADMIN])
        },
        {
            label: 'Cambiar estado',
            icon: 'pi pi-fw pi-sync',
            command: () => {
                this.onChangeStatusDate();
            },
            visible: this.authService.hasRole([ROLE_IDS.ADMIN])
        },
        {
            label: 'Ver clientes',
            icon: 'pi pi-fw pi-user',
            command: () => {
                this.onClickClients();
            },
            visible: this.authService.hasRole([ROLE_IDS.ADMIN, ROLE_IDS.GUIDE])
        }
    ];

    calendarOptions = signal<CalendarOptions>({
        plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listWeek'
        },
        initialView: 'dayGridMonth',
        timeZone: 'UTC',
        selectable: true,
        dateClick: (info) => this.onClickDate(info),
        events: this.dates.map((date) => ({
            id: date.id.toString(),
            title: this.getPackageInfo(date.idPackage)?.name || 'Paquete no encontrado',
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
                        title: this.getPackageInfo(date.idPackage)?.name || 'Paquete no encontrado',
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

    getPackageInfo(id: number) {
        const packageInfo = this.packages.find((pkg) => pkg.id === id);
        return packageInfo ? packageInfo : null;
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

        this.clickProgramming.emit(this.programmingSelect.id);
    }

    clickPackage(selectPackage: any) {
        if (!selectPackage) return;
        this.programmingSelect = this.dates.find((date) => date.id === +selectPackage.id);
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

    onClickClients() {
        if (!this.programmingSelect) return;
        this.toClients.emit(this.programmingSelect.id);
    }
}
