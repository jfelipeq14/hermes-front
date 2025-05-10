/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { TextareaModule } from 'primeng/textarea';
import { MultiSelectModule } from 'primeng/multiselect';

import { IconFieldModule } from 'primeng/iconfield';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MenuModule } from 'primeng/menu';

import { MeetingService, PackageService, ProgrammingService, ResponsibleService } from '../../services';
import { DateModel, MeetingModel, PackageModel, ResponsibleModel, UserModel } from '../../models';
import { ZONE } from '../../shared/constants';
import { formatTime, getSeverity } from '../../shared/helpers';
import { CalendarComponent, FormProgrammingComponent } from '../../shared/components';

@Component({
    selector: 'app-programming',
    templateUrl: './programming.component.html',
    styleUrls: ['./programming.component.scss'],
    imports: [
        CommonModule,
        MenuModule,
        ButtonModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        FormsModule,
        InputTextModule,
        InputNumberModule,
        InputIconModule,
        MultiSelectModule,
        TextareaModule,
        IconFieldModule,
        DatePickerModule,
        DropdownModule,
        CalendarComponent,
        FormProgrammingComponent
    ],
    providers: [ProgrammingService, PackageService, ResponsibleService, MeetingService, MessageService, ConfirmationService]
})
export class ProgrammingPage implements OnInit {
    @ViewChild('eventMenu') eventMenu: any;

    date: DateModel = new DateModel();
    dates: DateModel[] = [];
    meeting: MeetingModel = new MeetingModel();
    responsible: ResponsibleModel = new ResponsibleModel();
    responsibles: UserModel[] = [];
    packages: PackageModel[] = [];
    zones = ZONE;
    dateDialog = false;
    submitted = false;

    constructor(
        private programmingService: ProgrammingService,
        private packageService: PackageService,
        private responsibleService: ResponsibleService,
        private meetingService: MeetingService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.getAllPackages();
        this.getAllResponsibles();
        this.getAllMeetings();
    }

    getAllMeetings() {
        this.meetingService.getAll().subscribe({
            next: (meetings) => {
                this.dates = this.dates.map((date) => {
                    const meeting = meetings.find((m) => m.idDate === date.id);
                    return {
                        ...date,
                        meeting: meeting ? meeting : null
                    };
                });
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
                    life: 3000
                });
            }
        });
    }

    getAllResponsibles() {
        this.responsibleService.getAll().subscribe({
            next: (responsibles) => {
                this.responsibles = responsibles.map((responsible) => ({
                    ...responsible,
                    fullName: `${responsible.name} ${responsible.surName}`
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

    createDate() {
        this.submitted = true;
        if (this.date.start && this.date.end) {
            const dateToSend = {
                ...this.date,
                start: new Date(this.date.start),
                end: new Date(this.date.end),
                startRegistration: new Date(this.date.startRegistration),
                endRegistration: new Date(this.date.endRegistration)
            };

            if (this.date.id) {
                // Edit existing programming
                this.programmingService.update(dateToSend).subscribe({
                    next: (updatedDate) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Programación ${updatedDate.id} actualizada`,
                            life: 3000
                        });
                        this.createMeeting(updatedDate.id);
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
            } else {
                // Create new programming
                this.programmingService.create(dateToSend).subscribe({
                    next: (date) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: `Programación ${date.id} creada`,
                            life: 3000
                        });

                        this.createMeeting(date.id);
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
        }
    }

    createMeeting(idDate: number) {
        if (!idDate) return;

        this.meeting.idDate = idDate;
        const hourFormated = formatTime(this.meeting.hour);
        this.meeting.hour = hourFormated;
        console.log(this.meeting);

        if (this.meeting.id) {
            this.meetingService.update(this.meeting).subscribe({
                next: (meeting) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Encuentro actualizado con ID ${meeting.id}`,
                        life: 3000
                    });
                    this.refresh();
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
        } else {
            this.meetingService.create(this.meeting).subscribe({
                next: (meeting) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Encuentro creado con ID ${meeting.id}`,
                        life: 3000
                    });
                    this.refresh();
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
    }

    editProgramming(date: DateModel) {
        this.date = {
            ...date,
            start: new Date(date.start),
            end: new Date(date.end),
            startRegistration: new Date(date.startRegistration),
            endRegistration: new Date(date.endRegistration)
        };
        this.meetingService.getByIdDate(date.id).subscribe({
            next: (meeting) => {
                if (!meeting) this.meeting = new MeetingModel();

                this.meeting = {
                    ...meeting,
                    hour: formatTime(meeting.hour)
                };
            },
            error: () => {
                this.meeting = new MeetingModel();
            }
        });
        this.dateDialog = true;
    }

    changeStatusDate(date: DateModel) {
        this.confirmationService.confirm({
            message: '¿Está seguro de que desea cambiar el estado de ' + date.id + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            acceptButtonStyleClass: 'p-button-primary',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => {
                this.programmingService.changeStatus(date.id).subscribe({
                    next: (d) => {
                        this.messageService.add({
                            severity: getSeverity(d.status),
                            summary: 'Éxito',
                            detail: `${d.id} ${d.status ? 'activado' : 'desactivado'}`,
                            life: 3000
                        });
                        this.refresh();
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
        });
    }

    showPopup() {
        this.date = new DateModel();
        this.dateDialog = true;
        this.submitted = false;
    }

    closePopup() {
        this.dateDialog = false;
        this.submitted = false;
        this.date = new DateModel();
        this.meeting = new MeetingModel();
    }

    refresh() {
        this.date = new DateModel();
        this.dates = [];
        this.meeting = new MeetingModel();
        this.responsible = new ResponsibleModel();
        this.packages = [];
        this.responsibles = [];
        this.dateDialog = false;
        this.submitted = false;

        this.getAllPackages();
        this.getAllResponsibles();
    }
}
