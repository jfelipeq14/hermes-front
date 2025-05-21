export class PaymentModel {
    id = 0;
    idReservation = 0;
    date = new Date();
    total = 0;
    pay = 0;
    voucher: string | null = null;
    status: 'R' | 'N' | 'P' | 'A' = 'R';
}
