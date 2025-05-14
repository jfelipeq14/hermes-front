import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { MunicipalityModel, UserModel } from '../../../models';
import { AuthService } from '../../../services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { typesDocument } from '../../constants';
import { DropdownModule } from 'primeng/dropdown';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, DropdownModule, ToastModule, RouterModule, RippleModule, CommonModule],
    providers: [AuthService, MessageService]
})
export class RegisterComponent {
    constructor(
        private router: Router,
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    @Input() registerDialog!: boolean;
    @Input() submitted!: boolean;
    @Input() user: UserModel = new UserModel();
    @Input() municipalities: MunicipalityModel[] = [];

    // @Output() close = new EventEmitter<void>();

    typesDocument = typesDocument;

    onSubmit() {
        this.submitted = true;
        this.user.idRole = 3;
        this.authService.register(this.user).subscribe({
            next: (response) => {
                if (!response) return;
                this.authService.login(this.user).subscribe({
                    next: (response) => {
                        if (!response && !response.accessToken) return;
                        this.authService.setTokens(response.accessToken);
                        this.router.navigate(['/home']);
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

    // onCancel() {
    //   this.close.emit(); // Emite el evento al cancelar
    //   this.submitted = false; // Reinicia el estado de enviado
    //   this.user = new UserModel(); // Reinicia el modelo de usuario
    // }
}
