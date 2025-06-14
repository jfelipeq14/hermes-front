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
import { PATTERNS } from '../../helpers';

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
    patterns = PATTERNS; // Agregar los patrones
    maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

    // Función de validación similar a la del componente de usuarios
    validateForm(): boolean {
        this.submitted = true;

        if (!this.user.typeDocument || !this.user.document || !this.user.name || !this.user.surName || !this.user.idMunicipality || !this.user.phone || !this.user.dateBirth || !this.user.email || !this.user.password) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'Por favor complete todos los campos obligatorios',
                life: 3000
            });
            return false;
        }

        if (!this.user.name.match(this.patterns.NAME)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'El nombre solo puede contener letras y debe tener mínimo 3 caracteres',
                life: 3000
            });
            return false;
        }

        if (!this.user.surName.match(this.patterns.NAME)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'El apellido solo puede contener letras y debe tener mínimo 3 caracteres',
                life: 3000
            });
            return false;
        }

        if (!this.user.email.match(this.patterns.EMAIL)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'El correo electrónico no es válido',
                life: 3000
            });
            return false;
        }

        if (!this.user.phone.match(this.patterns.PHONE)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'El número de teléfono no es válido',
                life: 3000
            });
            return false;
        }

        if (!this.user.password.match(this.patterns.PASSWORD)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error de validación',
                detail: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
                life: 3000
            });
            return false;
        }

        return true;
    }
    onSubmit() {
        if (!this.validateForm()) return;

        this.user.idRole = 3;
        this.messageService.add({
            severity: 'info',
            summary: 'Procesando',
            detail: 'Registrando usuario...',
            life: 2000
        });

        this.authService.register(this.user).subscribe({
            next: (response) => {
                if (!response) return;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Registro Exitoso',
                    detail: '¡Usuario registrado correctamente!',
                    life: 2000
                });

                this.activateModel.email = response.email;
                this.activateModel.activationUserToken = response.activationToken;

                this.authService.activateAccount(this.activateModel).subscribe({
                    next: (response) => {
                        if (!response) return;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Éxito',
                            detail: 'Tu cuenta fue creada. Inicia sesión.',
                            life: 3000
                        });
                        this.onClosePopup();
                    },
                    error: (e) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Error al activar la cuenta: ' + (e.error.message || 'Error desconocido'),
                            life: 3000
                        });
                    }
                });
            },
            error: (e) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: e.error.message === 'User already exists' ? 'El correo electrónico ya existe, ingrese otro correo por favor' : 'Error al crear el usuario: ' + (e.error.message || 'Error desconocido'),
                    life: 3000
                });
                this.submitted = false;
            }
        });
    }

    onClosePopup() {
        this.registerDialog = false;
        this.submitted = false;
        this.user = new UserModel();
        this.closePopup.emit();
    }
}
