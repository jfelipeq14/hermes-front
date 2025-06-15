import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ActivateModel, MunicipalityModel, RoleModel, UserModel } from '../../../models';
import { bloodTypes, epslist, sexlist, typesDocument } from '../../constants';
import { PATTERNS } from '../../helpers';
import { MunicipalityService, RolesService } from '../../../services';

@Component({
    selector: 'app-form-users',
    templateUrl: './form-users.component.html',
    styleUrl: './form-users.component.scss',
    imports: [CommonModule, FormsModule, ButtonModule, DropdownModule, InputTextModule, InputIconModule, DatePickerModule],
    providers: [MunicipalityService, RolesService]
})
export class FormUsersComponent implements OnInit {
    constructor(
        private municipalityService: MunicipalityService,
        private rolesService: RolesService
    ) {}

    ngOnInit(): void {
        this.getAllMunicipalities();
        this.getAllRoles();
    }

    @Input() user: UserModel = new UserModel();
    @Input() isFormDisabled = false;
    @Output() closePopup = new EventEmitter<void>();
    @Output() createUser = new EventEmitter<UserModel>();

    municipalities: MunicipalityModel[] = [];
    typesDocument = typesDocument;
    sexOptions = sexlist;
    bloodTypes = bloodTypes;
    epsList = epslist;
    roles: RoleModel[] = [];

    patterns = PATTERNS;

    maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));
    activateModel: ActivateModel = new ActivateModel();

    getAllMunicipalities() {
        this.municipalityService.getAll().subscribe({
            next: (municipalities) => {
                this.municipalities = municipalities;
            },
            error: (e) => console.error(e)
        });
    }

    getAllRoles() {
        this.rolesService.getAll().subscribe({
            next: (roles) => {
                this.roles = roles;
            },
            error: (e) => console.error(e)
        });
    }

    validateForm() {}

    onClosePopup() {
        this.closePopup.emit();
    }

    onSubmit() {
        this.createUser.emit(this.user);
    }
}
