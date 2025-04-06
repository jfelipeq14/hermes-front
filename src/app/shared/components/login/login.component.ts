import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-login',
  imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, CommonModule],

  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email: string = '';

  password: string = '';

  checked: boolean = false;

  submitted: boolean = false;

  closePopup() {
    this.submitted = false;
    this.email = '';
    this.password = '';
    this.checked = false;
  }

  login(){
    this.submitted = true;
    if (this.email && this.password) {
      // Aquí puedes implementar la lógica de inicio de sesión
      console.log('Inicio de sesión exitoso:', this.email, this.password);
      this.closePopup();
    } else {
      console.log('Por favor, completa todos los campos.');
    }
  }

}

