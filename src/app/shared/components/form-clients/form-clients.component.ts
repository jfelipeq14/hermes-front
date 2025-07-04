/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';

import { bloodTypes, epslist, sexlist, typesDocument } from '../../constants';
import { MunicipalityModel, ReservationModel, ReservationTravelerModel, UserModel } from '../../../models';
import { MunicipalityService } from '../../../services';
import { DatePickerModule } from 'primeng/datepicker';
import { PATTERNS } from '../../helpers';

@Component({
    selector: 'app-form-clients',
    templateUrl: './form-clients.component.html',
    styleUrls: ['./form-clients.component.scss'],
    imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, InputTextModule, InputIconModule, IconFieldModule, DatePickerModule],
    providers: [MunicipalityService, MessageService]
})
export class FormClientsComponent implements OnInit {
    constructor(
        private municipalityService: MunicipalityService,
        private messageService: MessageService
    ) {}

    @Input() reservation: ReservationModel = new ReservationModel();
    @Input() travel = false;
    @Input() travelers: ReservationTravelerModel[] = [];
    @Input() clients: UserModel[] = [];
    @Input() client: UserModel = new UserModel();
    @Input() submitted = false;
    @Input() isFormDisabled = false;

    @Output() searchClient = new EventEmitter<any>();
    @Output() createClient = new EventEmitter<any>();
    @Output() handleTravel = new EventEmitter<any>();
    @Output() clearClient = new EventEmitter<any>();

    typesDocument = typesDocument;
    sexlist = sexlist;
    bloodTypes = bloodTypes;
    epslist = epslist;
    municipalities: MunicipalityModel[] = [];
    pattern = PATTERNS;

    age = 0;
    maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

    getAllMunicipalities() {
        this.municipalityService.getAll().subscribe({
            next: (municipalities) => {
                this.municipalities = municipalities;
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

    ngOnInit(): void {
        this.getAllMunicipalities();
    }

    onChangeBirthDate(event: any) {
        if (!event.value) {
            return;
        }

        const birthDate = new Date(event.value);
        const today = new Date();
        this.age = today.getFullYear() - birthDate.getFullYear();
    }

    onHandleTravel(event: any) {
        this.handleTravel.emit(event.target.checked);
    }

    onCreateClient(user: UserModel) {
        this.createClient.emit(user);
    }

    onSearchClient(document: any) {
        if (!document) return;
        this.searchClient.emit(document);
    }

    onClearClient() {
        this.clearClient.emit();
    }
}
