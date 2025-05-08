// -- ESTADOS DE PAGO: REVISAR, PAGO, NO PAGO, ANULADO
export const getSeverityPayment = (status: string): string => {
  if (status === 'R') return 'warn';
  if (status === 'P') return 'success';
  if (status === 'N') return 'info';
  if (status === 'A') return 'danger';

  return 'warn';
};

export const getValuePayment = (status: string): string => {
  if (status === 'R') return 'Revisar';
  if (status === 'P') return 'Pagado';
  if (status === 'N') return 'No Pagado';
  if (status === 'A') return 'Anulado';

  return 'Revisar';
};

// --ESTADO DE RESERVA: Pendiente(no pago `N`), Confirmada(pago 50% `C`), Pagada(pago completo `P`), Modificada (M), Cancelada(No pago, no va `R`), En ejecución y Finalizada
export const getSeverityReservation = (status: string): string => {
  if (status === 'N') return 'warn';
  if (status === 'C') return 'secondary';
  if (status === 'P') return 'success';
  if (status === 'M') return 'help';
  if (status === 'R') return 'danger';
  if (status === 'E') return 'sucess';
  if (status === 'F') return 'contrast';

  return 'warn';
};

export const getValueReservation = (status: string): string => {
  if (status === 'N') return 'Pendiente';
  if (status === 'C') return 'Confirmada';
  if (status === 'P') return 'Pagada';
  if (status === 'M') return 'Modificada';
  if (status === 'R') return 'Cancelada';
  if (status === 'E') return 'En ejecución';
  if (status === 'F') return 'Finalizada';

  return 'Pendiente';
};
