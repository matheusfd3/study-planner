export function validateCourseTitle(title) {
  if (title.trim().length === 0) {
    return { isValid: false, message: 'O título do curso é obrigatório.' };
  }

  if (title.trim().length < 3) {
    return { isValid: false, message: 'O título do curso deve ter pelo menos 3 caracteres.' };
  }

  if (title.trim().length > 30) {
    return { isValid: false, message: 'O título do curso não pode exceder 30 caracteres.' };
  }

  return { isValid: true, message: '' };
}

export function validateCourseDuration(duration) {
  if (duration.trim().length === 0) {
    return { isValid: false, message: 'A duração do curso é obrigatória.' };
  }

  const timePattern = /^(?:\d{2}):[0-5]\d:[0-5]\d$/;
  if (!timePattern.test(duration)) {
    return { isValid: false, message: 'A duração deve estar no formato HH:MM:SS.' };
  }

  if (duration === '00:00:00') {
    return { isValid: false, message: 'A duração do curso deve ser maior que 00:00:00.' };
  }

  return { isValid: true, message: '' };
}

export function validateTargetDate(targetDate) {
  if (targetDate.trim().length === 0) {
    return { isValid: false, message: 'Data de conclusão é obrigatória.' };
  }

  const inputDate = new Date(`${targetDate}T00:00:00`);
  const today = new Date();
  if (inputDate < today) {
    return { isValid: false, message: 'A data de conclusão deve ser uma data futura.' };
  }

  return { isValid: true, message: '' };
}

export function validateDaysOffWeek(selectedDays) {
  if (selectedDays.length >= 7) {
    return { isValid: false, message: 'Você deve ter pelo menos um dia de estudo por semana.' };
  }

  return { isValid: true, message: '' };
}
