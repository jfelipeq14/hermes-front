/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @angular-eslint/component-class-suffix */
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
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

import { AuthService, MeetingService, PackageService, ProfileService, ProgrammingService, ReservationsService, ResponsibleService } from '../../services';
import { DateModel, MeetingModel, PackageModel, ReservationModel, ReservationTravelerModel, ResponsibleModel, UserModel } from '../../models';
import { ROLE_IDS, ZONE } from '../../shared/constants';
import { formatTime, getSeverity } from '../../shared/helpers';
import { CalendarComponent, FormProgrammingComponent, FormReservationComponent, TableClientsComponent } from '../../shared/components';

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
        FormProgrammingComponent,
        FormReservationComponent,
        TableClientsComponent
    ],
    providers: [ProfileService, ProgrammingService, PackageService, ResponsibleService, MeetingService, ReservationsService, MessageService, ConfirmationService]
})
export class ProgrammingPage implements OnInit {
    authService = inject(AuthService);

    date: DateModel = new DateModel();
    dates: DateModel[] = [];
    meeting: MeetingModel = new MeetingModel();
    responsible: ResponsibleModel = new ResponsibleModel();
    responsibles: UserModel[] = [];
    packages: PackageModel[] = [];
    reservations: ReservationModel[] = [];
    clients: ReservationTravelerModel[] = [];
    zones = ZONE;
    submitted = false;
    idDate: number = 0;

    dialogVisible = false;
    dialogType: 'programming' | 'reservation' | 'clients' = 'programming';

    constructor(
        private profileService: ProfileService,
        private programmingService: ProgrammingService,
        private packageService: PackageService,
        private responsibleService: ResponsibleService,
        private meetingService: MeetingService,
        private reservationService: ReservationsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.profileService.getCurrentUser().subscribe({
            next: (userData) => {
                if (userData.idRole === 2) {
                    this.getAllDatesByResponsible(userData.id);
                } else {
                    this.getAllDates();
                    this.getAllResponsibles();
                    this.getAllMeetings();
                }
            },
            error: (error) => console.error(error)
        });
        this.getAllPackages();
        this.getAllReservations();
    }

    getAllDates() {
        this.programmingService.getAll().subscribe({
            next: (dates) => {
                this.dates = dates;
            },
            error: (e) => {
                console.log(e);
            }
        });
    }

    getAllDatesByResponsible(idUser: number) {
        this.programmingService.getAllByResponsible(idUser).subscribe({
            next: (dates) => {
                this.dates = dates;
            },
            error: (e) => console.log(e)
        });
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
            error: (e) => console.error(e)
        });
    }

    getAllPackages() {
        this.packageService.getAll().subscribe({
            next: (packages) => {
                this.packages = packages;
            },
            error: (e) => console.error(e)
        });
    }

    getAllReservations() {
        this.reservationService.getAll().subscribe({
            next: (reservations) => {
                this.reservations = reservations;
            },
            error: (e) => console.error(e)
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
            error: (e) => console.error(e)
        });
    }

    getAllTravelers(idDate: number) {
        this.reservationService.getTravelers(idDate).subscribe({
            next: (reservations) => {
                this.clients = reservations.map((r) => r.detailReservationTravelers).flat();
            },
            error: (e: any) => console.error(e)
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
                            detail: `Programación actualizada correctamente`,
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
                            detail: `Programación creada correctamente`,
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

        if (this.meeting.id) {
            this.meetingService.update(this.meeting).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Encuentro actualizado correctamente`,
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
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Éxito',
                        detail: `Encuentro creado correctamente`,
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
                this.meeting = {
                    ...meeting,
                    hour: formatTime(meeting.hour)
                };
            },
            error: () => {
                this.meeting = new MeetingModel();
            }
        });
        this.dialogType = 'programming';
        this.dialogVisible = true;
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
                            detail: `Programación ${d.status ? 'activada' : 'desactivada'}`,
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

    clickDate(date: DateModel) {
        if (!date) return;

        if (this.authService.hasRole([ROLE_IDS.ADMIN])) {
            this.date = date;
            this.dialogType = 'programming';
            this.dialogVisible = true;
        } else {
            return;
        }
    }

    clickProgramming(id: number) {
        if (!id) return;

        const foundProgramming = this.dates.find((date) => date.id === id);
        if (!foundProgramming || foundProgramming.status === false) return;

        if (this.authService.hasRole([ROLE_IDS.ADMIN, ROLE_IDS.CLIENT])) {
            this.idDate = id;
            this.dialogType = 'reservation';
            this.dialogVisible = true;
        } else {
            return;
        }
    }

    toClients(id: number) {
        this.idDate = id;
        this.getAllTravelers(this.idDate);
        this.dialogType = 'clients';
        this.dialogVisible = true;
    }

    closePopup() {
        this.dialogVisible = false;
        this.submitted = false;
        this.refresh();
    }

    refresh() {
        this.date = new DateModel();
        this.dates = [];

        this.meeting = new MeetingModel();

        this.responsible = new ResponsibleModel();
        this.responsibles = [];

        this.packages = [];

        this.dialogVisible = false;
        this.submitted = false;

        this.profileService.getCurrentUser().subscribe({
            next: (userData) => {
                if (userData.idRole === 2) {
                    this.getAllDatesByResponsible(userData.id);
                } else {
                    this.getAllDates();
                    this.getAllResponsibles();
                    this.getAllMeetings();
                }
            },
            error: (error) => console.error(error)
        });
        this.getAllPackages();
        this.getAllReservations();
    }
}
