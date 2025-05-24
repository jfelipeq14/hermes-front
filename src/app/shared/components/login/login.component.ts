import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { UserModel } from '../../../models';
import { AuthService } from '../../../services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { PATTERNS } from '../../helpers';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [ButtonModule, InputTextModule, PasswordModule, FormsModule, ToastModule, CommonModule, DialogModule],
    providers: [AuthService, MessageService]
})
export class LoginComponent {
    patterns = PATTERNS;

    constructor(
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    @Input() loginDialog!: boolean;
    @Input() submitted!: boolean;
    @Input() user: UserModel = new UserModel();

    @Output() showPopupRestore = new EventEmitter<void>();
    @Output() closePopup = new EventEmitter<void>();

    onSubmit() {
        this.submitted = true;

        this.authService.login(this.user).subscribe({
            next: (response) => {
                if (!response && !response.accessToken) return;

                this.authService.setTokens(response.accessToken);

                window.location.href = '/home';
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

    onOpenPopup() {
        this.showPopupRestore.emit();
    }
    onClosePopup() {
        this.closePopup.emit();
    }
}
