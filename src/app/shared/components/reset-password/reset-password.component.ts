import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ResetModel } from '../../../models';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../../services';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [CommonModule, ButtonModule, InputTextModule, FormsModule],
    providers: [AuthService, MessageService]
})
export class ResetPasswordComponent {
    constructor(
        private authService: AuthService,
        private messageService: MessageService
    ) {}
    @Input() resetModel: ResetModel = new ResetModel();
    @Input() submitted = false;
    @Input() resetDialog = false;
    @Output() closePopup = new EventEmitter<void>();

    onSubmit() {
        this.authService.resetPassword(this.resetModel).subscribe({
            next: (response) => {
                if (!response) return;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.message,
                    life: 3000
                });
                this.closePopup.emit();
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

    onClosePopup() {
        this.closePopup.emit();
    }
}
