import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TextareaModule } from 'primeng/textarea';
import { DateModel, MeetingModel, PackageModel, UserModel } from '../../../models';
import { ZONE } from '../../constants';
import { PATTERNS } from '../../helpers';

@Component({
    selector: 'app-form-programming',
    templateUrl: './form-programming.component.html',
    styleUrl: './form-programming.component.scss',
    imports: [CommonModule, FormsModule, ButtonModule, IconFieldModule, InputTextModule, InputNumberModule, InputIconModule, MultiSelectModule, TextareaModule, DatePickerModule, DropdownModule]
})
export class FormProgrammingComponent {
    constructor() {}

    @Input() date: DateModel = new DateModel();
    @Input() meeting: MeetingModel = new MeetingModel();
    @Input() packages: PackageModel[] = [];
    @Input() responsibles: UserModel[] = [];
    @Input() zones = ZONE;
    @Input() submitted = false;

    @Output() toSave = new EventEmitter<void>();
    @Output() toCancel = new EventEmitter<void>();

    today: Date = new Date();

    pattern = PATTERNS;

    validateProgramming() {
        return this.date.idPackage > 0 &&
            this.date.amount > 0 &&
            this.date.start &&
            this.date.end &&
            this.date.startRegistration &&
            this.date.endRegistration &&
            this.meeting.zone &&
            this.meeting.hour &&
            this.meeting.description &&
            this.meeting.responsibles.length > 0
            ? false
            : true;
    }

    onChangeResponsible(event: any) {
        if (!event.itemValue) return;

        const foundResponsible = this.meeting.responsibles.find((responsible) => responsible.idUser === event.itemValue.id);

        if (foundResponsible) {
            this.meeting.responsibles = this.meeting.responsibles.filter((responsible) => responsible.idUser !== foundResponsible.idUser);
        } else {
            this.meeting.responsibles.push({ idUser: event.itemValue.id });
        }
    }

    onCreateDate(date: DateModel) {
        if (!date) return;
        this.toSave.emit();
    }

    onClosePopup() {
        this.toCancel.emit();
    }
}
