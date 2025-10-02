/**
 * Formata data para formato brasileiro (DD/MM/YYYY)
 */
export function formatDateBR(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Retorna uma data com o horário zerado (00:00:00)
 */
export function getDateWithZeroTime(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}
