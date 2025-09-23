export function getCourseStats(course) {
  // Placeholder implementation
  return {
    id: course.id,
    title: course.title,
    totalDuration: '50h 32min 0s',
    hoursPerDay: '1h 48min 17s',
    hoursRemaining: '50h 32min 0s',
    targetDate: '31/10/2025',
    daysRemaining: 40,
    studyDays: 28,
    restDays: 12,
    restDayNames: ['Dom', 'Seg'],
    progressPercentage: '20%',
    progressCompleted: '0h 0min 0s',
    status: course.status,
  };
}