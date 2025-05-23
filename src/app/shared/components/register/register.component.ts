import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CommonModule } from '@angular/common';
import { ActivateModel, MunicipalityModel, UserModel } from '../../../models';
import { AuthService } from '../../../services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { typesDocument } from '../../constants';
import { DropdownModule } from 'primeng/dropdown';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [ButtonModule, FormsModule, CheckboxModule, InputTextModule, PasswordModule, DropdownModule, DatePickerModule, ToastModule, CommonModule],
    providers: [AuthService, MessageService]
})
export class RegisterComponent {
    constructor(
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    @Input() activateModel: ActivateModel = new ActivateModel();
    @Input() registerDialog: boolean = false;
    @Input() submitted: boolean = false;
    @Input() user: UserModel = new UserModel();
    @Input() municipalities: MunicipalityModel[] = [];
    @Output() closePopup = new EventEmitter<void>();

    typesDocument = typesDocument;

    maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

    onSubmit() {
        this.submitted = true;
        this.user.idRole = 3;
        this.authService.register(this.user).subscribe({
            next: (response) => {
                if (!response) return;

                this.activateModel.email = response.email;
                this.activateModel.activationUserToken = response.activationToken;

                this.authService.activateAccount(this.activateModel).subscribe({
                    next: (response) => {
                        if (!response) return;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Tu cuenta fue activada. Inicia sesión.',
                            life: 3000
                        });
                        this.registerDialog = false;
                    },
                    error: (e) => console.error(e)
                });
            },
            error: (e) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.error.message,
                    life: 3000
                });
                this.submitted = false;
            }
        });
    }
    onClosePopup() {
        this.registerDialog = false;
        this.closePopup.emit();
    }
}
