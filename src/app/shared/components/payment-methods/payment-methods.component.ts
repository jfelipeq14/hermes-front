import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-payment-methods',
    templateUrl: './payment-methods.component.html',
    styleUrls: ['./payment-methods.component.scss'],
    imports: [CommonModule, ButtonModule]
})
export class PaymentMethodsComponent {
    selectedMethod: 'nequi' | 'bancolombia' | 'davivienda' = 'nequi';

    selectPaymentMethod(method: 'nequi' | 'bancolombia' | 'davivienda'): void {
        this.selectedMethod = method;
    }
}
