import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common';
import { UserModel } from '../../../models';
import { AuthService } from '../../../services';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ToastModule,
    RouterModule,
    RippleModule,
    CommonModule,
  ],
  providers: [AuthService, MessageService],
})
export class LoginComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  @Input() loginDialog!: boolean;
  @Input() submitted!: boolean;
  @Input() user: UserModel = new UserModel();

  onSubmit() {
    this.submitted = true;
    console.log('on submit', this.user);

    this.authService.login(this.user).subscribe({
      next: (response) => {
        console.log(response);
        // this.router.navigate(['/home']);

        if (!response && !response.accessToken) return;

        this.authService.setTokens(response.accessToken);

        const roleId = this.authService.getDecodedAccessToken(
          response.accessToken
        ).idRole;

        this.authService.redirectBasedOnRole(roleId);
      },
      error: (e) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: e.error.message,
          life: 3000,
        });
      },
    });
  }

  onClose() {
    this.loginDialog = false;
    this.submitted = false;
  }
}
