import { APP_CONFIG } from '../config.js';

export function calculateCourseStats(course) {
  // Datas e cálculo de dias
  const today = getDateWithZeroTime(new Date());
  const targetDate = parseTargetDate(course.targetDate);

  // Cálculo do período de estudo
  const { totalDays, studyDays, daysOff } = calculateStudyPeriod(today, targetDate, course.daysOff);

  // Nomes dos dias de descanso
  const daysOffNames = course.daysOff.map(day => APP_CONFIG.DAYS_SHORT[day]);

  // Cálculo de tempo e progresso
  const totalSeconds = convertTimeToSeconds(course.totalDuration);
  const completedSeconds = calculateCompletedStudyTime(course.studySessions);
  const remainingSeconds = Math.max(totalSeconds - completedSeconds, 0);

  // Cálculo do tempo de estudo diário necessário
  const dailyStudySeconds = calculateDailyStudyTime(remainingSeconds, studyDays);

  // Cálculo de porcentagem de progresso
  const progressPercentage = calculateProgressPercentage(completedSeconds, totalSeconds);
  
  return {
    id: course.id,
    title: course.title,
    totalDuration: formatTimeHMS(totalSeconds),
    hoursRemaining: formatTimeHMS(remainingSeconds),
    dailyStudy: formatTimeHMS(dailyStudySeconds),
    targetDate: formatDateBR(targetDate),
    totalDays: formatCountOrNone(totalDays),
    studyDays: formatCountOrNone(studyDays),
    daysOff: formatCountOrNone(daysOff),
    daysOffNames: daysOffNames.length > 0 ? daysOffNames : ['Nenhum'],
    progressPercentage: progressPercentage,
    progressCompleted: formatTimeHMS(completedSeconds),
    status: course.status,
  };
}

/**
 * Retorna uma data com o horário zerado (00:00:00)
 */
function getDateWithZeroTime(date) {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Converte string de data para objeto Date com horário zerado
 */
function parseTargetDate(dateStr) {
  return new Date(`${dateStr}T00:00:00`);
}

/**
 * Calcula estatísticas do período de estudo
 */
function calculateStudyPeriod(startDate, endDate, daysOffList) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const daysOffSet = new Set(daysOffList.map(day => day.toLowerCase()));
  
  let totalDays = 0;
  let studyDays = 0;
  let daysOff = 0;
  
  const current = new Date(startDate);
  
  while (current <= endDate) {
    totalDays++;
    const dayName = dayNames[current.getDay()];
    
    if (daysOffSet.has(dayName)) {
      daysOff++;
    } else {
      studyDays++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return { totalDays, studyDays, daysOff };
}

/**
 * Calcula o tempo total de estudo completado em segundos
 */
function calculateCompletedStudyTime(sessions) {
  return sessions.reduce((total, session) => {
    return total + convertTimeToSeconds(session.hoursStudied);
  }, 0);
}

/**
 * Calcula o tempo diário de estudo necessário em segundos
 */
function calculateDailyStudyTime(remainingSeconds, studyDays) {
  if (remainingSeconds === 0 || studyDays === 0) return 0;
  return Math.floor(remainingSeconds / studyDays);
}

/**
 * Calcula a porcentagem de progresso
 */
function calculateProgressPercentage(completed, total) {
  if (total === 0 || completed === 0) return '0%';
  const percentage = (completed / total) * 100;
  return `${Math.min(percentage, 100).toFixed(2)}%`;
}

/**
 * Converte string no formato "HH:MM:SS" para segundos
 */
function convertTimeToSeconds(timeStr) {
  const [hours, minutes, seconds] = timeStr.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Formata segundos para string no formato "Xh Ymin Zs"
 */
function formatTimeHMS(timeInSeconds) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;
  
  return `${hours}h ${minutes}min ${seconds}s`;
}

/**
 * Formata data para formato brasileiro (DD/MM/YYYY)
 */
function formatDateBR(date) {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formata contagem para exibição, retornando "Nenhum" para valores <= 0
 */
function formatCountOrNone(count) {
  if (count <= 0) {
    return 'Nenhum';
  } else if (count == 1) {
    return '1 dia';
  }
  return `${count} dias`;
}
