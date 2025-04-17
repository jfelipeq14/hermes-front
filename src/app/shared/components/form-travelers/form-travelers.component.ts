import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormClientsComponent } from '../form-clients/form-clients.component';
import { UserModel } from '../../../models';

@Component({
  selector: 'app-form-travelers',
  imports: [ TableModule,ButtonModule,CommonModule,FormClientsComponent],
  templateUrl: './form-travelers.component.html',
  styleUrl: './form-travelers.component.css'
})
export class FormTravelersComponent {
  travelers:UserModel[] = []; // Lista de viajeros
}


