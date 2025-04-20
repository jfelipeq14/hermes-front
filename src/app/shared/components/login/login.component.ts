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
import { ROLE_IDS } from '../../../shared/constants/roles';

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
    this.authService.login(this.user).subscribe({
      next: (response) => {
        if (!response) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid credentials',
            life: 3000,
          });
          return;
        }
        console.log('User logged in successfully: ', response);
        
        if (response.token && response.user) {
          // Primero establecemos el token
          this.authService.setTokens(response.token);
          
          // Luego redirigimos según el rol
          const roleId = response.user.idRole;
          console.log('Redirecting user with role:', roleId);
          
          switch (roleId) {
            case ROLE_IDS.GUIDE:
              this.router.navigate(['/home/programming']);
              break;
            case ROLE_IDS.CLIENT:
              this.router.navigate(['/home/reservations']);
              break;
            case ROLE_IDS.ADMIN:
              this.router.navigate(['/home/dashboard']);
              break;
            default:
              console.error('Unknown role ID:', roleId);
              this.router.navigate(['/home']);
          }
        } else {
          console.error('Invalid response format:', response);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid server response',
            life: 3000,
          });
        }
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