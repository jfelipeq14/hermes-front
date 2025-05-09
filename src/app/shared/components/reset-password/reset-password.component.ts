import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UserModel } from '../../../models';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    imports: [FormsModule, ButtonModule]
})
export class ResetPasswordComponent {
    @Input() user: UserModel = new UserModel();
    @Input() submitted = false;
    @Input() resetPasswordDialog = false;
    @Output() closeResetPassword = new EventEmitter<void>();

    onSubmit(form: NgForm) {
        this.submitted = true;
        if (form.valid) {
            alert('Se ha enviado un enlace de recuperación a su correo.');
        }
    }

    closePopup() {
        this.closeResetPassword.emit();
    }
}
