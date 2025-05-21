import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ResetModel, UserModel } from '../../../models';
import { AuthService } from '../../../services';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-restore-password',
    templateUrl: './restore-password.component.html',
    styleUrl: './restore-password.component.scss',
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
    providers: [AuthService, MessageService]
})
export class RestorePasswordComponent {
    constructor(
        private authService: AuthService,
        private messageService: MessageService
    ) {}

    @Input() resetModel: ResetModel = new ResetModel();
    @Input() user: UserModel = new UserModel();
    @Input() submitted = false;
    @Input() restoreDialog: boolean = false;

    @Output() showPopupReset = new EventEmitter<void>();
    @Output() closePopup = new EventEmitter<void>();

    onSubmit() {
        this.submitted = true;
        if (this.user.email) {
            this.authService.restorePassword(this.user.email).subscribe({
                next: (response) => {
                    if (!response) return;
                    this.resetModel.resetPasswordToken = response.token;
                    this.showPopupReset.emit();
                },
                error: (error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.error.message,
                        life: 3000
                    });
                }
            });
        }
    }

    onClosePopup() {
        this.closePopup.emit();
    }
}
