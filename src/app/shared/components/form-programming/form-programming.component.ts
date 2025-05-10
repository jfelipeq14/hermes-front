import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

@Component({
    selector: 'app-form-programming',
    templateUrl: './form-programming.component.html',
    styleUrl: './form-programming.component.scss',
    imports: [CommonModule, FormsModule, ButtonModule, IconFieldModule, InputTextModule, InputNumberModule, InputIconModule, MultiSelectModule, TextareaModule, DatePickerModule, DropdownModule]
})
export class FormProgrammingComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        console.log('FormProgrammingComponent initialized');
    }

    @Input() date: DateModel = new DateModel();
    @Input() meeting: MeetingModel = new MeetingModel();
    @Input() packages: PackageModel[] = [];
    @Input() responsibles: UserModel[] = [];
    @Input() zones = ZONE;
    @Input() submitted = false;

    @Output() toSave = new EventEmitter<DateModel>();
    @Output() toCancel = new EventEmitter<void>();

    onChangeResponsible(event: any) {
        if (!event.value) return;

        this.meeting.responsibles = event.value.map((id: number) => ({
            idUser: id
        }));
    }

    onCreateDate(date: DateModel) {
        if (!date) return;
        this.toSave.emit(date);
    }

    onClosePopup() {
        this.toCancel.emit();
    }
}
